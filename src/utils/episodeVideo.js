export function getEpisodeVideoUrl(n) {
  return new URL(`../assets/video/ep${n}.mp4`, import.meta.url).href;
}

export function hasLocalEpisodeVideo(n) {
  // você disse que tem ep1.mp4 até ep10.mp4
  return n >= 1 && n <= 10;
}
