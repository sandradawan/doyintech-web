import { NextRequest, NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { runPixelAudit } from "@/lib/meta/pixel-audit";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`pixel-audit:${ip}`, 8, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many audits from this network. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const url = String(body.url || "").trim();
    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const report = await runPixelAudit(url);
    return NextResponse.json({ ok: true, report });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Audit failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
