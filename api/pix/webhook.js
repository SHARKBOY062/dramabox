export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { status, external_id, plan, episode, user_id } = req.body;

  if (status !== "PAID") {
    return res.status(200).json({ ok: true });
  }

  const key = `user:${user_id}`;
  let data = (await KV.get(key, "json")) || {
    unlockedEpisodes: [],
    plan: "NONE",
  };

  if (plan === "FULL") {
    data.plan = "FULL";
  }

  if (episode && !data.unlockedEpisodes.includes(episode)) {
    data.unlockedEpisodes.push(episode);
  }

  await KV.put(key, JSON.stringify(data));

  res.status(200).json({ success: true });
}
