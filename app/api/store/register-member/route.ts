import { NextRequest, NextResponse } from "next/server";
import { dbRegisterMember } from "@/lib/store/membership";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`store-member-reg:${ip}`, 15, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = await dbRegisterMember({
      email: String(body.email || "").trim(),
      displayName: body.displayName ? String(body.displayName).trim() : undefined,
      phone: body.phone ? String(body.phone).trim() : undefined,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      memberId: result.id,
      message: "You're on the DoyinStore member list. Use the same email at checkout.",
    });
  } catch {
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
