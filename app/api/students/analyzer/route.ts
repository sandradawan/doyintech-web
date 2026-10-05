import { NextRequest, NextResponse } from "next/server";
import { analyzeQuestionnaireCsv } from "@/lib/students/analyzer";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`student-analyzer:${ip}`, 15, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many analyses." }, { status: 429 });
    }

    const body = await req.json();
    const csvText = String(body.csv || body.text || "");
    if (csvText.trim().length < 10) {
      return NextResponse.json({ error: "Paste or upload CSV text." }, { status: 400 });
    }

    const result = analyzeQuestionnaireCsv(csvText);
    return NextResponse.json({ ok: true, result });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Analysis failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
