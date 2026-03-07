// api/reading.js — Vercel Serverless Function (Streaming)
// Streams Anthropic response as Server-Sent Events so Vercel
// never hits a timeout — data flows continuously from first token.

export const config = { maxDuration: 300 }; // Vercel Pro allows up to 300s

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_KEY not set" });
    return;
  }

  // ── Set SSE headers so browser reads the stream in real-time ──
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable Nginx buffering on Vercel
  res.flushHeaders();

  const send = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    // res.flush exists on some Node versions; call if available
    if (typeof res.flush === "function") res.flush();
  };

  try {
    const { model, max_tokens, messages, system } = req.body;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "messages-2023-12-15",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-20250514",
        max_tokens: max_tokens || 16000,
        stream: true,
        ...(system ? { system } : {}),
        messages,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      send({ type: "error", error: `Anthropic API error: ${anthropicRes.status} — ${errText}` });
      res.end();
      return;
    }

    // ── Stream the response body chunk by chunk ──
    const reader = anthropicRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep incomplete line in buffer

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const raw = line.slice(6).trim();
        if (raw === "[DONE]") continue;

        try {
          const evt = JSON.parse(raw);
          // Forward only the events the frontend needs
          if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
            send({ type: "delta", text: evt.delta.text });
          } else if (evt.type === "message_stop") {
            send({ type: "done" });
          } else if (evt.type === "error") {
            send({ type: "error", error: evt.error?.message || "Unknown stream error" });
          }
        } catch {
          // skip malformed events
        }
      }
    }

    // Ensure done is always sent
    send({ type: "done" });
    res.end();

  } catch (err) {
    send({ type: "error", error: err.message });
    res.end();
  }
}
