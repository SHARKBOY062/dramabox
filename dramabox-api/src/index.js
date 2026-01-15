export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* ======================
       CORS
    ====================== */
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };

    /* ======================
       HEALTH CHECK
       GET /
    ====================== */
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(
        JSON.stringify({
          ok: true,
          service: "dramabox-api",
          time: Date.now(),
        }),
        { headers }
      );
    }

    /* ======================
       CRIAR PIX
       POST /pix/create
    ====================== */
    if (url.pathname === "/pix/create" && request.method === "POST") {
      try {
        const body = await request.json();

        if (!body.amount || !body.episode) {
          return new Response(
            JSON.stringify({ error: "INVALID_BODY" }),
            { status: 400, headers }
          );
        }

        const external_id = `dramabox-${Date.now()}`;

        const pixRes = await fetch("https://bsxnex.live/api/transaction/pix", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Key": env.BSX_AUTH_KEY,
            "X-Secret-Key": env.BSX_SECRET_KEY,
          },
          body: JSON.stringify({
            amount: body.amount,
            name: body.name || "Cliente Dramabox",
            document: body.document || "00000000000",
            phone: body.phone || "11999999999",
            external_id,
          }),
        });

        if (!pixRes.ok) {
          throw new Error("BSX_ERROR");
        }

        const pix = await pixRes.json();

        await env.PAYMENTS_KV.put(
          external_id,
          JSON.stringify({
            status: "pending",
            episode: body.episode,
            created_at: Date.now(),
          })
        );

        return new Response(
          JSON.stringify({
            external_id,
            qr_code_text: pix.qr_code_text,
          }),
          { headers }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "PIX_CREATE_FAILED" }),
          { status: 500, headers }
        );
      }
    }

    /* ======================
       STATUS PIX
       GET /pix/status/:id
    ====================== */
    if (url.pathname.startsWith("/pix/status/")) {
      const external_id = url.pathname.split("/").pop();

      if (!external_id) {
        return new Response(
          JSON.stringify({ error: "INVALID_ID" }),
          { status: 400, headers }
        );
      }

      const data = await env.PAYMENTS_KV.get(external_id);

      return new Response(
        JSON.stringify(
          data ? JSON.parse(data) : { status: "not_found" }
        ),
        { headers }
      );
    }

    /* ======================
       WEBHOOK PIX
       POST /pix/webhook
    ====================== */
    if (url.pathname === "/pix/webhook" && request.method === "POST") {
      try {
        const body = await request.json();

        if (body.status === "PAID" && body.external_id) {
          const record = await env.PAYMENTS_KV.get(body.external_id);

          if (record) {
            const parsed = JSON.parse(record);
            parsed.status = "paid";
            parsed.paid_at = Date.now();

            await env.PAYMENTS_KV.put(
              body.external_id,
              JSON.stringify(parsed)
            );
          }
        }

        return new Response(
          JSON.stringify({ ok: true }),
          { headers }
        );
      } catch {
        return new Response(
          JSON.stringify({ error: "WEBHOOK_ERROR" }),
          { status: 400, headers }
        );
      }
    }

    /* ======================
       NOT FOUND
    ====================== */
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers }
    );
  },
};
