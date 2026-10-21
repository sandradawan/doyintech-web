import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { limitRequest } from "@/lib/rate-limit";
import { nextSendAt, sendNurtureEmail } from "@/lib/newsletter/sequence";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OK = { ok: true, message: "You're in. Check your inbox for the welcome email." };

/** Joins the email list and sends the welcome email. Same reply whether new or existing. */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "newsletter", 5, 60 * 60 * 1000);
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  if (body.website) return NextResponse.json(OK); // honeypot

  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim().slice(0, 80) || null;
  const source = String(body.source || "site").trim().slice(0, 60);
  const referral = String(body.referral || "").trim().slice(0, 40) || null;
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Sign-up is temporarily unavailable." }, { status: 503 });

  const { data: existing } = await sb
    .from("email_subscribers")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  // Existing subscribers (including people who unsubscribed) are left as they are.
  if (existing) return NextResponse.json(OK);

  const { data: created, error } = await sb
    .from("email_subscribers")
    .insert({ email, name, source, referral, step: 0, next_send_at: nextSendAt(0) })
    .select("unsubscribe_token")
    .single();
  if (error || !created) {
    console.error("newsletter insert", error?.message);
    return NextResponse.json({ error: "Could not sign you up. Try again shortly." }, { status: 500 });
  }

  await sendNurtureEmail({ step: 0, email, name, token: created.unsubscribe_token });
  return NextResponse.json(OK);
}
