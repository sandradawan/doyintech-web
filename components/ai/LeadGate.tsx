"use client";

import { useEffect, useState } from "react";

const KEY = "doyin_ai_lead";

export function useLeadUnlocked() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) setUnlocked(true);
    } catch {
      /* ignore */
    }
  }, []);
  return { unlocked, setUnlocked };
}

export default function LeadGate({
  product,
  unlocked,
  onUnlock,
}: {
  product: string;
  unlocked: boolean;
  onUnlock: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (unlocked) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          product,
          type: "lead-magnet",
          source: "ai-tools",
          message: `Unlocked ${product}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      try {
        sessionStorage.setItem(KEY, JSON.stringify({ name, email, at: Date.now() }));
      } catch {
        /* ignore */
      }
      onUnlock();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-[#ff8c14]/30 bg-gradient-to-br from-[#ff8c14]/10 to-transparent p-6 sm:p-8">
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#ff8c14]">
        Almost there
      </p>
      <h3 className="mt-2 font-display text-[22px] font-semibold text-white">
        Get your results
      </h3>
      <p className="mt-2 text-[14px] text-[#a1a1a6]">
        Enter your name and email (or WhatsApp) so we can save your session and follow up
        if you need help.
      </p>
      <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name *"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="WhatsApp / phone"
          className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50 sm:col-span-2"
        />
        {error ? (
          <p className="text-[13px] text-red-400 sm:col-span-2">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#ff8c14] py-3 text-[14px] font-semibold text-black disabled:opacity-60 sm:col-span-2"
        >
          {loading ? "Saving..." : "Unlock results"}
        </button>
      </form>
    </div>
  );
}
