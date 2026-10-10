import { NextRequest, NextResponse } from "next/server";
import {
  MODE_META,
  runGenerator,
  type GenerateMode,
} from "@/lib/ai/sector-generators";
import { hasOpenAiKey, polishWithOpenAi } from "@/lib/ai/openai";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const VALID = new Set(Object.keys(MODE_META));

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`ai-gen:${ip}`, 40, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = (await req.json()) as Record<string, unknown>;
    const mode = String(body.mode || "").trim() as GenerateMode;
    const useLlm = Boolean(body.useLlm);

    if (!VALID.has(mode)) {
      return NextResponse.json(
        { error: `Unknown mode. Valid: ${[...VALID].join(", ")}` },
        { status: 400 }
      );
    }

    let text = runGenerator(mode, body);
    let llm = false;

    if (useLlm && hasOpenAiKey()) {
      text = await polishWithOpenAi(text, MODE_META[mode].polishHint);
      llm = true;
    }

    return NextResponse.json({
      ok: true,
      text,
      meta: {
        mode,
        sector: MODE_META[mode].sector,
        label: MODE_META[mode].label,
      },
      llm,
      llmAvailable: hasOpenAiKey(),
    });
  } catch (e) {
    console.error("ai generate error", e);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    llmAvailable: hasOpenAiKey(),
    modes: Object.entries(MODE_META).map(([mode, m]) => ({
      mode,
      ...m,
    })),
  });
}
