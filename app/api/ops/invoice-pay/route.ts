import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

/**
 * Initialize a one-off Paystack charge for a DoyinOps invoice.
 * Body: { email, amountNgn, invoiceNumber, description?, customerName? }
 */
export async function POST(req: NextRequest) {
  try {
    if (!SECRET) {
      return NextResponse.json(
        {
          error: "Paystack is not configured. Add PAYSTACK_SECRET_KEY in Vercel.",
          code: "NO_KEYS",
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const amountNgn = Number(body.amountNgn || 0);
    const invoiceNumber = String(body.invoiceNumber || "").trim();
    const description = String(body.description || "Invoice payment").trim();
    const customerName = String(body.customerName || "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Client email is required for Paystack." }, { status: 400 });
    }
    if (!amountNgn || amountNgn < 100) {
      return NextResponse.json({ error: "Amount must be at least ₦100." }, { status: 400 });
    }
    if (!invoiceNumber) {
      return NextResponse.json({ error: "Invoice number is required." }, { status: 400 });
    }

    const amountKobo = Math.round(amountNgn * 100);
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://doyintech.vercel.app";

    const payload = {
      email,
      amount: amountKobo,
      currency: "NGN",
      callback_url: `${origin}/ops/pay/success?invoice=${encodeURIComponent(invoiceNumber)}`,
      metadata: {
        source: "doyinops",
        invoice_number: invoiceNumber,
        description,
        customer_name: customerName || undefined,
        amount_ngn: amountNgn,
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
        { error: data.message || "Could not create payment link." },
        { status: 400 }
      );
    }

    console.log(
      JSON.stringify({
        event: "doyinops_invoice_pay_init",
        invoice: invoiceNumber,
        email,
        amountNgn,
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
