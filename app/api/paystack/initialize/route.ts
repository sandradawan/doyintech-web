import { NextRequest, NextResponse } from "next/server";
import { getDigitalProduct } from "@/lib/products";

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

    const product = getDigitalProduct(productId);
    if (!product || product.type !== "one-time") {
      return NextResponse.json({ error: "Invalid product." }, { status: 400 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://doyintech.vercel.app";

    const payload = {
      email,
      amount: product.amountKobo,
      currency: "NGN",
      callback_url: `${origin}/products/success?product=${encodeURIComponent(product.id)}`,
      metadata: {
        product_id: product.id,
        product_name: product.name,
        customer_name: name || undefined,
        delivery: product.delivery,
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
        product: product.id,
        email,
        amount: product.amountKobo,
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
