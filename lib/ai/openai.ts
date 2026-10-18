/**
 * OpenAI helpers for DoyinTech AI Tools.
 * Set OPENAI_API_KEY (+ optional OPENAI_MODEL) in Vercel.
 */

export function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim() || process.env.AI_API_KEY?.trim());
}

function apiKey(): string {
  return (process.env.OPENAI_API_KEY || process.env.AI_API_KEY || "").trim();
}

export async function polishWithOpenAi(
  text: string,
  instruction: string,
  opts?: { maxTokens?: number }
): Promise<string> {
  const key = apiKey();
  if (!key) return text;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const max_tokens = opts?.maxTokens ?? 2200;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens,
        messages: [
          {
            role: "system",
            content:
              "You are a senior professional writer for DoyinTech, serving paying clients and serious SME operators. " +
              "Rewrite the draft into polished, boardroom-ready language: clear, specific, confident, and useful. " +
              "Prefer short paragraphs and crisp bullets. Never invent facts, numbers, legal claims, testimonials, or citations. " +
              "Preserve markdown structure when present. Do not add fluff or hype.",
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

/** JSON-mode completion for structured AI outputs (pitch decks, etc.). */
export async function openAiJson<T = unknown>(
  system: string,
  user: string,
  opts?: { maxTokens?: number; temperature?: number }
): Promise<T | null> {
  const key = apiKey();
  if (!key) return null;

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: opts?.temperature ?? 0.45,
        max_tokens: opts?.maxTokens ?? 2500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      console.error("openai json failed", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content?.trim();
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error("openai json error", e);
    return null;
  }
}
