"use client";

import { useState, Suspense, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { reportStatusLabel } from "@/lib/reports/packages";
import { formatNgn } from "@/lib/currency";

function TrackInner() {
  const params = useSearchParams();
  const [orderId, setOrderId] = useState(params.get("order") || "");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{
    orderId: string;
    productName: string;
    priceNgn: number;
    status: string;
    viewUrl: string | null;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const q = new URLSearchParams({ orderId: orderId.trim() });
      if (email.trim()) q.set("email", email.trim());
      const res = await fetch(`/api/reports/orders?${q}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Not found");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto max-w-[520px] px-5">
        <p className="text-[13px] text-[#a1a1a6]">
          <Link href="/reports" className="text-[#2997ff] hover:underline">Report Studio</Link> / Track
        </p>
        <h1 className="mt-3 font-display text-[28px] font-semibold text-white">Track your report</h1>
        <form onSubmit={lookup} className="mt-8 space-y-4">
          <label className="block text-[13px] text-[#a1a1a6]">
            Order ID *
            <input required value={orderId} onChange={(e) => setOrderId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]" />
          </label>
          <label className="block text-[13px] text-[#a1a1a6]">
            Email used at checkout *
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]" />
          </label>
          {error && <p className="text-red-300 text-[14px]">{error}</p>}
          <button type="submit" disabled={loading}
            className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60">
            {loading ? "Looking up…" : "Check status"}
          </button>
        </form>
        {result && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[12px] text-[#86868b]">{result.orderId}</p>
            <p className="mt-1 text-[18px] font-semibold text-white">{result.productName}</p>
            <p className="mt-1 text-[14px] text-[#a1a1a6]">
              {formatNgn(result.priceNgn)} · {reportStatusLabel(result.status)}
            </p>
            {result.viewUrl ? (
              <a href={result.viewUrl} className="mt-5 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
                Open report
              </a>
            ) : (
              <p className="mt-4 text-[13px] text-[#a1a1a6]">Report not ready yet. If you paid, wait a minute and refresh.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ReportTrackPage() {
  return (
    <>
      <Suspense fallback={<main className="pt-28 text-center text-[#a1a1a6]">Loading…</main>}>
        <TrackInner />
      </Suspense>
      <Footer />
    </>
  );
}
