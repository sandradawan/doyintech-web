import { NextRequest, NextResponse } from "next/server";
import { dbRegisterDeveloper } from "@/lib/store/membership";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { hashPassword, validatePasswordPolicy } from "@/lib/store/password";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`store-dev-reg:${ip}`, 10, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const password = String(body.password || "");
    const policyErr = validatePasswordPolicy(password);
    if (policyErr) {
      return NextResponse.json({ error: policyErr }, { status: 400 });
    }

    const result = await dbRegisterDeveloper({
      displayName: String(body.displayName || "").trim(),
      email: String(body.email || "").trim(),
      passwordHash: hashPassword(password),
      phone: body.phone ? String(body.phone).trim() : undefined,
      website: body.website ? String(body.website).trim() : undefined,
      bio: body.bio ? String(body.bio).trim() : undefined,
      companyName: body.companyName ? String(body.companyName).trim() : undefined,
      country: body.country ? String(body.country).trim() : "NG",
      agreedTerms: Boolean(body.agreedTerms),
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      developerId: result.id,
      membershipStatus: result.membershipStatus,
      message:
        result.membershipStatus === "pending"
          ? "Application received. We review new developers before first publish."
          : "Developer account ready.",
    });
  } catch {
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
