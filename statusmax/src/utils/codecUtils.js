// Codec utility helpers
export function getCodecString(codec, profile, level) {
  return `${codec}.${profile}${level}`;
}