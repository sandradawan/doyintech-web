"use client";

import { useState } from "react";
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
        body: JSON.stringify({
          productId: offer.id,
          email: email.trim(),
          name: "Service deposit",
        }),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS" || !data.authorization_url) {
        window.location.href = serviceWhatsAppLink(offer);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.authorization_url;
    } catch (e: any) {
      setErr(e.message || "Could not start payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
      <p className="text-[13px] text-[#a1a1a6]">Pay 50% deposit to lock your slot</p>
      <p className="mt-1 text-[28px] font-semibold text-white">{offer.depositNgn}</p>
      <p className="text-[12px] text-[#86868b]">
        Total package {offer.totalNgn} · balance before handoff
      </p>
      <label className="mt-4 block text-[12px] text-[#a1a1a6]">
        Email (receipt)
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
          placeholder="you@email.com"
        />
      </label>
      <button
        type="button"
        disabled={loading || !email.includes("@")}
        onClick={pay}
        className="mt-4 w-full rounded-full bg-[#ff8c14] py-3.5 text-[15px] font-semibold text-black disabled:opacity-50"
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
