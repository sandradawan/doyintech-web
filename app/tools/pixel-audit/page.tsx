"use client";

import { useState } from "react";
import Link from "next/link";
import type { PixelAuditReport, AuditStatus } from "@/lib/meta/pixel-audit-types";

const STATUS_STYLE: Record<AuditStatus, string> = {
  passed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  needs_attention: "border-amber-500/30 bg-amber-500/10 text-amber-100",
  warning: "border-orange-500/30 bg-orange-500/10 text-orange-100",
  not_detected: "border-white/10 bg-white/5 text-[#a1a1a6]",
  unable_to_verify: "border-sky-500/30 bg-sky-500/10 text-sky-100",
};

export default function PixelAuditPage() {
  const [url, setUrl] = useState("https://");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [report, setReport] = useState<PixelAuditReport | null>(null);

  async function run() {
    setLoading(true);
    setErr("");
    setReport(null);
    try {
      const res = await fetch("/api/tools/pixel-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Audit failed");
      setReport(json.report);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Audit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05060a] pb-24 pt-24 text-[#f5f5f7]">
      <div className="mx-auto max-w-3xl px-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#ff8c14]">
          DoyinTech Pixel Audit
        </p>
        <h1 className="mt-2 font-display text-[32px] font-semibold tracking-tight sm:text-[40px]">
          Meta Pixel website audit
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#a1a1a6]">
          Submit a public website URL for a technical scan of detectable Meta Pixel installation
          issues. This is not official Meta certification — use Events Manager to confirm delivery.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <label className="block text-[12px] uppercase tracking-wide text-[#86868b]">Website URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#2997ff]/50"
          />
          <button
            type="button"
            disabled={loading}
            onClick={() => run()}
            className="mt-4 w-full rounded-full bg-[#ff8c14] px-5 py-3 text-[14px] font-semibold text-black disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Scanning…" : "Run audit"}
          </button>
          {err ? (
            <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{err}</p>
          ) : null}
        </div>

        {report ? (
          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#121214] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] text-[#86868b]">Report</p>
                  <p className="mt-1 break-all text-[14px] text-white">{report.finalUrl}</p>
                  <p className="mt-1 text-[12px] text-[#555]">{new Date(report.auditedAt).toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 px-4 py-3 text-center">
                  <p className="text-[11px] uppercase text-[#ff8c14]">Score</p>
                  <p className="font-display text-[28px] font-semibold text-white">{report.score}</p>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-[#86868b]">{report.scoreNote}</p>
              <p className="mt-2 text-[13px] text-[#a1a1a6]">
                Pixel detected:{" "}
                <strong className="text-white">{report.pixelDetected ? "Yes" : "No"}</strong>
                {report.pixelIds.length ? ` · IDs: ${report.pixelIds.join(", ")}` : ""}
              </p>
            </div>

            <div className="space-y-3">
              {report.checks.map((c) => (
                <div key={c.id} className={`rounded-xl border px-4 py-3 ${STATUS_STYLE[c.status]}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[14px] font-semibold">{c.title}</p>
                    <span className="text-[11px] uppercase tracking-wide opacity-80">{c.status.replace("_", " ")}</span>
                  </div>
                  <p className="mt-1 text-[13px] opacity-90">{c.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#ff8c14]/25 bg-[#ff8c14]/10 p-5">
              <p className="text-[15px] font-semibold text-white">Need help installing or fixing Meta Pixel?</p>
              <p className="mt-2 text-[13px] text-[#e8e8ed]">
                Contact DoyinTech — WhatsApp +2348085343926 or doyintechnology@outlook.com
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%20need%20help%20with%20Meta%20Pixel." className="rounded-full bg-[#25D366] px-5 py-2.5 text-[13px] font-semibold text-black">WhatsApp</a>
                <a href="mailto:doyintechnology@outlook.com" className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-medium text-white">Email</a>
                <Link href="/hire" className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-medium text-white">Hire</Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
