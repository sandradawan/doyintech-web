import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    // Fail closed: never process webhooks without a configured secret + valid signature
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
      console.log(
        JSON.stringify({
          event: "paystack_sale",
          reference: data.reference,
          amount: data.amount,
          currency: data.currency,
          email: data.customer?.email,
          product_id: meta.product_id,
          product_name: meta.product_name,
          source: meta.source,
          invoice_number: meta.invoice_number,
          customer_name: meta.customer_name,
          paid_at: data.paid_at,
          at: new Date().toISOString(),
        })
      );

      const admin = getSupabaseAdmin();

      // DoyinOps invoice payments → record for auto-mark paid
      if (meta.source === "doyinops" && meta.invoice_number && admin) {
        const { error } = await admin.from("ops_payment_events").upsert(
          {
            invoice_number: String(meta.invoice_number),
            reference: data.reference || null,
            amount_kobo: data.amount ?? null,
            email: data.customer?.email || null,
            paid_at: data.paid_at || new Date().toISOString(),
            metadata: meta,
          },
          { onConflict: "reference" }
        );
        if (error) {
          console.error("ops_payment_events insert", error.message);
        }
      }

      // Service deposits + digital purchases → site_leads for inbox
      if (admin && (meta.kind === "service_deposit" || meta.product_id)) {
        const { error } = await admin.from("site_leads").insert({
          type: "purchase",
          product: meta.product_name || meta.product_id || "Purchase",
          name: meta.customer_name || data.customer?.email || "Paystack customer",
          email: data.customer?.email || null,
          phone: null,
          message: `Paystack success. Ref: ${data.reference}. Amount: ${data.amount} ${data.currency || "NGN"}. kind=${meta.kind || "digital"}`,
          source: meta.kind === "service_deposit" ? "hire-deposit" : "paystack",
          status: "new",
        });
        if (error) {
          console.error("site_leads from webhook", error.message);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
