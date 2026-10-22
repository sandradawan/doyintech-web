"use client";

import { useState } from "react";

/** Email + pay for a fixed-price add-on (full price, via the same Paystack initialize route as deposits). */
export default function AddonBuyButton({ id, name, price }: { id: string; name: string; price: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function pay() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, email: email.trim(), name: "Add-on" }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "Could not start payment");
      window.location.href = data.authorization_url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not start payment");
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-full border border-white/20 py-2.5 text-[14px] font-semibold text-white transition hover:bg-white/5"
      >
        Add · {price}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label={`Email for ${name} receipt`}
        className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
      />
      <button
        type="button"
        disabled={loading || !email.includes("@")}
        onClick={pay}
        className="w-full rounded-full bg-[#ff8c14] py-2.5 text-[14px] font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Redirecting…" : `Pay ${price}`}
      </button>
      {err && <p className="text-[12px] text-red-400">{err}</p>}
    </div>
  );
}
