import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { canTakePayments, db, findDiscount, isPaidStore, paystack, publicStore } from "@/lib/storefront/server";
import { discountKobo, platformFeeKobo, type OrderItem } from "@/lib/storefront/shared";
import { limitRequest } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Customer checkout on a seller's shop. Prices, delivery fees and discounts all come from the
 * database, never the browser. The payment settles to the seller's Paystack subaccount (seller
 * bears Paystack fees); on the free plan DoyinTech's platform fee is split off per transaction.
 */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "storefront-checkout", 10, 60_000);
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug || "");
  const data = await publicStore(slug);
  if (!data) return NextResponse.json({ error: "Shop not found." }, { status: 404 });
  const { store, products } = data;
  if (!canTakePayments(store)) {
    return NextResponse.json({ error: "This shop takes orders on WhatsApp.", code: "WHATSAPP_ONLY" }, { status: 400 });
  }

  const name = String(body.customer?.name || "").trim().slice(0, 80);
  const phone = String(body.customer?.phone || "").replace(/[^\d+]/g, "").slice(0, 20);
  const email = String(body.customer?.email || "").trim().toLowerCase();
  const address = String(body.customer?.address || "").trim().slice(0, 300) || null;
  if (name.length < 2 || phone.length < 7 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter your name, phone number and email." }, { status: 400 });
  }

  const byId = new Map(products.map((p) => [p.id, p]));
  const items: OrderItem[] = [];
  for (const raw of Array.isArray(body.items) ? body.items.slice(0, 50) : []) {
    const p = byId.get(String(raw?.product_id || ""));
    const qty = Math.floor(Number(raw?.qty) || 0);
    if (!p || !p.in_stock || qty < 1 || qty > 99) continue;
    items.push({ product_id: p.id, name: p.name, qty, price_kobo: p.price_kobo });
  }
  const subtotal = items.reduce((n, i) => n + i.qty * i.price_kobo, 0);
  if (!items.length || subtotal < 10_000) {
    return NextResponse.json({ error: "Your cart is empty or below ₦100." }, { status: 400 });
  }

  // Delivery: when the shop lists areas, the customer must pick one.
  const zones = store.delivery_zones || [];
  const zone = zones.find((z) => z.name === String(body.delivery_zone || "")) || null;
  if (zones.length && !zone) {
    return NextResponse.json({ error: "Choose a delivery area." }, { status: 400 });
  }

  let discount = 0;
  let discountCode: string | null = null;
  if (body.discount_code) {
    const d = await findDiscount(store.id, String(body.discount_code));
    if (!d) return NextResponse.json({ error: "That discount code isn't valid.", code: "BAD_DISCOUNT" }, { status: 400 });
    discount = discountKobo(subtotal, d);
    if (!discount) {
      return NextResponse.json({ error: "Your order is below the minimum for that code.", code: "BAD_DISCOUNT" }, { status: 400 });
    }
    discountCode = d.code;
  }

  const deliveryFee = zone?.fee_kobo || 0;
  const amount = subtotal - discount + deliveryFee;
  if (amount < 10_000) return NextResponse.json({ error: "Order total must be at least ₦100." }, { status: 400 });
  const fee = platformFeeKobo(amount, await isPaidStore(store.owner_email));

  const reference = `SF_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
  const { error: orderErr } = await db().from("storefront_orders").insert({
    store_id: store.id,
    reference,
    customer_name: name,
    customer_phone: phone,
    customer_email: email,
    items,
    subtotal_kobo: subtotal,
    discount_code: discountCode,
    discount_kobo: discount,
    delivery_zone: zone?.name || null,
    delivery_fee_kobo: deliveryFee,
    delivery_address: address,
    platform_fee_kobo: fee,
    amount_kobo: amount,
  });
  if (orderErr) {
    console.error("storefront order insert", orderErr.message);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }

  const init = await paystack<{ authorization_url: string }>("/transaction/initialize", {
    method: "POST",
    body: {
      email,
      amount,
      currency: "NGN",
      reference,
      subaccount: store.paystack_subaccount_code,
      bearer: "subaccount",
      ...(fee > 0 ? { transaction_charge: fee } : {}),
      callback_url: `${SITE_URL}/s/${store.slug}?order=${encodeURIComponent(reference)}`,
      metadata: { kind: "storefront", store_id: store.id, customer_name: name },
    },
  });
  if (!init.ok || !init.data?.authorization_url) {
    await db().from("storefront_orders").update({ status: "cancelled" }).eq("reference", reference);
    return NextResponse.json({ error: init.message || "Could not start payment." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, authorization_url: init.data.authorization_url, reference });
}
