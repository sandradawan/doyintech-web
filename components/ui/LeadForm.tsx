"use client";

import { useState } from "react";

const input = "mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[15px] text-brand-ink outline-none focus:border-brand-link";
const label = "block text-[13px] font-medium text-brand-muted";

type Props = {
  /** What the person is asking about; shows in the lead email. */
  product: string;
  source: string;
  type?: "quote" | "waitlist";
  button?: string;
  /** Label for the free-text box. */
  messageLabel?: string;
  messagePlaceholder?: string;
  /** Optional choice list, e.g. a plan or business type. */
  choice?: { label: string; options: string[] };
  done?: string;
};

/** A short enquiry form that posts to /api/leads, so every request reaches the leads inbox and admin. */
export default function LeadForm({
  product,
  source,
  type = "quote",
  button = "Send request",
  messageLabel = "What do you need? (optional)",
  messagePlaceholder = "",
  choice,
  done = "Thanks. We will reply on WhatsApp or email within one working day.",
}: Props) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const picked = choice ? String(data.get("choice") || "") : "";
    setState("busy");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          phone: String(data.get("phone") || ""),
          email: String(data.get("email") || ""),
          product: picked ? `${product}: ${picked}` : product,
          type,
          source,
          message: [picked && `${choice?.label}: ${picked}`, String(data.get("message") || "")].filter(Boolean).join("\n"),
          website: String(data.get("website") || ""),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error || "That didn't send. Please try again.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't send. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-2xl border border-brand-link/40 bg-brand-link/10 p-6">
        <p className="text-[18px] font-semibold text-brand-ink">Request received.</p>
        <p className="mt-2 text-[15px] text-brand-muted">{done}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-brand-ink/10 bg-brand-surface p-5 sm:grid-cols-2 sm:p-6">
      <label className={label}>
        Name
        <input name="name" required maxLength={120} autoComplete="name" className={input} />
      </label>
      <label className={label}>
        WhatsApp or phone number
        <input name="phone" required type="tel" maxLength={40} autoComplete="tel" className={input} />
      </label>
      <label className={label}>
        Email (optional)
        <input name="email" type="email" maxLength={200} autoComplete="email" className={input} />
      </label>
      {choice ? (
        <label className={label}>
          {choice.label}
          <select name="choice" className={input} defaultValue={choice.options[0]}>
            {choice.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      ) : (
        <span className="hidden sm:block" />
      )}
      <label className={`${label} sm:col-span-2`}>
        {messageLabel}
        <textarea name="message" rows={3} maxLength={2000} placeholder={messagePlaceholder} className={input} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {error && <p role="alert" className="text-[14px] text-red-300 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2">
        <button type="submit" disabled={state === "busy"} className="min-h-12 rounded-full bg-brand-accent px-7 text-[15px] font-semibold text-black disabled:opacity-60">
          {state === "busy" ? "Sending…" : button}
        </button>
      </div>
    </form>
  );
}
