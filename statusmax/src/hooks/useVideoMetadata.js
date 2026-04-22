export function useVideoMetadata() {
  const extractMetadata = async (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      video.src = url;
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        resolve({
          duration:    video.duration,        // seconds
          width:       video.videoWidth,
          height:      video.videoHeight,
          aspectRatio: video.videoWidth / video.videoHeight,
          fileSize:    file.size,
          fileName:    file.name,
          fileType:    file.type,
        });
        URL.revokeObjectURL(url);
      };
    });
  };

  // Extract first frame as thumbnail using canvas
  const extractThumbnail = async (file) => {
    return new Promise((resolve) => {
      const video  = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx    = canvas.getContext('2d');
      const url    = URL.createObjectURL(file);

      video.src = url;
      video.currentTime = 0.5; // 0.5s frame
      video.onseeked = () => {
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
        URL.revokeObjectURL(url);
      };
    });
  };

  return { extractMetadata, extractThumbnail };
}