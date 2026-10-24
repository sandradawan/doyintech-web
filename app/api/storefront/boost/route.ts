import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { db, paystack, storeForOwner } from "@/lib/storefront/server";
import { BOOST_PLANS } from "@/lib/storefront/shared";
import { BOOST_REF_RE, markBoostPaid, newBoostRef } from "@/lib/storefront/boosts";
import type { PaystackTx } from "@/lib/payments/purchase";
import { limitRequest } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";

/** Seller: status of a boost payment. ?ref=BST_… (verifies with Paystack while pending). */
export async function GET(req: NextRequest) {
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const store = await storeForOwner(user.id);
  const ref = req.nextUrl.searchParams.get("ref") || "";
  if (!store || !BOOST_REF_RE.test(ref)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data } = await db().from("storefront_boosts").select("status, ends_at").eq("reference", ref).eq("store_id", store.id).maybeSingle();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (data.status === "pending") {
    const v = await paystack<PaystackTx>(`/transaction/verify/${encodeURIComponent(ref)}`);
    if (v.ok && v.data && (await markBoostPaid(v.data))) return NextResponse.json({ status: "paid" });
  }
  return NextResponse.json({ status: data.status, ends_at: data.ends_at });
}

/** Seller: start a boost payment. Body: { days: 7 | 30 } → Paystack checkout URL. */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "storefront-boost", 10, 60_000);
  if (limited) return limited;
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const store = await storeForOwner(user.id);
  if (!store) return NextResponse.json({ error: "Create your shop first." }, { status: 400 });
  if (!store.is_published) return NextResponse.json({ error: "Make your shop visible before promoting it." }, { status: 400 });

  const { count } = await db()
    .from("storefront_products")
    .select("id", { count: "exact", head: true })
    .eq("store_id", store.id)
    .eq("in_stock", true);
  if (!count) return NextResponse.json({ error: "Add at least one product in stock before promoting your shop." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const plan = BOOST_PLANS.find((p) => p.days === Number(body.days));
  if (!plan) return NextResponse.json({ error: "Choose 7 or 30 days." }, { status: 400 });

  const reference = newBoostRef();
  const { error } = await db()
    .from("storefront_boosts")
    .insert({ store_id: store.id, reference, days: plan.days, amount_kobo: plan.amountKobo });
  if (error) return NextResponse.json({ error: "Could not start the payment." }, { status: 500 });

  const init = await paystack<{ authorization_url: string }>("/transaction/initialize", {
    method: "POST",
    body: {
      email: user.email,
      amount: plan.amountKobo,
      currency: "NGN",
      reference,
      callback_url: `${SITE_URL}/stores/dashboard?boost=${reference}`,
      metadata: { kind: "store_boost", store_id: store.id, product_name: `Sponsored shop listing, ${plan.label}` },
    },
  });
  if (!init.ok || !init.data?.authorization_url) {
    await db().from("storefront_boosts").update({ status: "failed" }).eq("reference", reference);
    return NextResponse.json({ error: init.message || "Could not start payment." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, authorization_url: init.data.authorization_url });
}
