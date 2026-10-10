import { NextRequest, NextResponse } from "next/server";
import { generatePitchDeck } from "@/lib/ai/pitch";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`pitch:${ip}`, 15, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const projectName = String(body.projectName || "").trim();
    const description = String(body.description || "").trim();
    const url = String(body.url || "").trim();
    const audience = String(body.audience || "").trim();
    const ask = String(body.ask || "").trim();

    if (!projectName || !description) {
      return NextResponse.json(
        { error: "Project name and description are required" },
        { status: 400 }
      );
    }

    const result = await generatePitchDeck({
      projectName,
      description,
      url,
      audience,
      ask,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    console.error("pitch error", e);
    return NextResponse.json({ error: "Pitch generation failed" }, { status: 500 });
  }
}
