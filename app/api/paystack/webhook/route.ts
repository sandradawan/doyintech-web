import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { fulfillPaidProduct } from "@/lib/delivery/fulfill";
import { creditWallet } from "@/lib/bills/wallet";
import {
  emailStudentDepositPaid,
  emailStudentBalancePaid,
  emailOpsBalancePaid,
} from "@/lib/students/notify";

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
      const amountKobo = typeof data.amount === "number" ? data.amount : 0;
      const amountNgn = Math.round(amountKobo / 100);

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
          payment_phase: meta.payment_phase,
          at: new Date().toISOString(),
        })
      );

      const admin = getSupabaseAdmin();

      if (
        (meta.source === "wallet_fund" || meta.kind === "wallet_fund") &&
        meta.user_id &&
        amountKobo > 0
      ) {
        try {
          await creditWallet({
            userId: String(meta.user_id),
            amountKobo,
            reference,
            reason: "wallet_fund",
            meta: { email, paystack: amountKobo },
          });
        } catch (e) {
          console.error("wallet_fund webhook", e);
        }
      }

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

      // Student research projects — deposit (50%) or balance (50%)
      if (admin && meta.kind === "student_project" && meta.request_id) {
        try {
          const requestId = String(meta.request_id).toUpperCase();
          const phase = String(meta.payment_phase || "deposit").toLowerCase();

          const { data: existing } = await admin
            .from("student_projects")
            .select(
              "id, request_id, name, email, package_name, topic, amount_paid_ngn, deposit_ngn, balance_ngn, amount_ngn, status, stage, delivery_url"
            )
            .eq("request_id", requestId)
            .maybeSingle();

          if (existing?.id) {
            const prevPaid = Number(existing.amount_paid_ngn || 0);
            const newPaid = prevPaid + amountNgn;
            const notifyBase = {
              request_id: requestId,
              name: existing.name || meta.customer_name || "Student",
              email: existing.email || email,
              package_name: existing.package_name || meta.product_name || "Project",
              topic: existing.topic || undefined,
              amount_ngn: existing.amount_ngn,
              deposit_ngn: existing.deposit_ngn,
              balance_ngn: existing.balance_ngn,
              delivery_url: existing.delivery_url,
            };

            if (phase === "balance") {
              await admin
                .from("student_projects")
                .update({
                  status: "fully_paid",
                  stage: "completed",
                  amount_paid_ngn: newPaid,
                  paystack_ref_balance: reference || null,
                  delivery_unlocked: true,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id);

              await admin.from("student_project_events").insert({
                project_id: existing.id,
                request_id: requestId,
                stage: "completed",
                note: `Final 50% paid (₦${amountNgn.toLocaleString()}) — download unlocked`,
              });

              // Emails: student + ops
              if (notifyBase.email) {
                await emailStudentBalancePaid(notifyBase);
                await emailOpsBalancePaid(notifyBase, amountNgn);
              }
            } else {
              // deposit
              await admin
                .from("student_projects")
                .update({
                  status: "deposit_paid",
                  stage: "topic_review",
                  amount_paid_ngn: newPaid,
                  paystack_ref: reference || null,
                  paystack_ref_deposit: reference || null,
                  delivery_unlocked: false,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", existing.id);

              await admin.from("student_project_events").insert({
                project_id: existing.id,
                request_id: requestId,
                stage: "topic_review",
                note: `50% deposit paid (₦${amountNgn.toLocaleString()}) — work can start`,
              });

              if (notifyBase.email) {
                await emailStudentDepositPaid(notifyBase);
              }
            }
          }
        } catch (e) {
          console.error("student_project webhook", e);
        }
      }

      if (
        email &&
        productId &&
        meta.kind !== "service_deposit" &&
        meta.kind !== "student_project" &&
        meta.source !== "doyinops" &&
        meta.source !== "wallet_fund"
      ) {
        try {
          await fulfillPaidProduct({
            productId,
            email,
            reference,
            amountKobo: amountKobo || undefined,
            customerName: meta.customer_name ? String(meta.customer_name) : undefined,
          });
        } catch (e) {
          console.error("fulfill webhook", e);
        }
      }

      if (
        admin &&
        (meta.kind === "service_deposit" || productId) &&
        meta.kind !== "student_project" &&
        meta.source !== "wallet_fund"
      ) {
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
