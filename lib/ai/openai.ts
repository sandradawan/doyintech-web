/**
 * Optional OpenAI polish via fetch (no SDK dependency).
 * Set OPENAI_API_KEY (+ optional OPENAI_MODEL) in Vercel env.
 */

export function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function polishWithOpenAi(
  text: string,
  instruction: string,
  opts?: { maxTokens?: number }
): Promise<string> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return text;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const max_tokens = opts?.maxTokens ?? 1800;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens,
        messages: [
          {
            role: "system",
            content:
              "You are a professional writing assistant for DoyinTech. Improve clarity and usefulness. Do not invent facts, numbers, legal claims, or citations. Keep markdown structure when present.",
          },
          {
            role: "user",
            content: `${instruction}\n\n---\n\n${text}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("openai polish failed", res.status, await res.text().catch(() => ""));
      return text;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const out = data.choices?.[0]?.message?.content?.trim();
    return out || text;
  } catch (e) {
    console.error("openai polish error", e);
    return text;
  }
}
