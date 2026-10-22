import { NextRequest, NextResponse, after } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fulfillPaidProduct } from "@/lib/delivery/fulfill";
import {
  checkTransactionPaysForItsProduct,
  type PaystackTx,
} from "@/lib/payments/purchase";
import { confirmReportPayment, processReportOrder } from "@/lib/reports/fulfill";
import { planIdForCode, recordRenewal, syncSubscription } from "@/lib/subscriptions/server";
import { notifyNewSubscription } from "@/lib/subscriptions/notify";
import { markStorefrontOrderPaid } from "@/lib/storefront/orders";
import {
  emailStudentDepositPaid,
  emailStudentBalancePaid,
  emailOpsBalancePaid,
} from "@/lib/students/notify";

export const maxDuration = 60;

const SECRET = process.env.PAYSTACK_SECRET_KEY || "";

function signatureValid(raw: string, signature: string): boolean {
  const expected = crypto.createHmac("sha512", SECRET).update(raw).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    if (!SECRET) {
      console.error("PAYSTACK_SECRET_KEY not configured — rejecting webhook");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    if (!signatureValid(raw, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(raw);
    const event = body.event as string;
    const data = (body.data || {}) as PaystackTx & { paid_at?: string };

    // Subscription lifecycle (Paystack Subscriptions).
    if (event === "subscription.create" || event === "subscription.enable") {
      await syncSubscription(body.data, "active");
      if (event === "subscription.create") {
        const planCode = String(body.data?.plan?.plan_code || "");
        const email = String(body.data?.customer?.email || "").toLowerCase();
        const planId = planCode ? await planIdForCode(planCode) : null;
        after(async () => {
          await notifyNewSubscription({ email, planId });
        });
      }
      return NextResponse.json({ received: true });
    }
    if (event === "subscription.not_renew") {
      await syncSubscription(body.data, "non-renewing");
      return NextResponse.json({ received: true });
    }
    if (event === "subscription.disable") {
      await syncSubscription(body.data, body.data?.status === "complete" ? "completed" : "cancelled");
      return NextResponse.json({ received: true });
    }
    if (event === "invoice.payment_failed" || event === "invoice.update") {
      const inv = body.data || {};
      if (inv.subscription) {
        const failed = event === "invoice.payment_failed" || inv.paid === false;
        await syncSubscription(
          { ...inv.subscription, customer: inv.customer, plan: inv.plan || inv.subscription.plan },
          failed ? "attention" : "active"
        );
      }
      return NextResponse.json({ received: true });
    }

    if (event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const meta = (data.metadata || {}) as Record<string, unknown>;
    const email = String(data.customer?.email || "").trim().toLowerCase();
    const productId = String(meta.product_id || "").trim();
    const reference = String(data.reference || "");
    const amountKobo = typeof data.amount === "number" ? data.amount : 0;
    const amountNgn = Math.round(amountKobo / 100);
    const isNgn = (data.currency || "NGN").toUpperCase() === "NGN";
    const kind = String(meta.kind || "");
    const source = String(meta.source || "");

    console.log(
      JSON.stringify({
        event: "paystack_sale",
        reference,
        amount: data.amount,
        currency: data.currency,
        product_id: productId,
        source,
        kind,
        payment_phase: meta.payment_phase,
        at: new Date().toISOString(),
      })
    );

    const admin = getSupabaseAdmin();

    // Paystack retries webhooks; process each reference once.
    if (admin && reference) {
      const { error: claimErr } = await admin
        .from("payment_claims")
        .insert({ reference, kind: "webhook", product_id: productId || null, email: email || null, amount_kobo: amountKobo });
      if (claimErr?.code === "23505") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      if (claimErr) console.error("payment_claims insert", claimErr.message);
    }

    // Subscription charges (first payment and renewals) carry the plan; access is driven by
    // the subscription row, not the catalog product check below.
    const planCode = String((body.data?.plan as { plan_code?: string } | undefined)?.plan_code || "");
    if (planCode || kind === "subscription") {
      if (planCode && email) await recordRenewal({ email, planCode, reference });
      return NextResponse.json({ received: true });
    }

    if (source === "doyinops" && meta.invoice_number && admin) {
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
      return NextResponse.json({ received: true });
    }

    if (kind === "report_studio" && meta.order_id) {
      const orderId = String(meta.order_id);
      const confirmed = await confirmReportPayment(orderId, data);
      if (confirmed.ok) {
        after(async () => {
          await processReportOrder(orderId);
        });
      } else {
        console.error("report_studio webhook", orderId, confirmed.error);
      }
      return NextResponse.json({ received: true });
    }

    // Storefront customer payments (settled to the seller's subaccount).
    if (kind === "storefront") {
      await markStorefrontOrderPaid(data);
      return NextResponse.json({ received: true });
    }

    // Student research projects — deposit (50%) or balance (50%).
    if (admin && kind === "student_project" && meta.request_id) {
      try {
        await handleStudentPayment(admin, {
          requestId: String(meta.request_id).toUpperCase(),
          phase: String(meta.payment_phase || "deposit").toLowerCase(),
          reference,
          amountNgn,
          isNgn,
          email,
          meta,
        });
      } catch (e) {
        console.error("student_project webhook", e);
      }
      return NextResponse.json({ received: true });
    }

    // Catalog products and service deposits: only act on full payments for the named product.
    const check = await checkTransactionPaysForItsProduct(data);
    if (!check.ok) {
      console.error("webhook product check failed", reference, check.error);
      return NextResponse.json({ received: true });
    }

    if (email && kind !== "service_deposit") {
      try {
        await fulfillPaidProduct({
          productId: check.productId,
          email,
          reference,
          amountKobo,
          customerName: meta.customer_name ? String(meta.customer_name) : undefined,
        });
      } catch (e) {
        console.error("fulfill webhook", e);
      }
    }

    if (admin) {
      const { error } = await admin.from("site_leads").insert({
        type: "purchase",
        product: String(meta.product_name || check.productId),
        name: String(meta.customer_name || email || "Paystack customer"),
        email: email || null,
        phone: null,
        message: `Paystack success. Ref: ${reference}. Amount: ${data.amount} ${data.currency || "NGN"}. kind=${kind || "digital"}`,
        source: kind === "service_deposit" ? "hire-deposit" : "paystack",
        status: "new",
      });
      if (error) console.error("site_leads from webhook", error.message);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}

async function handleStudentPayment(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  p: {
    requestId: string;
    phase: string;
    reference: string;
    amountNgn: number;
    isNgn: boolean;
    email: string;
    meta: Record<string, unknown>;
  }
) {
  const { data: existing } = await admin
    .from("student_projects")
    .select(
      "id, request_id, name, email, package_name, topic, amount_paid_ngn, deposit_ngn, balance_ngn, amount_ngn, status, stage, delivery_url"
    )
    .eq("request_id", p.requestId)
    .maybeSingle();

  if (!existing?.id) return;

  // Metadata is payer-controllable, so the amount must cover the phase it claims.
  const due =
    p.phase === "balance" ? Number(existing.balance_ngn || 0) : Number(existing.deposit_ngn || 0);
  if (!p.isNgn || due <= 0 || p.amountNgn < due) {
    console.error("student payment below amount due", p.requestId, p.phase, p.amountNgn, due);
    return;
  }

  const newPaid = Number(existing.amount_paid_ngn || 0) + p.amountNgn;
  const notifyBase = {
    request_id: p.requestId,
    name: existing.name || String(p.meta.customer_name || "Student"),
    email: existing.email || p.email,
    package_name: existing.package_name || String(p.meta.product_name || "Project"),
    topic: existing.topic || undefined,
    amount_ngn: existing.amount_ngn,
    deposit_ngn: existing.deposit_ngn,
    balance_ngn: existing.balance_ngn,
    delivery_url: existing.delivery_url,
  };

  if (p.phase === "balance") {
    await admin
      .from("student_projects")
      .update({
        status: "fully_paid",
        stage: "completed",
        amount_paid_ngn: newPaid,
        paystack_ref_balance: p.reference || null,
        delivery_unlocked: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    await admin.from("student_project_events").insert({
      project_id: existing.id,
      request_id: p.requestId,
      stage: "completed",
      note: `Final 50% paid (₦${p.amountNgn.toLocaleString()}) — download unlocked`,
    });

    if (notifyBase.email) {
      await emailStudentBalancePaid(notifyBase);
      await emailOpsBalancePaid(notifyBase, p.amountNgn);
    }
    return;
  }

  await admin
    .from("student_projects")
    .update({
      status: "deposit_paid",
      stage: "topic_review",
      amount_paid_ngn: newPaid,
      paystack_ref: p.reference || null,
      paystack_ref_deposit: p.reference || null,
      delivery_unlocked: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id);

  await admin.from("student_project_events").insert({
    project_id: existing.id,
    request_id: p.requestId,
    stage: "topic_review",
    note: `50% deposit paid (₦${p.amountNgn.toLocaleString()}) — work can start`,
  });

  if (notifyBase.email) {
    await emailStudentDepositPaid(notifyBase);
  }
}
