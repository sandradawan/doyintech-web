"use client";

import { useState, type FormEvent } from "react";

/**
 * NRS e-invoicing (Merchant Buyer Solution) phases, per the NRS public notice of Feb 2026
 * as summarised by KPMG. Dates are official guidance and may be revised by the NRS.
 */
const PHASES = [
  {
    id: "large",
    label: "Above ₦5 billion",
    title: "Large taxpayer — already in scope",
    timeline: ["E-invoicing is already live for large taxpayers.", "Enforcement has begun in 2026."],
  },
  {
    id: "medium",
    label: "₦1 billion – ₦5 billion",
    title: "Medium taxpayer — live since 1 July 2026",
    timeline: ["Go-live: 1 July 2026", "Review: October–November 2026", "Enforcement: January–March 2027"],
  },
  {
    id: "small",
    label: "Below ₦1 billion",
    title: "Small / emerging business — your turn is 2027",
    timeline: ["Pilot: April–June 2027", "Go-live: 1 July 2027", "Enforcement: January–March 2028"],
  },
] as const;

type PhaseId = (typeof PHASES)[number]["id"];

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";

export default function EInvoicingReadiness() {
  const [phase, setPhase] = useState<PhaseId>("small");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const current = PHASES.find((p) => p.id === phase)!;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("busy");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          website: trap,
          type: "waitlist",
          product: "E-invoicing readiness",
          source: "e-invoicing",
          message: `Business: ${business || "—"} · Turnover band: ${current.label} · ${current.title}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not send");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:p-6">
        <p className="text-[14px] font-semibold text-white">Your annual turnover</p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Annual turnover">
          {PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={phase === p.id}
              onClick={() => setPhase(p.id)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
                phase === p.id ? "bg-[#ff8c14] text-black" : "border border-white/15 text-white/80"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-4" role="status">
          <p className="text-[17px] font-semibold text-white">{current.title}</p>
          <ul className="mt-2 space-y-1 text-[14px] text-[#c7cdd8]">
            {current.timeline.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <p className="text-[16px] font-semibold text-white">Get e-invoicing ready without the stress</p>
        <p className="mt-1 text-[14px] text-[#a1a1a6]">
          We&apos;ll review how you invoice today, set up an e-invoice-ready billing process on your
          website or POS through an NRS-accredited provider, and remind you before your
          deadlines.
        </p>
        {state === "done" ? (
          <p className="mt-4 text-[14px] text-emerald-300">
            Thanks — we&apos;ll contact you within one business day.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" aria-label="Your name" className={field} />
            <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Business name" aria-label="Business name" className={field} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Email" className={field} />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="WhatsApp number" aria-label="WhatsApp number" className={field} />
            <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} className="hidden" aria-hidden />
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={state === "busy" || (!email.includes("@") && phone.length < 7)}
                className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60"
              >
                {state === "busy" ? "Sending…" : "Help me get ready"}
              </button>
              <p className="mt-2 text-[12px] text-[#86868b]">Email or WhatsApp number required.</p>
              {state === "error" && <p className="mt-2 text-[13px] text-red-400">{error}</p>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
