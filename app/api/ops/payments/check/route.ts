import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Check if a DoyinOps invoice was paid (Paystack webhook → ops_payment_events),
 * or verify a Paystack reference directly.
 */
export async function GET(req: NextRequest) {
  try {
    const invoice = req.nextUrl.searchParams.get("invoice")?.trim();
    const reference = req.nextUrl.searchParams.get("reference")?.trim();

    if (!invoice && !reference) {
      return NextResponse.json({ error: "invoice or reference required" }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    if (admin) {
      let q = admin.from("ops_payment_events").select("*").order("created_at", { ascending: false }).limit(1);
      if (reference) q = q.eq("reference", reference);
      else if (invoice) q = q.eq("invoice_number", invoice);

      const { data, error } = await q.maybeSingle();
      if (!error && data) {
        return NextResponse.json({
          ok: true,
          paid: true,
          source: "webhook",
          invoice_number: data.invoice_number,
          reference: data.reference,
          paid_at: data.paid_at,
        });
      }
    }

    // Fallback: verify with Paystack if we have a reference
    if (reference && process.env.PAYSTACK_SECRET_KEY) {
      const res = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
          cache: "no-store",
        }
      );
      const json = await res.json();
      const tx = json.data;
      const paid = res.ok && json.status && tx?.status === "success";
      const invFromMeta = tx?.metadata?.invoice_number;
      if (paid && invoice && invFromMeta && invFromMeta !== invoice) {
        return NextResponse.json({ ok: true, paid: false, reason: "invoice mismatch" });
      }
      return NextResponse.json({
        ok: true,
        paid: Boolean(paid),
        source: "paystack",
        invoice_number: invFromMeta || invoice || null,
        reference: tx?.reference || reference,
        paid_at: tx?.paid_at || null,
      });
    }

    return NextResponse.json({
      ok: true,
      paid: false,
      reason: admin ? "not_found" : "no_admin_db",
    });
  } catch {
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
