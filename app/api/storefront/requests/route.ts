import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { canTakePayments, db, paystack, storeForOwner, isPaidStore } from "@/lib/storefront/server";
import { platformFeeKobo } from "@/lib/storefront/shared";
import { REQUEST_REF_RE, emailPaymentRequest, markPaymentRequestPaid, newRequestRef, payUrl } from "@/lib/storefront/requests";
import { limitRequest } from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";
import type { PaystackTx } from "@/lib/payments/purchase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sellerStore(req: NextRequest) {
  const user = await userFromBearer(req);
  if (!user) return { error: NextResponse.json({ error: "Sign in required" }, { status: 401 }) };
  const store = await storeForOwner(user.id);
  if (!store) return { error: NextResponse.json({ error: "Create your shop first." }, { status: 400 }) };
  return { store };
}

/** Public: status of a payment link. ?ref=PR_… (verifies with Paystack while still open). */
export async function GET(req: NextRequest) {
  const limited = limitRequest(req, "storefront-request-status", 60, 60_000);
  if (limited) return limited;
  const ref = req.nextUrl.searchParams.get("ref") || "";
  const tx = req.nextUrl.searchParams.get("tx") || "";
  if (!REQUEST_REF_RE.test(ref)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data } = await db().from("storefront_payment_requests").select("status").eq("reference", ref).maybeSingle();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (data.status === "open" && /^PRP_[\w]+$/.test(tx)) {
    const v = await paystack<PaystackTx>(`/transaction/verify/${encodeURIComponent(tx)}`);
    if (v.ok && v.data && (await markPaymentRequestPaid(v.data))) return NextResponse.json({ status: "paid" });
  }
  return NextResponse.json({ status: data.status });
}

/**
 * Seller: create a payment link. Body: { title, amount_ngn, description?, customer_name?,
 * customer_email?, due_date? (YYYY-MM-DD), send? }. Needs approved online payments.
 * Customer: pay a link. Body: { pay: "PR_…", email } → Paystack checkout URL.
 */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "storefront-requests", 20, 60_000);
  if (limited) return limited;
  const body = await req.json().catch(() => ({}));

  if (body.pay) return startPayment(String(body.pay), String(body.email || ""));

  const s = await sellerStore(req);
  if (s.error) return s.error;
  const store = s.store;
  const { data: full } = await db()
    .from("storefronts")
    .select("payments_status, paystack_subaccount_code")
    .eq("id", store.id)
    .single();
  if (!full || !canTakePayments(full)) {
    return NextResponse.json({ error: "Connect your bank and wait for approval before sending payment links." }, { status: 400 });
  }

  const title = String(body.title || "").trim().slice(0, 100);
  const amount = Math.round((Number(body.amount_ngn) || 0) * 100);
  const email = String(body.customer_email || "").trim().toLowerCase();
  const due = String(body.due_date || "");
  if (title.length < 2) return NextResponse.json({ error: "Give the payment a title, e.g. Invoice INV-0042." }, { status: 400 });
  if (amount < 10_000 || amount > 1_000_000_000) return NextResponse.json({ error: "Amount must be between ₦100 and ₦10,000,000." }, { status: 400 });
  if (email && !EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter a valid customer email." }, { status: 400 });
  if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) return NextResponse.json({ error: "Invalid due date." }, { status: 400 });

  const row = {
    store_id: store.id,
    reference: newRequestRef(),
    title,
    description: String(body.description || "").trim().slice(0, 500) || null,
    amount_kobo: amount,
    customer_name: String(body.customer_name || "").trim().slice(0, 80) || null,
    customer_email: email || null,
    due_date: due || null,
  };
  const { data: created, error } = await db().from("storefront_payment_requests").insert(row).select("*").single();
  if (error || !created) return NextResponse.json({ error: "Could not create the link." }, { status: 500 });

  let emailed = false;
  if (body.send !== false && email) emailed = await emailPaymentRequest(created, store.name, "new");
  return NextResponse.json({ ok: true, reference: created.reference, url: payUrl(created.reference), emailed });
}

/** Seller: cancel an open link. ?ref=PR_… */
export async function DELETE(req: NextRequest) {
  const s = await sellerStore(req);
  if (s.error) return s.error;
  const ref = req.nextUrl.searchParams.get("ref") || "";
  await db()
    .from("storefront_payment_requests")
    .update({ status: "cancelled" })
    .eq("store_id", s.store.id)
    .eq("reference", ref)
    .eq("status", "open");
  return NextResponse.json({ ok: true });
}

async function startPayment(ref: string, rawEmail: string) {
  if (!REQUEST_REF_RE.test(ref)) return NextResponse.json({ error: "Payment link not found." }, { status: 404 });
  const { data: r } = await db()
    .from("storefront_payment_requests")
    .select("reference, store_id, amount_kobo, customer_email, status, title")
    .eq("reference", ref)
    .maybeSingle();
  if (!r) return NextResponse.json({ error: "Payment link not found." }, { status: 404 });
  if (r.status !== "open") return NextResponse.json({ error: `This payment is ${r.status}.` }, { status: 400 });
  const email = (r.customer_email || rawEmail).trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter your email for the receipt." }, { status: 400 });

  const { data: store } = await db()
    .from("storefronts")
    .select("id, owner_email, payments_status, paystack_subaccount_code")
    .eq("id", r.store_id)
    .single();
  if (!store || !canTakePayments(store)) {
    return NextResponse.json({ error: "This seller can't take online payments right now." }, { status: 400 });
  }
  const fee = platformFeeKobo(r.amount_kobo, await isPaidStore(store.owner_email));
  const txRef = `PRP_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  const init = await paystack<{ authorization_url: string }>("/transaction/initialize", {
    method: "POST",
    body: {
      email,
      amount: r.amount_kobo,
      currency: "NGN",
      reference: txRef,
      subaccount: store.paystack_subaccount_code,
      bearer: "subaccount",
      ...(fee > 0 ? { transaction_charge: fee } : {}),
      callback_url: `${SITE_URL}/pay/${r.reference}?tx=${txRef}`,
      metadata: { kind: "storefront_request", request_ref: r.reference, store_id: store.id, product_name: r.title },
    },
  });
  if (!init.ok || !init.data?.authorization_url) {
    return NextResponse.json({ error: init.message || "Could not start payment." }, { status: 502 });
  }
  if (fee) await db().from("storefront_payment_requests").update({ platform_fee_kobo: fee }).eq("reference", r.reference);
  return NextResponse.json({ ok: true, authorization_url: init.data.authorization_url });
}
