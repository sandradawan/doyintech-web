import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { activeSubscriptions, manageLink } from "@/lib/subscriptions/server";
import { getPlan } from "@/lib/subscriptions/plans";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** The signed-in user's memberships, and whether they include Pro. */
export async function GET(req: NextRequest) {
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const subs = await activeSubscriptions(user.email);
  return NextResponse.json(
    {
      email: user.email,
      pro: subs.some((s) => getPlan(s.planId)?.family === "pro"),
      subscriptions: subs.map((s) => ({
        planId: s.planId,
        name: getPlan(s.planId)?.name || s.planId,
        status: s.status,
        nextPaymentDate: s.nextPaymentDate,
        manageable: Boolean(s.subscriptionCode),
      })),
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

/** Returns a Paystack-hosted link to update the card or cancel a subscription the user owns. */
export async function POST(req: NextRequest) {
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const planId = String(body.planId || "");
  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data } = await sb
    .from("subscriptions")
    .select("subscription_code")
    .ilike("email", user.email)
    .eq("plan_id", planId)
    .not("subscription_code", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data?.subscription_code) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  const link = await manageLink(data.subscription_code);
  if (!link) return NextResponse.json({ error: "Could not open billing. Try again shortly." }, { status: 502 });
  return NextResponse.json({ ok: true, link });
}
