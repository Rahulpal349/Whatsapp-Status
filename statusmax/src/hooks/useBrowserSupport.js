import { useState, useEffect } from 'react';

export function useBrowserSupport() {
  const [support, setSupport] = useState(null);

  useEffect(() => {
    const check = async () => {
      const hasWebCodecs = 
        typeof VideoEncoder !== 'undefined' &&
        typeof VideoDecoder !== 'undefined' &&
        typeof VideoFrame  !== 'undefined';

      if (!hasWebCodecs) {
        setSupport({ supported: false, reason: 'WebCodecs API not available' });
        return;
      }

      // Check H.264 hardware encoding support
      try {
        const h264Support = await VideoEncoder.isConfigSupported({
          codec: 'avc1.42001f',
          width: 720,
          height: 1280,
          bitrate: 1_200_000,
          framerate: 30,
          hardwareAcceleration: 'prefer-hardware',
        });

        setSupport({
          supported: true,
          hardwareAccelerated: h264Support.supported,
          codec: h264Support.supported ? 'avc1.42001f' : 'avc1.4d001f',
        });
      } catch (err) {
        setSupport({ supported: false, reason: err.message });
      }
    };
    check();
  }, []);

  return support;
}