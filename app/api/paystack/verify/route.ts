import { NextRequest, NextResponse } from "next/server";
import { fulfillPaidProduct } from "@/lib/delivery/fulfill";
import {
  checkTransactionPaysForItsProduct,
  describeProduct,
  fetchPaystackTransaction,
  txProductId,
} from "@/lib/payments/purchase";
import { limitRequest } from "@/lib/rate-limit";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const recent = new Map<string, number>();

/**
 * Confirms a checkout. `ok` is true only when the payment fully covers the product named
 * in its metadata; `product` tells the client what was bought so gates can match it.
 */
export async function GET(req: NextRequest) {
  try {
    if (!SECRET) {
      return NextResponse.json({ error: "Paystack not configured." }, { status: 503 });
    }

    const limited = limitRequest(req, "paystack-verify", 30, 60_000);
    if (limited) return limited;

    const reference = (req.nextUrl.searchParams.get("reference") || "").trim();
    if (!reference) {
      return NextResponse.json({ error: "Missing reference." }, { status: 400 });
    }

    const tx = await fetchPaystackTransaction(reference);
    if (!tx) {
      return NextResponse.json({ error: "Verification failed." }, { status: 400 });
    }

    const meta = (tx.metadata || {}) as Record<string, unknown>;
    const isServiceDeposit = meta.kind === "service_deposit";
    const check = await checkTransactionPaysForItsProduct(tx);
    const paid = check.ok;
    const productId = check.ok ? check.productId : txProductId(tx);
    const email = check.ok ? check.email : "";

    console.log(
      JSON.stringify({
        event: "paystack_verify",
        reference,
        status: tx.status,
        amount: tx.amount,
        product: productId,
        fully_paid: paid,
        at: new Date().toISOString(),
      })
    );

    let delivery: Awaited<ReturnType<typeof fulfillPaidProduct>> | null = null;

    // The webhook is the primary fulfilment path; this covers buyers who land here first.
    if (paid && email && !isServiceDeposit && meta.source !== "doyinops") {
      const last = recent.get(reference) || 0;
      if (Date.now() - last > 30_000) {
        if (recent.size > 1000) recent.clear();
        recent.set(reference, Date.now());
        try {
          delivery = await fulfillPaidProduct({
            productId,
            email,
            reference,
            amountKobo: tx.amount,
            customerName: meta.customer_name ? String(meta.customer_name) : undefined,
          });
        } catch (e) {
          console.error("fulfill verify", e);
        }
      }
    }

    return NextResponse.json({
      ok: paid,
      status: tx.status,
      error: check.ok ? undefined : check.error,
      amount: tx.amount,
      currency: tx.currency,
      email,
      paid_at: tx.paid_at,
      reference: tx.reference,
      product: productId ? describeProduct(productId) : null,
      metadata: { product_id: productId || undefined, kind: meta.kind },
      delivery: delivery
        ? {
            productName: delivery.productName,
            emailed: delivery.emailed,
            downloadLinks: delivery.downloadLinks,
            error: delivery.error,
          }
        : null,
    });
  } catch {
    return NextResponse.json({ error: "Verification error." }, { status: 500 });
  }
}
