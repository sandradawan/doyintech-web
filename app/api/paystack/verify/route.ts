import { NextRequest, NextResponse } from "next/server";
import { fulfillPaidProduct } from "@/lib/delivery/fulfill";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const recent = new Map<string, number>();

export async function GET(req: NextRequest) {
  try {
    if (!SECRET) {
      return NextResponse.json({ error: "Paystack not configured." }, { status: 503 });
    }

    const reference = req.nextUrl.searchParams.get("reference");
    if (!reference) {
      return NextResponse.json({ error: "Missing reference." }, { status: 400 });
    }

    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${SECRET}` },
        cache: "no-store",
      }
    );

    const data = await res.json();
    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || "Verification failed." },
        { status: 400 }
      );
    }

    const tx = data.data;
    const paid = tx.status === "success";
    const email = String(tx.customer?.email || "").trim().toLowerCase();
    const meta = tx.metadata || {};
    const productId = String(meta.product_id || "").trim();

    console.log(
      JSON.stringify({
        event: "paystack_verify",
        reference,
        status: tx.status,
        amount: tx.amount,
        email,
        product: productId || meta.product_name,
        at: new Date().toISOString(),
      })
    );

    let delivery: Awaited<ReturnType<typeof fulfillPaidProduct>> | null = null;

    if (
      paid &&
      email &&
      productId &&
      meta.kind !== "service_deposit" &&
      meta.source !== "doyinops"
    ) {
      const last = recent.get(reference) || 0;
      if (Date.now() - last > 30_000) {
        recent.set(reference, Date.now());
        try {
          const origin =
            req.headers.get("origin") ||
            process.env.NEXT_PUBLIC_SITE_URL ||
            "https://doyintech.vercel.app";
          delivery = await fulfillPaidProduct({
            productId,
            email,
            reference,
            amountKobo: typeof tx.amount === "number" ? tx.amount : undefined,
            origin,
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
      amount: tx.amount,
      currency: tx.currency,
      email,
      paid_at: tx.paid_at,
      metadata: meta,
      reference: tx.reference,
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
