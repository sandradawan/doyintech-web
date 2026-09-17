"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessBody() {
  const q = useSearchParams();
  const invoice = q.get("invoice") || "";
  const reference = q.get("reference") || q.get("trxref") || "";
  const [status, setStatus] = useState<"checking" | "paid" | "pending">("checking");

  useEffect(() => {
    // Persist for OpsApp auto-mark on same browser
    try {
      const key = "doyinops_paid_invoices";
      const prev = JSON.parse(localStorage.getItem(key) || "[]") as string[];
      const next = Array.from(new Set([...(prev || []), invoice].filter(Boolean)));
      localStorage.setItem(key, JSON.stringify(next));
      if (reference) {
        localStorage.setItem(`doyinops_ref_${invoice || reference}`, reference);
      }
    } catch {
      /* ignore */
    }

    const params = new URLSearchParams();
    if (invoice) params.set("invoice", invoice);
    if (reference) params.set("reference", reference);
    if (!invoice && !reference) {
      setStatus("pending");
      return;
    }

    fetch(`/api/ops/payments/check?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setStatus(d.paid ? "paid" : "pending"))
      .catch(() => setStatus("pending"));
  }, [invoice, reference]);

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c1220] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-400">
        ✓
      </div>
      <h1 className="mt-4 text-2xl font-semibold text-white">
        {status === "paid" ? "Payment confirmed" : "Payment received"}
      </h1>
      <p className="mt-2 text-sm text-white/55">
        Thank you. Your payment was submitted successfully
        {invoice ? (
          <>
            {" "}
            for invoice <span className="font-mono text-[#ff8c14]">{invoice}</span>
          </>
        ) : null}
        .
      </p>
      {reference && (
        <p className="mt-3 break-all text-[11px] text-white/35">Reference: {reference}</p>
      )}
      <p className="mt-4 text-[13px] text-white/45">
        {status === "checking"
          ? "Confirming with Paystack…"
          : "You can close this tab. The business workspace will mark the invoice paid automatically."}
      </p>
      <Link
        href="/ops/app"
        className="mt-6 inline-flex rounded-full bg-[#ff8c14] px-6 py-2.5 text-sm font-semibold text-black"
      >
        Open DoyinOps
      </Link>
    </div>
  );
}

export default function OpsPaySuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070b12] px-6">
      <Suspense fallback={<p className="text-white/50">Loading…</p>}>
        <SuccessBody />
      </Suspense>
    </main>
  );
}
