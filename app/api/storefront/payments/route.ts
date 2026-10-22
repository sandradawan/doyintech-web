import { NextRequest, NextResponse } from "next/server";
import { userFromBearer } from "@/lib/auth/request-user";
import { db, paystack, storeForOwner } from "@/lib/storefront/server";
import { limitRequest } from "@/lib/rate-limit";

type Bank = { name: string; code: string; active?: boolean };
let bankCache: { at: number; banks: { name: string; code: string }[] } | null = null;

/** Nigerian banks for the payout form (cached for a day). */
export async function GET() {
  if (!bankCache || Date.now() - bankCache.at > 86_400_000) {
    const res = await paystack<Bank[]>("/bank?country=nigeria&perPage=200");
    if (!res.ok || !res.data) return NextResponse.json({ error: "Could not load banks." }, { status: 502 });
    bankCache = {
      at: Date.now(),
      banks: res.data.filter((b) => b.active !== false).map((b) => ({ name: b.name, code: b.code })),
    };
  }
  return NextResponse.json({ banks: bankCache.banks });
}

/**
 * Connects the seller's bank: verifies the account with Paystack, creates a subaccount so
 * customer payments settle directly to the seller, and queues the store for review.
 * Checkout stays off until an admin sets payments_status = 'active'. Any plan may connect:
 * free shops pay DoyinTech's per-order fee at checkout, Store plan shops pay none.
 */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "storefront-payments", 5, 60 * 60 * 1000);
  if (limited) return limited;
  const user = await userFromBearer(req);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const store = await storeForOwner(user.id);
  if (!store) return NextResponse.json({ error: "Create your shop first." }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const bankCode = String(body.bank_code || "").replace(/[^\w]/g, "");
  const accountNumber = String(body.account_number || "").replace(/\D/g, "");
  if (!bankCode || accountNumber.length !== 10) {
    return NextResponse.json({ error: "Choose your bank and enter a 10-digit account number." }, { status: 400 });
  }

  const resolved = await paystack<{ account_name: string }>(
    `/bank/resolve?account_number=${accountNumber}&bank_code=${encodeURIComponent(bankCode)}`
  );
  if (!resolved.ok || !resolved.data?.account_name) {
    return NextResponse.json({ error: "We couldn't verify that account. Check the number and bank." }, { status: 400 });
  }

  const sub = await paystack<{ subaccount_code: string; settlement_bank: string }>("/subaccount", {
    method: "POST",
    body: {
      business_name: store.name,
      settlement_bank: bankCode,
      account_number: accountNumber,
      percentage_charge: 0,
      primary_contact_email: user.email,
      metadata: { storefront_id: store.id },
    },
  });
  if (!sub.ok || !sub.data?.subaccount_code) {
    console.error("paystack subaccount", sub.message);
    return NextResponse.json({ error: "Could not connect the account. Try again shortly." }, { status: 502 });
  }

  await db()
    .from("storefronts")
    .update({
      paystack_subaccount_code: sub.data.subaccount_code,
      payments_status: "pending_review",
      bank_name: sub.data.settlement_bank || null,
      account_name: resolved.data.account_name,
      account_last4: accountNumber.slice(-4),
      updated_at: new Date().toISOString(),
    })
    .eq("id", store.id);

  return NextResponse.json({
    ok: true,
    account_name: resolved.data.account_name,
    message: "Account connected. We'll review your shop and switch on checkout within one business day.",
  });
}
