import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    if (SECRET) {
      const hash = crypto.createHmac("sha512", SECRET).update(raw).digest("hex");
      if (hash !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const body = JSON.parse(raw);
    const event = body.event as string;
    const data = body.data || {};

    if (event === "charge.success") {
      console.log(
        JSON.stringify({
          event: "paystack_sale",
          reference: data.reference,
          amount: data.amount,
          currency: data.currency,
          email: data.customer?.email,
          product_id: data.metadata?.product_id,
          product_name: data.metadata?.product_name,
          customer_name: data.metadata?.customer_name,
          paid_at: data.paid_at,
          at: new Date().toISOString(),
        })
      );
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
