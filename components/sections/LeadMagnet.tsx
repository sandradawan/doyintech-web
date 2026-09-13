"use client";

import { useState } from "react";
import ScrollReveal from "../animations/ScrollReveal";

export default function LeadMagnet() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          product: "SME Digital Ops Checklist (Free)",
          type: "lead-magnet",
          message: "Requested free checklist",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMsg(
        "You’re in. We’ll send the checklist and occasional offers. For instant help, use WhatsApp."
      );
      setName("");
      setEmail("");
    } catch (err: any) {
      setStatus("err");
      setMsg(err.message || "Could not submit");
    }
  }

  return (
    <section className="apple-section apple-section-black py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="grid items-center gap-8 rounded-[28px] border border-white/10 bg-[#1d1d1f] p-8 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2997ff]">
                Free lead magnet
              </p>
              <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[34px]">
                SME Digital Ops Checklist
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-[#a1a1a6]">
                Free checklist for websites, WhatsApp, payments, backups, and security.
                Builds your email list — future product launches go to people who already
                trust you.
              </p>
              <ul className="mt-4 space-y-1 text-[14px] text-[#f5f5f7]">
                <li>✓ Website must-haves</li>
                <li>✓ WhatsApp business setup</li>
                <li>✓ Backup & security basics</li>
              </ul>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#2997ff]/50"
              />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-[#2997ff]/50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-[#0071e3] py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Get free checklist"}
              </button>
              {msg && (
                <p
                  className={`text-[13px] ${
                    status === "err" ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {msg}
                </p>
              )}
              <p className="text-[11px] text-[#a1a1a6]">
                No spam. Unsubscribe anytime. We only send useful product updates.
              </p>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
