/** Resend emails for student project payment lifecycle. */

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.doyintech.com";

function fromAddress() {
  return (
    process.env.CONTACT_FROM_EMAIL ||
    "DoyinTech <onboarding@resend.dev>"
  );
}

function opsTo() {
  return process.env.CONTACT_TO_EMAIL || "hello@doyintech.com";
}

async function sendResend(opts: {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(
      JSON.stringify({
        event: "student_email_skipped",
        reason: "RESEND_API_KEY missing",
        subject: opts.subject,
      })
    );
    return false;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: fromAddress().includes("<")
        ? fromAddress()
        : `DoyinTech <${fromAddress()}>`,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      text: opts.text,
      replyTo: opts.replyTo,
    });
    return true;
  } catch (e) {
    console.error("student_email_error", e);
    return false;
  }
}

export type StudentNotifyProject = {
  request_id: string;
  name: string;
  email: string;
  package_name: string;
  topic?: string;
  amount_ngn?: number;
  deposit_ngn?: number | null;
  balance_ngn?: number | null;
  delivery_url?: string | null;
};

function trackUrl(requestId: string) {
  return `${SITE}/students/projects/track?id=${encodeURIComponent(requestId)}`;
}

function balanceAmount(p: StudentNotifyProject): number {
  if (p.balance_ngn != null) return Number(p.balance_ngn);
  if (p.amount_ngn != null) return Math.round(Number(p.amount_ngn) / 2);
  return 0;
}

function depositAmount(p: StudentNotifyProject): number {
  if (p.deposit_ngn != null) return Number(p.deposit_ngn);
  if (p.amount_ngn != null) return Math.round(Number(p.amount_ngn) / 2);
  return 0;
}

/** Student: your project is ready — pay final 50% to unlock download. */
export async function emailStudentBalanceDue(p: StudentNotifyProject) {
  const bal = balanceAmount(p);
  const url = trackUrl(p.request_id);
  const subject = `Pay final 50% to unlock your project — ${p.request_id}`;
  const text = [
    `Hi ${p.name},`,
    ``,
    `Good news — your research project is ready.`,
    ``,
    `Request ID: ${p.request_id}`,
    `Package: ${p.package_name}`,
    p.topic ? `Topic: ${p.topic}` : null,
    `Balance due (50%): ₦${bal.toLocaleString()}`,
    ``,
    `Pay the balance on your tracker to unlock the download link:`,
    url,
    ``,
    `Steps:`,
    `1. Open the link above`,
    `2. Click “Pay balance”`,
    `3. Complete Paystack payment`,
    `4. Your download link appears when payment confirms`,
    ``,
    `— DoyinTech`,
    SITE,
  ]
    .filter(Boolean)
    .join("\n");

  return sendResend({ to: p.email, subject, text });
}

/** Ops: student was notified that balance is due. */
export async function emailOpsBalanceDue(p: StudentNotifyProject) {
  const bal = balanceAmount(p);
  const subject = `[Balance due] ${p.request_id} · ${p.name}`;
  const text = [
    `Student notified to pay final 50%.`,
    ``,
    `Request ID: ${p.request_id}`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Package: ${p.package_name}`,
    `Balance: ₦${bal.toLocaleString()}`,
    `Track: ${trackUrl(p.request_id)}`,
    `CRM: ${SITE}/admin/students`,
  ].join("\n");
  return sendResend({ to: opsTo(), subject, text, replyTo: p.email });
}

/** Student: final payment received — download unlocked. */
export async function emailStudentBalancePaid(p: StudentNotifyProject) {
  const url = trackUrl(p.request_id);
  const subject = `Payment received — download unlocked · ${p.request_id}`;
  const hasLink = Boolean(p.delivery_url);
  const text = [
    `Hi ${p.name},`,
    ``,
    `We’ve received your final 50% payment. Thank you!`,
    ``,
    `Request ID: ${p.request_id}`,
    `Package: ${p.package_name}`,
    ``,
    hasLink
      ? `Your download link is ready on the tracker (and below if available):`
      : `Your download is unlocked. Open the tracker — the file link will appear as soon as it’s attached:`,
    url,
    hasLink ? `` : null,
    hasLink ? `Direct link: ${p.delivery_url}` : null,
    ``,
    `If anything is missing, reply to this email or use the feedback box on the tracker.`,
    ``,
    `— DoyinTech`,
    SITE,
  ]
    .filter((x) => x !== null)
    .join("\n");

  return sendResend({ to: p.email, subject, text });
}

/** Ops: balance paid + unlocked. */
export async function emailOpsBalancePaid(
  p: StudentNotifyProject,
  amountNgn: number
) {
  const subject = `[Balance paid] ${p.request_id} · ₦${amountNgn.toLocaleString()}`;
  const text = [
    `Final 50% paid — delivery unlocked.`,
    ``,
    `Request ID: ${p.request_id}`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Package: ${p.package_name}`,
    `Amount: ₦${amountNgn.toLocaleString()}`,
    `Delivery URL set: ${p.delivery_url ? "yes" : "no — attach in CRM"}`,
    `Track: ${trackUrl(p.request_id)}`,
    `CRM: ${SITE}/admin/students`,
  ].join("\n");
  return sendResend({ to: opsTo(), subject, text, replyTo: p.email });
}

/** Student: deposit confirmed. */
export async function emailStudentDepositPaid(p: StudentNotifyProject) {
  const dep = depositAmount(p);
  const subject = `Deposit received — project started · ${p.request_id}`;
  const text = [
    `Hi ${p.name},`,
    ``,
    `We’ve received your 50% deposit (₦${dep.toLocaleString()}). Work on your project has started.`,
    ``,
    `Request ID: ${p.request_id}`,
    `Package: ${p.package_name}`,
    p.topic ? `Topic: ${p.topic}` : null,
    ``,
    `Track progress and send feedback anytime:`,
    trackUrl(p.request_id),
    ``,
    `When the work is ready, we’ll email you to pay the final 50% before download unlocks.`,
    ``,
    `— DoyinTech`,
    SITE,
  ]
    .filter(Boolean)
    .join("\n");
  return sendResend({ to: p.email, subject, text });
}

/**
 * Student: direct Paystack payment link (deposit or balance).
 * Sent when admin clicks “Send payment link” in CRM.
 */
export async function emailStudentPaymentLink(
  p: StudentNotifyProject,
  opts: {
    phase: "deposit" | "balance";
    amountNgn: number;
    paystackUrl: string;
  }
) {
  const isDeposit = opts.phase === "deposit";
  const subject = isDeposit
    ? `Pay 50% deposit to start — ${p.request_id}`
    : `Pay final 50% to unlock download — ${p.request_id}`;

  const text = [
    `Hi ${p.name},`,
    ``,
    isDeposit
      ? `Please complete your 50% deposit so we can start your research project.`
      : `Your project is ready. Please complete the final 50% payment to unlock your download.`,
    ``,
    `Request ID: ${p.request_id}`,
    `Package: ${p.package_name}`,
    p.topic ? `Topic: ${p.topic}` : null,
    `Amount: ₦${opts.amountNgn.toLocaleString()} (${isDeposit ? "deposit" : "final balance"})`,
    ``,
    `Pay securely with Paystack (card / transfer / USSD):`,
    opts.paystackUrl,
    ``,
    `Or open your project tracker:`,
    trackUrl(p.request_id),
    ``,
    `If you already paid, you can ignore this email.`,
    ``,
    `— DoyinTech`,
    SITE,
  ]
    .filter(Boolean)
    .join("\n");

  return sendResend({ to: p.email, subject, text });
}
