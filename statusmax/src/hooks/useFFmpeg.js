import { useRef, useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/esm';

export function useFFmpeg() {
  const ffmpegRef = useRef(new FFmpeg());
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    try {
      const ffmpeg = ffmpegRef.current;
      ffmpeg.on('progress', ({ progress }) => 
        setProgress(Math.round(progress * 100)));
      ffmpeg.on('log', ({ message }) => 
        setLogs(l => [...l, message]));
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      setLoaded(true);
    } catch (e) {
      console.error("Error loading FFmpeg:", e);
    }
  };

  const process = async (file, settings) => {
    const ffmpeg = ffmpegRef.current;
    setProgress(0);
    const { resolution, preset, stripMetadata } = settings;

    await ffmpeg.writeFile('input.mp4', await fetchFile(file));

    // Preset Configs
    let crf = '28';
    let maxrate = '2000k';
    let bufsize = '4000k';

    if (preset === 'quality') {
        crf = '23';
        maxrate = '4000k';
        bufsize = '8000k';
    } else if (preset === 'compression') {
        crf = '32';
        maxrate = '1000k';
        bufsize = '2000k';
    }

    // Scale Filters
    let vf = '';
    if (resolution === '720') {
       vf = 'scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black';
    } else if (resolution === '1080') {
       vf = 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black';
    }

    let args = ['-i', 'input.mp4'];
    if (vf) args.push('-vf', vf);

    args.push(
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', crf,
      '-maxrate', maxrate,
      '-bufsize', bufsize,
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart'
    );

    if (stripMetadata) args.push('-map_metadata', '-1');
    args.push('-y', 'output.mp4');

    await ffmpeg.exec(args);
    const data = await ffmpeg.readFile('output.mp4');
    return new Blob([data.buffer], { type: 'video/mp4' });
  };

  return { load, process, progress, logs, loaded };
}