import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fulfillPaidProduct } from "@/lib/delivery/fulfill";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    if (!SECRET) {
      console.error("PAYSTACK_SECRET_KEY not configured — rejecting webhook");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    const hash = crypto.createHmac("sha512", SECRET).update(raw).digest("hex");
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(raw);
    const event = body.event as string;
    const data = body.data || {};

    if (event === "charge.success") {
      const meta = data.metadata || {};
      const email = String(data.customer?.email || "").trim().toLowerCase();
      const productId = String(meta.product_id || "").trim();
      const reference = String(data.reference || "");

      console.log(
        JSON.stringify({
          event: "paystack_sale",
          reference,
          amount: data.amount,
          currency: data.currency,
          email,
          product_id: productId,
          product_name: meta.product_name,
          source: meta.source,
          kind: meta.kind,
          at: new Date().toISOString(),
        })
      );

      const admin = getSupabaseAdmin();

      if (meta.source === "doyinops" && meta.invoice_number && admin) {
        const { error } = await admin.from("ops_payment_events").upsert(
          {
            invoice_number: String(meta.invoice_number),
            reference: reference || null,
            amount_kobo: data.amount ?? null,
            email: email || null,
            paid_at: data.paid_at || new Date().toISOString(),
            metadata: meta,
          },
          { onConflict: "reference" }
        );
        if (error) console.error("ops_payment_events insert", error.message);
      }

      if (
        email &&
        productId &&
        meta.kind !== "service_deposit" &&
        meta.source !== "doyinops"
      ) {
        try {
          await fulfillPaidProduct({
            productId,
            email,
            reference,
            amountKobo: typeof data.amount === "number" ? data.amount : undefined,
            customerName: meta.customer_name ? String(meta.customer_name) : undefined,
          });
        } catch (e) {
          console.error("fulfill webhook", e);
        }
      }

      if (admin && (meta.kind === "service_deposit" || productId)) {
        const { error } = await admin.from("site_leads").insert({
          type: "purchase",
          product: meta.product_name || productId || "Purchase",
          name: meta.customer_name || email || "Paystack customer",
          email: email || null,
          phone: null,
          message: `Paystack success. Ref: ${reference}. Amount: ${data.amount} ${data.currency || "NGN"}. kind=${meta.kind || "digital"} · auto-delivery attempted`,
          source: meta.kind === "service_deposit" ? "hire-deposit" : "paystack",
          status: "new",
        });
        if (error) console.error("site_leads from webhook", error.message);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
