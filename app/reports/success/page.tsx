"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { reportStatusLabel } from "@/lib/reports/packages";

function SuccessInner() {
  const params = useSearchParams();
  const orderId = params.get("order") || "";
  const reference = params.get("reference") || params.get("trxref") || "";
  const [status, setStatus] = useState("");
  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let polls = 0;

    // Server verifies the reference with Paystack and starts generation; the webhook
    // does the same, so this is only a fast path.
    if (reference) {
      fetch("/api/reports/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, reference }),
      }).catch(() => {});
    }

    async function poll() {
      try {
        const q = new URLSearchParams({ orderId });
        if (reference) q.set("reference", reference);
        const res = await fetch(`/api/reports/orders?${q}`);
        const data = await res.json();
        if (cancelled || !res.ok) return;
        setStatus(data.status || "");
        setViewUrl(data.viewUrl);
        setProductName(data.productName || "");
        polls += 1;
        if (
          ["pending_payment", "paid", "queued", "processing"].includes(data.status) &&
          polls < 60
        ) {
          setTimeout(poll, 4000);
        }
      } catch { /* ignore */ }
    }
    poll();
    return () => { cancelled = true; };
  }, [orderId, reference]);

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto max-w-[640px] px-5 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-link">Report Studio</p>
        <h1 className="mt-3 font-display text-[28px] font-semibold text-brand-ink">Payment received</h1>
        {orderId && (
          <p className="mt-3 text-[15px] text-brand-muted">
            Order <code className="text-brand-ink">{orderId}</code>
            {productName ? ` · ${productName}` : ""}
          </p>
        )}
        <div className="mt-8 rounded-2xl border border-brand-ink/10 bg-brand-ink/[0.03] p-6 text-left">
          <p className="text-[13px] text-brand-subtle">Status</p>
          <p className="mt-1 text-[17px] font-semibold text-brand-ink">
            {reportStatusLabel(status || "pending_payment")}
          </p>
          {viewUrl ? (
            <a href={viewUrl} className="mt-5 inline-flex rounded-full bg-brand-accent px-6 py-3 text-[14px] font-semibold text-black">
              Open your report
            </a>
          ) : (
            <p className="mt-4 text-[14px] text-brand-muted">
              Generation usually finishes within a minute. We also email the secure link.
            </p>
          )}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/reports/track${orderId ? `?order=${encodeURIComponent(orderId)}` : ""}`}
            className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-[14px] text-brand-ink">
            Track order
          </Link>
          <Link href="/reports" className="rounded-full border border-brand-ink/15 px-5 py-2.5 text-[14px] text-brand-ink">
            Order another
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ReportSuccessPage() {
  return (
    <>
      <Suspense fallback={<main className="pt-28 text-center text-brand-muted">Loading…</main>}>
        <SuccessInner />
      </Suspense>
      <Footer />
    </>
  );
}
