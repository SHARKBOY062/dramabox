export default async function handler(req, res) {
  const { userId, episode } = req.query;

  const key = `user:${userId}`;
  const data = await KV.get(key, "json");

  if (!data) {
    return res.json({ allowed: episode <= 5 });
  }

  if (data.plan === "FULL") {
    return res.json({ allowed: true });
  }

  if (data.unlockedEpisodes?.includes(Number(episode))) {
    return res.json({ allowed: true });
  }

  return res.json({ allowed: false });
}
