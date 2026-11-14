"use client";

import { useState } from "react";
import { withGiftCode } from "@/lib/giftcards/client";

/** Email + pay for any catalogue item by id (used for ebook bundles). */
export default function BundleBuyButton({ productId, label }: { productId: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withGiftCode({ productId, email: email.trim(), name: "" })),
      });
      const data = (await res.json()) as { authorization_url?: string; error?: string };
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "Could not start payment.");
      window.location.href = data.authorization_url;
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Could not start payment.");
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="min-h-11 w-full rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">
        {label}
      </button>
    );
  }
  return (
    <form onSubmit={pay} className="space-y-2">
      <label className="block text-[12px] text-brand-muted">
        Email for your receipt and downloads
        <input
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link"
        />
      </label>
      <button type="submit" disabled={busy} className="min-h-11 w-full rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black disabled:opacity-60">
        {busy ? "Opening checkout…" : "Pay with card"}
      </button>
      {err && <p role="alert" className="text-[13px] text-red-300">{err}</p>}
    </form>
  );
}
