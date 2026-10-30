"use client";

import { useState, type FormEvent } from "react";
import { readReferralCode } from "@/lib/referrals";

const field = "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";
const label = "block text-[13px] text-[#a1a1a6]";

/** Scoping request for custom systems. Creates a "quote" lead (pipeline + lead email sequence). */
export default function QuoteRequestForm({ product, prompts }: { product: string; prompts: string[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("busy");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote",
          product,
          name,
          email,
          phone,
          website: trap,
          source: `quote:${product}`,
          referral: readReferralCode() || undefined,
          message: [org && `Organisation: ${org}`, needs.length && `Needs: ${needs.join(", ")}`, message].filter(Boolean).join("\n"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send your request");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not send your request");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <p className="text-[17px] font-semibold text-white">Request received</p>
        <p className="mt-1 text-[14px] text-[#c7cdd8]">
          We&apos;ll reply within one business day, usually on WhatsApp, to book a free 15-minute scoping call. You&apos;ll get a fixed price before
          paying anything.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:p-6">
      <p className="text-[17px] font-semibold text-white">Get a fixed-price quote</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Your name
          <input className={field} required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className={label}>
          Organisation
          <input className={field} value={org} onChange={(e) => setOrg(e.target.value)} />
        </label>
        <label className={label}>
          Email
          <input className={field} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className={label}>
          WhatsApp number
          <input className={field} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0803 123 4567" />
        </label>
      </div>
      <fieldset>
        <legend className="text-[13px] text-[#a1a1a6]">What do you need? (tick any)</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {prompts.map((p) => {
            const on = needs.includes(p);
            return (
              <button
                key={p}
                type="button"
                aria-pressed={on}
                onClick={() => setNeeds((n) => (on ? n.filter((x) => x !== p) : [...n, p]))}
                className={`rounded-full px-3 py-1.5 text-[13px] ${on ? "bg-[#ff8c14] font-semibold text-black" : "border border-white/15 text-[#c7cdd8]"}`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className={label}>
        Anything else? (optional)
        <textarea className={field} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Number of students/rooms/products, deadline, current system…" />
      </label>
      <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden />
      <button type="submit" disabled={state === "busy"} className="w-full rounded-full bg-[#ff8c14] py-3 text-[15px] font-semibold text-black disabled:opacity-60">
        {state === "busy" ? "Sending…" : "Request my quote"}
      </button>
      {error && <p className="text-[13px] text-red-400">{error}</p>}
      <p className="text-[12px] text-[#86868b]">Need both email and WhatsApp? Add your number so we can reply faster.</p>
    </form>
  );
}
