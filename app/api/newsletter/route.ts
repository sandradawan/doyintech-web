import { NextRequest, NextResponse, after } from "next/server";
import { limitRequest } from "@/lib/rate-limit";
import { enrollSubscriber } from "@/lib/newsletter/enroll";
import { recordEvent } from "@/lib/analytics/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OK = { ok: true, message: "You're in. Check your inbox for the welcome email." };

/**
 * Joins the email list and sends the first email. Same reply whether new or existing.
 * `sequence: "tools"` is used by the free tools' "email me" boxes; anything else gets the general one.
 */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "newsletter", 5, 60 * 60 * 1000);
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  if (body.website) return NextResponse.json(OK); // honeypot

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  const source = String(body.source || "site").trim().slice(0, 60);
  const sequence = body.sequence === "tools" ? "tools" : "general";

  const result = await enrollSubscriber({
    email,
    name: String(body.name || "").trim() || null,
    source,
    referral: String(body.referral || "").trim() || null,
    sequence,
  });
  if (result === "unavailable") {
    return NextResponse.json({ error: "Sign-up is temporarily unavailable." }, { status: 503 });
  }
  if (result === "created") after(() => recordEvent("newsletter_signup", { req, label: source }));
  return NextResponse.json(OK);
}
