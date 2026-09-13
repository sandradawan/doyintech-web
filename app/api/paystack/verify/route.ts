import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

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

    console.log(
      JSON.stringify({
        event: "paystack_verify",
        reference,
        status: tx.status,
        amount: tx.amount,
        email: tx.customer?.email,
        product: tx.metadata?.product_id || tx.metadata?.product_name,
        at: new Date().toISOString(),
      })
    );

    return NextResponse.json({
      ok: paid,
      status: tx.status,
      amount: tx.amount,
      currency: tx.currency,
      email: tx.customer?.email,
      paid_at: tx.paid_at,
      metadata: tx.metadata || {},
      reference: tx.reference,
    });
  } catch {
    return NextResponse.json({ error: "Verification error." }, { status: 500 });
  }
}
