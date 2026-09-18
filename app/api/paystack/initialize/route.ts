import { NextRequest, NextResponse } from "next/server";
import { getPayItem } from "@/lib/paystack-catalog";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    if (!SECRET) {
      return NextResponse.json(
        {
          error: "Paystack is not configured yet.",
          code: "NO_KEYS",
          fallback: "whatsapp",
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const productId = String(body.productId || "").trim();
    const name = String(body.name || "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const item = getPayItem(productId);
    if (!item) {
      return NextResponse.json({ error: "Invalid product." }, { status: 400 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://doyintech.vercel.app";

    const isServiceDeposit = item.id.startsWith("service-");
    const callbackPath = isServiceDeposit
      ? `/hire/success?product=${encodeURIComponent(item.id)}`
      : `/products/success?product=${encodeURIComponent(item.id)}`;

    const payload = {
      email,
      amount: item.amountKobo,
      currency: "NGN",
      callback_url: `${origin}${callbackPath}`,
      metadata: {
        product_id: item.id,
        product_name: item.name,
        customer_name: name || undefined,
        delivery: item.delivery,
        kind: isServiceDeposit ? "service_deposit" : "digital",
      },
    };

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || "Could not start payment." },
        { status: 400 }
      );
    }

    console.log(
      JSON.stringify({
        event: "paystack_initialize",
        product: item.id,
        email,
        amount: item.amountKobo,
        reference: data.data?.reference,
        at: new Date().toISOString(),
      })
    );

    return NextResponse.json({
      ok: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch {
    return NextResponse.json({ error: "Payment init failed." }, { status: 500 });
  }
}
