import { NextRequest, NextResponse } from "next/server";
import {
  runStudioScaffold,
  STUDIO_META,
  type StudioMode,
} from "@/lib/ai/extra-generators";
import { hasOpenAiKey, openAiText, polishWithOpenAi } from "@/lib/ai/openai";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const VALID = new Set(Object.keys(STUDIO_META));

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`ai-studio:${ip}`, 25, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = (await req.json()) as Record<string, unknown>;
    const mode = String(body.mode || "").trim() as StudioMode;
    const preferLlm = body.useLlm !== false;

    if (!VALID.has(mode)) {
      return NextResponse.json(
        { error: `Unknown mode. Valid: ${[...VALID].join(", ")}` },
        { status: 400 }
      );
    }

    const meta = STUDIO_META[mode];
    let text = runStudioScaffold(mode, body);
    let llm = false;

    if (preferLlm && hasOpenAiKey()) {
      const userPayload = [
        `Mode: ${meta.label}`,
        `Instruction: ${meta.polishHint}`,
        ``,
        `Operator inputs (JSON):`,
        JSON.stringify(body, null, 2),
        ``,
        `Starter draft to improve:`,
        text,
      ].join("\n");

      const generated = await openAiText(meta.system, userPayload, {
        maxTokens: 2800,
        temperature: 0.45,
      });
      if (generated) {
        text = generated;
        llm = true;
      } else {
        text = await polishWithOpenAi(text, meta.polishHint);
        llm = hasOpenAiKey();
      }
    }

    return NextResponse.json({
      ok: true,
      text,
      meta: { mode, label: meta.label },
      llm,
      llmAvailable: hasOpenAiKey(),
    });
  } catch (e) {
    console.error("ai studio error", e);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    llmAvailable: hasOpenAiKey(),
    modes: Object.entries(STUDIO_META).map(([mode, m]) => ({
      mode,
      label: m.label,
    })),
  });
}
