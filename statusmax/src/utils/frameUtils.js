// Frame extraction helpers
export async function extractFrameWithCallback(video) {
  if ('requestVideoFrameCallback' in HTMLVideoElement.prototype) {
    return new Promise((resolve) => {
      video.requestVideoFrameCallback((now, metadata) => {
        resolve(metadata);
      });
    });
  }
  return null;
}