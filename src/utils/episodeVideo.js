const BASE = "https://kushly.shop";

// mapeamento: episodio selecionado -> arquivo real na CDN
// ep5 não existe, então duplicamos o ep4
const EP_MAP = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 4, // <- duplicado
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
};

export function getEpisodeVideoUrl(n) {
  const mapped = EP_MAP[n] ?? null;
  if (!mapped) return null;
  return `${BASE}/ep${mapped}.mp4`;
}

export function hasRemoteEpisodeVideo(n) {
  return n >= 1 && n <= 10;
}
