export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, name, document, phone, episode } = req.body;

    if (!amount || !episode) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const external_id = `EP${episode}-${Date.now()}`;

    const response = await fetch(
      `${process.env.PIX_API_URL}/transaction/pix`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Key": process.env.PIX_AUTH_KEY,
          "X-Secret-Key": process.env.PIX_SECRET_KEY,
        },
        body: JSON.stringify({
          amount: Number(amount),
          name: name || "Cliente Dramabox",
          document: document || "00000000000",
          phone: phone || "11999999999",
          external_id,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      return res.status(400).json(data);
    }

    return res.status(200).json({
      success: true,
      external_id,
      qr_code: data.qr_code_text,
      transaction_id: data.transaction_id,
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao criar PIX" });
  }
}
