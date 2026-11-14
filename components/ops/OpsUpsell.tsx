"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TRACK_EVENT } from "@/lib/analytics/client";
import { Money } from "@/components/ui/Price";

/**
 * Under the invoice, receipt and quote makers: people who make documents for clients every week
 * are the people DoyinOps is for. It brightens after they save a PDF.
 */
export default function OpsUpsell() {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const onTrack = (e: Event) => {
      if ((e as CustomEvent<{ name: string }>).detail?.name === "tool_download") setLit(true);
    };
    window.addEventListener(TRACK_EVENT, onTrack);
    return () => window.removeEventListener(TRACK_EVENT, onTrack);
  }, []);

  return (
    <aside
      aria-label="DoyinOps"
      className={`mt-8 rounded-2xl border p-5 transition sm:p-6 ${lit ? "border-brand-link/60 bg-brand-link/10" : "border-brand-ink/10 bg-brand-surface"}`}
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-link">{lit ? "Saved. What next?" : "Send invoices every week?"}</p>
      <h2 className="mt-2 text-[20px] font-semibold text-brand-ink">Keep every client and invoice in one place with DoyinOps</h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-brand-muted">
        See who has paid and who hasn&apos;t, send WhatsApp reminders in one tap, and track deals from first enquiry to payment. Free in
        your browser; backup and sync on every device from <Money ngn={7500} /> a month.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href="/ops/app" className="inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">
          Try DoyinOps free
        </Link>
        <Link href="/ops#plans" className="inline-flex min-h-11 items-center rounded-full border border-brand-ink/20 px-5 text-[14px] font-semibold text-brand-ink">
          See plans
        </Link>
      </div>
    </aside>
  );
}
