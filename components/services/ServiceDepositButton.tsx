"use client";

import { useState } from "react";
import { withGiftCode } from "@/lib/giftcards/client";
import type { ServiceOffer } from "@/lib/service-offers";
import { serviceWhatsAppLink } from "@/lib/service-offers";

export default function ServiceDepositButton({ offer }: { offer: ServiceOffer }) {
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
        body: JSON.stringify(withGiftCode({ productId: offer.id, email: email.trim(), name: "Service deposit" })),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS" || !data.authorization_url) {
        window.location.href = serviceWhatsAppLink(offer);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.authorization_url;
    } catch (e: unknown) {
      setErr((e instanceof Error && e.message) || "Could not start payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-5">
      <p className="text-[13px] text-brand-muted">Pay 50% deposit to lock your slot</p>
      <p className="mt-1 text-[28px] font-semibold text-brand-ink">{offer.depositNgn}</p>
      <p className="text-[12px] text-brand-subtle">
        Total package {offer.totalNgn} · balance before handoff
      </p>
      <label className="mt-4 block text-[12px] text-brand-muted">
        Email (receipt)
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-link"
          placeholder="you@email.com"
        />
      </label>
      <button
        type="button"
        disabled={loading || !email.includes("@")}
        onClick={pay}
        className="mt-4 w-full rounded-full bg-brand-accent py-3.5 text-[15px] font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Redirecting…" : `Pay deposit · ${offer.depositNgn}`}
      </button>
      <a
        href={serviceWhatsAppLink(offer)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#25D366]/50 py-3 text-[13px] font-semibold text-[#25D366]"
      >
        Prefer WhatsApp
      </a>
      {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
    </div>
  );
}
