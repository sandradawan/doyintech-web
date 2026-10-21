import { NextRequest, NextResponse } from "next/server";
import { startSubscriptionCheckout } from "@/lib/subscriptions/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { limitRequest } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Starts a Paystack subscription checkout. Signed-in users subscribe with their account
 * email (so access follows the account); otherwise the email typed at checkout is used and
 * the buyer signs in with it afterwards.
 */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "sub-checkout", 10, 60_000);
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const planId = String(body.planId || "").trim();
  const user = await userFromBearer(req);
  const email = (user?.email || String(body.email || "")).trim().toLowerCase();
  const name = String(body.name || "").trim().slice(0, 120);

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const result = await startSubscriptionCheckout({ planId, email, name });
  if (!result.ok) {
    return NextResponse.json({ error: result.error, code: "CHECKOUT_FAILED" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, authorization_url: result.authorizationUrl });
}
