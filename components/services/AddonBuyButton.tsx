"use client";

import { useState } from "react";
import { withGiftCode } from "@/lib/giftcards/client";

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
        body: JSON.stringify(withGiftCode({ productId: id, email: email.trim(), name: "Add-on" })),
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
        className="w-full rounded-full border border-brand-ink/20 py-2.5 text-[14px] font-semibold text-brand-ink transition hover:bg-brand-ink/5"
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
        className="w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-link"
      />
      <button
        type="button"
        disabled={loading || !email.includes("@")}
        onClick={pay}
        className="w-full rounded-full bg-brand-accent py-2.5 text-[14px] font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Redirecting…" : `Pay ${price}`}
      </button>
      {err && <p className="text-[12px] text-red-400">{err}</p>}
    </div>
  );
}
