"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FiCheck, FiLock } from "react-icons/fi";

/** Pay button for a payment link, plus confirmation polling after Paystack sends the customer back. */
export default function PayRequestClient({
  reference,
  status: initial,
  needsEmail,
  amount,
}: {
  reference: string;
  status: string;
  needsEmail: boolean;
  amount: string;
}) {
  const [status, setStatus] = useState(initial);
  const [checking, setChecking] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Back from Paystack (?tx=PRP_…): confirm the payment.
  useEffect(() => {
    const tx = new URLSearchParams(window.location.search).get("tx");
    if (!tx || initial !== "open") return;
    let tries = 0;
    let stop = false;
    setChecking(true);
    async function poll() {
      try {
        const res = await fetch(`/api/storefront/requests?ref=${encodeURIComponent(reference)}&tx=${encodeURIComponent(tx!)}`);
        const data = await res.json();
        if (stop) return;
        if (data.status === "paid") {
          setStatus("paid");
          setChecking(false);
          return;
        }
      } catch {
        /* retry */
      }
      if (!stop && ++tries < 15) setTimeout(poll, 3000);
      else setChecking(false);
    }
    poll();
    return () => {
      stop = true;
    };
  }, [reference, initial]);

  async function pay(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/storefront/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pay: reference, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "Could not start payment");
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setBusy(false);
    }
  }

  if (status === "paid") {
    return (
      <div role="status" className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
          <FiCheck size={18} aria-hidden />
        </span>
        <div>
          <p className="text-[15px] font-semibold">Paid. Thank you!</p>
          <p className="text-[13px] text-[#555]">The seller has been notified. Keep reference {reference}.</p>
        </div>
      </div>
    );
  }
  if (status !== "open") {
    return <p className="rounded-2xl bg-black/[0.04] p-4 text-center text-[14px] text-[#555]">This payment link has been {status}.</p>;
  }
  if (checking) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl bg-black/[0.03] p-4" role="status">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/15 border-t-[#111]" aria-hidden />
        <p className="text-[14px]">Confirming your payment…</p>
      </div>
    );
  }

  return (
    <form onSubmit={pay} className="space-y-3">
      {needsEmail && (
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email for the receipt"
          aria-label="Email"
          className="w-full rounded-xl border border-black/10 px-3.5 py-3 text-[15px] outline-none focus:border-[#111] focus:ring-2 focus:ring-black/5"
        />
      )}
      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#111] py-3.5 text-[15px] font-semibold text-white hover:bg-[#333] disabled:opacity-60"
      >
        <FiLock size={15} aria-hidden /> {busy ? "Opening secure payment…" : `Pay ${amount}`}
      </button>
      <p className="text-center text-[12px] text-[#888]">Card, bank transfer or USSD · secured by Paystack</p>
      {error && (
        <p role="alert" className="text-center text-[13px] text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
