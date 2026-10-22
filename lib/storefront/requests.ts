/**
 * Payment links ("Pay now" for an invoice): a seller with approved online payments creates a
 * request; the customer pays at /pay/<reference>; money settles to the seller's subaccount.
 * Customers with an email get the link, then reminders the day before, on, and 3 days after the due date.
 */
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { PaystackTx } from "@/lib/payments/purchase";
import { ctaButton, emailLayout } from "@/lib/email/templates";
import { formatKobo } from "@/lib/storefront/shared";
import { absoluteUrl } from "@/lib/site";

export const REQUEST_REF_RE = /^PR_[a-z0-9]{6,12}_[a-f0-9]{8}$/;
const MAX_REMINDERS = 3;

export function newRequestRef() {
  return `PR_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}

export function payUrl(reference: string) {
  return absoluteUrl(`/pay/${reference}`);
}

type RequestRow = {
  id: string;
  store_id: string;
  reference: string;
  title: string;
  description: string | null;
  amount_kobo: number;
  customer_name: string | null;
  customer_email: string | null;
  due_date: string | null;
  status: string;
  reminders_sent: number;
};

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function dueText(due: string | null) {
  if (!due) return "";
  return new Date(`${due}T12:00:00Z`).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

/** Emails the customer the payment link (first send or a reminder). Returns true when sent. */
export async function emailPaymentRequest(r: RequestRow, storeName: string, kind: "new" | "reminder"): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !r.customer_email) return false;
  const from = process.env.DELIVERY_FROM_EMAIL || process.env.RESEND_FROM || "DoyinTech <onboarding@resend.dev>";
  const amount = formatKobo(r.amount_kobo);
  const due = dueText(r.due_date);
  const link = payUrl(r.reference);
  const subject =
    kind === "new" ? `${storeName}: ${r.title} — ${amount}` : `Reminder: ${r.title} from ${storeName} — ${amount}`;
  const intro =
    kind === "new"
      ? `${storeName} has sent you a payment request for ${amount}.`
      : `This is a friendly reminder that ${r.title} from ${storeName} (${amount}) is still unpaid.`;
  const lines = [
    r.customer_name ? `Hi ${r.customer_name.split(" ")[0]},` : "Hi,",
    intro,
    r.description || "",
    due ? `Due: ${due}.` : "",
    "You can pay securely by card, bank transfer or USSD through Paystack.",
  ].filter(Boolean);
  const bodyHtml = [
    ...lines.map((l) => `<p style="margin:0 0 14px;">${escapeHtml(l)}</p>`),
    ctaButton(link, `Pay ${amount}`),
    `<p style="margin:18px 0 0;font-size:12px;color:#86868b;">This payment goes to ${escapeHtml(
      storeName
    )}. DoyinTech provides the payment page only. Questions about the invoice? Reply to ${escapeHtml(storeName)} directly.</p>`,
  ].join("");
  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to: r.customer_email,
      subject,
      html: emailLayout({ title: subject, preheader: intro, bodyHtml }),
      text: [...lines, "", `Pay ${amount}: ${link}`].join("\n"),
    });
    if (error) {
      console.error("payment request email", error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error("payment request email", e);
    return false;
  }
}

/** Webhook / return page: marks the request paid when the transaction covers it. */
export async function markPaymentRequestPaid(tx: PaystackTx): Promise<boolean> {
  const sb = getSupabaseAdmin();
  const ref = String(tx.metadata?.request_ref || "");
  if (!sb || !REQUEST_REF_RE.test(ref) || tx.status !== "success" || (tx.currency || "NGN").toUpperCase() !== "NGN") {
    return false;
  }
  const { data: r } = await sb
    .from("storefront_payment_requests")
    .select("id, store_id, title, amount_kobo, customer_name, status")
    .eq("reference", ref)
    .maybeSingle();
  if (!r || r.status !== "open" || tx.amount < r.amount_kobo) return false;

  const { data: updated } = await sb
    .from("storefront_payment_requests")
    .update({ status: "paid", paid_at: tx.paid_at || new Date().toISOString(), paystack_reference: tx.reference })
    .eq("id", r.id)
    .eq("status", "open")
    .select("id");
  if (!updated?.length) return false;

  const key = process.env.RESEND_API_KEY;
  const { data: store } = await sb.from("storefronts").select("name, owner_email").eq("id", r.store_id).maybeSingle();
  if (key && store?.owner_email) {
    const from = process.env.DELIVERY_FROM_EMAIL || process.env.RESEND_FROM || "DoyinTech <onboarding@resend.dev>";
    try {
      await new Resend(key).emails.send({
        from,
        to: store.owner_email,
        subject: `Paid: ${r.title} — ${formatKobo(r.amount_kobo)}`,
        text: `${r.customer_name || "Your customer"} paid ${r.title} (${formatKobo(
          r.amount_kobo
        )}).\nPaystack reference: ${tx.reference}\n\nThe money settles to your bank account through Paystack.\nYour payment links: ${absoluteUrl(
          "/stores/dashboard"
        )}`,
      });
    } catch (e) {
      console.error("payment request seller email", e);
    }
  }
  return true;
}

/** Daily: reminder the day before, on, and 3 days after the due date (max 3, never twice a day). */
export async function sendPaymentReminders(): Promise<number> {
  const sb = getSupabaseAdmin();
  if (!sb) return 0;
  const day = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
  const targets = new Set([day(1), day(0), day(-3)]);
  const { data } = await sb
    .from("storefront_payment_requests")
    .select("id, store_id, reference, title, description, amount_kobo, customer_name, customer_email, due_date, status, reminders_sent, last_reminded_at")
    .eq("status", "open")
    .not("customer_email", "is", null)
    .gte("due_date", day(-3))
    .lte("due_date", day(1))
    .lt("reminders_sent", MAX_REMINDERS)
    .limit(200);

  let sent = 0;
  const names = new Map<string, string>();
  for (const r of data || []) {
    if (!r.due_date || !targets.has(r.due_date)) continue;
    if (r.last_reminded_at && Date.now() - new Date(r.last_reminded_at).getTime() < 20 * 3_600_000) continue;
    if (!names.has(r.store_id)) {
      const { data: s } = await sb.from("storefronts").select("name").eq("id", r.store_id).maybeSingle();
      names.set(r.store_id, s?.name || "Your supplier");
    }
    if (!(await emailPaymentRequest(r, names.get(r.store_id)!, "reminder"))) continue;
    sent++;
    await sb
      .from("storefront_payment_requests")
      .update({ reminders_sent: r.reminders_sent + 1, last_reminded_at: new Date().toISOString() })
      .eq("id", r.id);
  }
  return sent;
}
