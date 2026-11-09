"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { sendSignInLink } from "@/lib/tools/cloud-save";
import { normalizeWhatsapp } from "@/lib/storefront/shared";
import { track } from "@/lib/analytics/client";

type Props = {
  docNumber: string;
  amountNgn: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dueDate: string;
  businessName: string;
};

type Stage =
  | { kind: "closed" }
  | { kind: "checking" }
  | { kind: "signin" }
  | { kind: "setup"; status: "none" | "off" | "pending_review" | "rejected" }
  | { kind: "ready"; feePercent: number; token: string }
  | { kind: "created"; url: string; emailed: boolean };

const naira = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

/**
 * "Get paid online" for an invoice: turns it into a DoyinTech payment link (Paystack, settling to
 * the seller's own bank through their approved subaccount), with WhatsApp and email sending.
 */
export default function GetPaidPanel(p: Props) {
  const [stage, setStage] = useState<Stage>({ kind: "closed" });
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function open() {
    setError("");
    setStage({ kind: "checking" });
    track("get_paid_open", p.docNumber.slice(0, 20));
    const sb = getSupabaseBrowser();
    const { data } = sb ? await sb.auth.getSession() : { data: { session: null } };
    const token = data.session?.access_token;
    if (!token) return setStage({ kind: "signin" });
    const res = await fetch("/api/storefront/me", { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return setStage({ kind: "signin" });
    const json = await res.json();
    if (!json.store) return setStage({ kind: "setup", status: "none" });
    if (json.store.payments_status !== "active") return setStage({ kind: "setup", status: json.store.payments_status });
    setStage({ kind: "ready", feePercent: Number(json.feePercent) || 0, token });
  }

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const err = await sendSignInLink(email);
    setBusy(false);
    if (err) setError(err);
    else setSent(true);
  }

  async function create(token: string) {
    setError("");
    if (p.amountNgn < 100) return setError("The invoice total must be at least ₦100.");
    setBusy(true);
    const res = await fetch("/api/storefront/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: `Invoice ${p.docNumber}`.slice(0, 100),
        amount_ngn: Math.round(p.amountNgn),
        description: p.businessName ? `Payment to ${p.businessName}` : undefined,
        customer_name: p.customerName || undefined,
        customer_email: p.customerEmail || undefined,
        due_date: /^\d{4}-\d{2}-\d{2}$/.test(p.dueDate) ? p.dueDate : undefined,
        send: sendEmail && !!p.customerEmail,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(json.error || "Could not create the payment link.");
    track("get_paid_link_created", p.docNumber.slice(0, 20));
    setStage({ kind: "created", url: json.url, emailed: !!json.emailed });
  }

  const box = "mt-4 rounded-2xl border border-[#3ddc97]/30 bg-[#3ddc97]/5 p-5";

  if (stage.kind === "closed") {
    return (
      <div className={box}>
        <p className="text-[15px] font-semibold text-white">Get paid online for this invoice</p>
        <p className="mt-1 text-[13px] text-brand-soft">Send your customer a Pay now link. They pay by card, transfer or USSD, the money goes straight to your bank, and we send them reminders until it&apos;s paid.</p>
        <button type="button" onClick={open} className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#3ddc97] px-5 text-[14px] font-semibold text-black">
          Create a payment link
        </button>
      </div>
    );
  }

  if (stage.kind === "checking") return <div className={box}><p className="text-[14px] text-brand-soft">Checking your account…</p></div>;

  if (stage.kind === "signin") {
    return (
      <div className={box}>
        {sent ? (
          <p className="text-[14px] text-white" role="status">Check {email} for your sign-in link, then come back to this invoice.</p>
        ) : (
          <form onSubmit={signIn} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-[13px] text-brand-soft">
              Sign in with your email to send payment links. It&apos;s free.
              <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#3ddc97]" />
            </label>
            <button type="submit" disabled={busy} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3ddc97] px-5 text-[14px] font-semibold text-black disabled:opacity-60">{busy ? "Sending…" : "Email me a link"}</button>
          </form>
        )}
        {error && <p className="mt-2 text-[13px] text-[#ff6b6b]">{error}</p>}
      </div>
    );
  }

  if (stage.kind === "setup") {
    const msg =
      stage.status === "pending_review"
        ? "Your bank account is being reviewed. We switch on payments within one business day, then you can send links from here."
        : stage.status === "rejected"
          ? "Online payments weren't approved for your account. Message us on WhatsApp and we'll help."
          : "One-time setup (about 3 minutes): create your free business page and connect the bank account you want paid into. We verify the account name with your bank and approve within one business day.";
    return (
      <div className={box}>
        <p className="text-[14px] text-white">{msg}</p>
        {stage.status !== "pending_review" && stage.status !== "rejected" && (
          <Link href="/stores/dashboard" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#3ddc97] px-5 text-[14px] font-semibold text-black">
            {stage.status === "none" ? "Set up in 3 minutes" : "Connect your bank"}
          </Link>
        )}
        <p className="mt-2 text-[12px] text-brand-subtle">Your invoice details stay on this page; come back to it after setup.</p>
      </div>
    );
  }

  if (stage.kind === "ready") {
    return (
      <div className={box}>
        <p className="text-[15px] font-semibold text-white">Payment link for {naira(p.amountNgn)}</p>
        <p className="mt-1 text-[13px] text-brand-soft">
          Invoice {p.docNumber}{p.customerName ? ` · ${p.customerName}` : ""}. {stage.feePercent ? `${stage.feePercent}% fee on payments received (0% on the Store plan).` : "No DoyinTech fee on your plan."}
        </p>
        {p.customerEmail && (
          <label className="mt-3 flex min-h-11 items-center gap-3 text-[14px] text-white">
            <input type="checkbox" className="h-5 w-5 accent-[#3ddc97]" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
            Email it to {p.customerEmail}, with reminders before and after the due date
          </label>
        )}
        <button type="button" disabled={busy} onClick={() => create(stage.token)} className="mt-3 inline-flex min-h-11 items-center rounded-full bg-[#3ddc97] px-5 text-[14px] font-semibold text-black disabled:opacity-60">
          {busy ? "Creating…" : "Create the link"}
        </button>
        {error && <p className="mt-2 text-[13px] text-[#ff6b6b]">{error}</p>}
      </div>
    );
  }

  const wa = normalizeWhatsapp(p.customerPhone || "");
  const message = `Hello${p.customerName ? " " + p.customerName : ""}, here is invoice ${p.docNumber} for ${naira(p.amountNgn)}${p.businessName ? " from " + p.businessName : ""}. You can pay securely by card, transfer or USSD here: ${stage.url}`;
  const waHref = `https://wa.me/${wa ?? ""}?text=${encodeURIComponent(message)}`;
  return (
    <div className={box}>
      <p className="text-[15px] font-semibold text-white">Your payment link is ready</p>
      <p className="mt-2 break-all rounded-xl bg-black/40 px-3 py-2 text-[14px] text-white">{stage.url}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-[#25D366] px-5 text-[14px] font-semibold text-black">Send on WhatsApp</a>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(stage.url);
              setCopied(true);
            } catch {
              /* clipboard blocked */
            }
          }}
          className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-[14px] font-semibold text-white"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <Link href="/stores/dashboard" className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-[14px] font-semibold text-white">Track payments</Link>
      </div>
      <p className="mt-2 text-[12px] text-brand-subtle">
        {stage.emailed ? `Emailed to ${p.customerEmail}. ` : ""}When they pay, the money settles to your bank and the link shows as paid in your dashboard.
      </p>
    </div>
  );
}
