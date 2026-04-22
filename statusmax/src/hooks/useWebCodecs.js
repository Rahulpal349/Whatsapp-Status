import { useState, useRef } from 'react';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { useBrowserSupport } from './useBrowserSupport';

export function useWebCodecs() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [stage, setStage] = useState('');
  const [error, setError] = useState(null);
  const [time, setTime] = useState(0);
  const [fps, setFps] = useState(0);
  const cancelRef = useRef(false);
  const support = useBrowserSupport();

  const process = async (file, settings) => {
    cancelRef.current = false;
    setStatus('loading');
    setProgress(0);
    const startTime = performance.now();

    try {
      const targetWidth  = settings.resolution === 'original' ? undefined : parseInt(settings.resolution) || 720;
      let targetHeight = targetWidth ? Math.round(targetWidth * 16/9) : 1280; // approximate for 9:16
      if (targetHeight % 2 !== 0) targetHeight++; // must be even

      const videoBitrate = settings.preset === 'quality' ? 2_500_000 : settings.preset === 'compression' ? 800_000 : 1_200_000;
      const audioBitrate = 128_000;
      const targetFps = 30;

      // 1. Decode video into frames via HTMLVideoElement + canvas
      setStage('Extracting video frames...');
      setStatus('decoding');

      const videoElement = document.createElement('video');
      videoElement.src = URL.createObjectURL(file);
      videoElement.muted = true;
      videoElement.playsInline = true;
      await videoElement.play();
      videoElement.pause();
      
      const duration = videoElement.duration || 30; // process whole video
      const totalFrames = Math.ceil(duration * targetFps);
      
      // Override resolution if 'original'
      const finalWidth = targetWidth || videoElement.videoWidth;
      const finalHeight = targetWidth ? targetHeight : videoElement.videoHeight;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      canvas.width = finalWidth;
      canvas.height = finalHeight;

      // 3. Setup mp4-muxer
      setStage('Initializing encoder...');
      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
          codec: 'avc',
          width: finalWidth,
          height: finalHeight,
        },
        audio: {
          codec: 'aac',
          sampleRate: 44100,
          numberOfChannels: 2,
        },
        fastStart: 'in-memory',
      });

      // 4. Setup VideoEncoder
      setStage('Configuring GPU encoder...');
      setStatus('encoding');
      let encodedFrames = 0;

      const videoEncoder = new VideoEncoder({
        output: (chunk, meta) => {
          muxer.addVideoChunk(chunk, meta);
        },
        error: (e) => { throw new Error(`Encoder error: ${e.message}`); },
      });

      const config = {
        codec: support?.codec || 'avc1.42001f', // H.264 Baseline
        width: finalWidth,
        height: finalHeight,
        bitrate: videoBitrate,
        framerate: targetFps,
        hardwareAcceleration: 'prefer-hardware',
        avc: { format: 'avc' },
      };

      try {
        await videoEncoder.configure(config);
      } catch (e) {
        if (e.name === 'NotSupportedError') {
          // Fallback to software codec
          videoEncoder.configure({
            ...config,
            hardwareAcceleration: 'prefer-software',
            codec: 'avc1.4d001f', // H.264 Main Profile fallback
          });
        } else {
          throw e;
        }
      }

      // 5. Setup AudioEncoder
      const audioEncoder = new AudioEncoder({
        output: (chunk, meta) => {
          muxer.addAudioChunk(chunk, meta);
        },
        error: (e) => console.warn('Audio encode error:', e),
      });

      audioEncoder.configure({
        codec: 'mp4a.40.2', // AAC-LC
        sampleRate: 44100,
        numberOfChannels: 2,
        bitrate: audioBitrate,
      });

      // 6. Process audio via Web Audio API
      try {
        setStage('Processing audio...');
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        const startSample = 0;
        const endSample = Math.floor(duration * 44100);
        const frameSize = 1024;

        for (let i = startSample; i < endSample; i += frameSize) {
          if (cancelRef.current) throw new Error('Cancelled');
          const chunkSize = Math.min(frameSize, endSample - i);
          const channelData = [];
          for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
            channelData.push(audioBuffer.getChannelData(c).slice(i, i + chunkSize));
          }
          const audioData = new AudioData({
            format: 'f32-planar',
            sampleRate: 44100,
            numberOfFrames: chunkSize,
            numberOfChannels: audioBuffer.numberOfChannels,
            timestamp: Math.round(((i - startSample) / 44100) * 1_000_000),
            data: channelData,
          });
          audioEncoder.encode(audioData);
          audioData.close();
        }
        await audioEncoder.flush();
      } catch (err) {
        console.warn("Audio processing failed or skipped", err);
      }

      // 7. Encode video frames
      setStage('Encoding video frames (GPU)...');
      const frameInterval = 1 / targetFps;

      for (let i = 0; i < totalFrames; i++) {
        if (cancelRef.current) throw new Error('Cancelled');

        if (videoEncoder.encodeQueueSize > 30) {
          await new Promise(r => setTimeout(r, 10)); // Throttle
        }

        // Seek to exact frame time
        await seekVideo(videoElement, i * frameInterval);

        // Draw frame to canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, finalWidth, finalHeight);
        
        // simple contain scaling
        const inputAR = videoElement.videoWidth / videoElement.videoHeight;
        const targetAR = finalWidth / finalHeight;
        let drawW, drawH, offsetX, offsetY;
        
        if (inputAR > targetAR) {
          drawW = finalWidth;
          drawH = Math.round(finalWidth / inputAR);
          offsetX = 0;
          offsetY = Math.round((finalHeight - drawH) / 2);
        } else {
          drawH = finalHeight;
          drawW = Math.round(finalHeight * inputAR);
          offsetX = Math.round((finalWidth - drawW) / 2);
          offsetY = 0;
        }

        ctx.drawImage(videoElement, offsetX, offsetY, drawW, drawH);

        // Create VideoFrame from canvas
        const timestamp = Math.round((i / targetFps) * 1_000_000); // microseconds
        const frame = new VideoFrame(canvas, { timestamp });

        const keyFrame = i % (targetFps * 2) === 0;
        videoEncoder.encode(frame, { keyFrame });
        frame.close();

        encodedFrames++;
        setProgress(10 + Math.round((encodedFrames / Math.max(1, totalFrames)) * 80));
      }

      // 8. Flush encoders + finalize mux
      setStage('Finalizing file...');
      setStatus('muxing');
      setProgress(92);
      await videoEncoder.flush();
      muxer.finalize();

      // 9. Return output Blob
      setProgress(100);
      setStatus('done');
      setStage('Complete!');
      
      const endTime = performance.now();
      const processTime = ((endTime - startTime) / 1000).toFixed(1);
      setTime(processTime);
      setFps(Math.round(totalFrames / processTime));

      const { buffer } = muxer.target;
      return new Blob([buffer], { type: 'video/mp4' });

    } catch (err) {
      if (err.message === 'Cancelled') {
        setStatus('idle');
        setStage('');
        return null;
      }
      setStatus('error');
      setError(err.message);
      throw err;
    }
  };

  const seekVideo = (video, time) => new Promise((resolve) => {
    video.currentTime = time;
    video.onseeked = resolve;
  });

  const cancel = () => { cancelRef.current = true; };
  const reset = () => {
    setProgress(0);
    setStatus('idle');
    setStage('');
    setError(null);
    setTime(0);
    setFps(0);
  };

  return { process, cancel, reset, progress, status, stage, error, time, fps };
}