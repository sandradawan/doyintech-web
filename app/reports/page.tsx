"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import {
  REPORT_PACKAGES,
  PLATFORMS,
  type ReportPackage,
  type PlatformId,
} from "@/lib/reports/packages";
import { formatNgn, formatUsdFromNgn } from "@/lib/currency";

type PlatformRow = { platform: PlatformId; url: string };

export default function ReportStudioPage() {
  const [packageId, setPackageId] = useState(
    REPORT_PACKAGES.find((p) => p.recommended)?.id || "platform-pro"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rows, setRows] = useState<PlatformRow[]>([
    { platform: "instagram", url: "" },
  ]);
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessObjective, setBusinessObjective] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const pkg = REPORT_PACKAGES.find((p) => p.id === packageId) as ReportPackage;
  const max = pkg?.maxPlatforms || 1;

  function setRow(i: number, patch: Partial<PlatformRow>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function selectPackage(id: string) {
    setPackageId(id);
    const next = REPORT_PACKAGES.find((p) => p.id === id);
    const m = next?.maxPlatforms || 1;
    setRows((prev) => prev.slice(0, m));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const platforms = rows
        .map((r) => ({ platform: r.platform, url: r.url.trim() }))
        .filter((r) => r.url);
      const res = await fetch("/api/reports/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          name,
          email,
          phone,
          platforms,
          profileUrl: platforms[0]?.url || "",
          businessCategory,
          businessObjective,
          targetAudience,
          notes,
        }),
      });
      const data = await res.json();
      if (data.orderId) setOrderId(data.orderId);
      if (!res.ok && !data.authorizationUrl && !data.whatsapp) {
        setError(data.error || "Could not create order");
        return;
      }
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      if (data.whatsapp) window.open(data.whatsapp, "_blank");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1020px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/" className="text-[#2997ff] hover:underline">Home</Link> / Report Studio
          </p>
          <h1 className="mt-3 font-display text-[32px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[40px]">
            AI Report Studio
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#a1a1a6]">
            Multi-platform audits — Instagram, Facebook, TikTok, YouTube, LinkedIn,
            WhatsApp, website, X, and more. One branded report. Print → Save as PDF.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[12px] text-[#a1a1a6]">
            {["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn", "WhatsApp", "Website", "X"].map(
              (x) => (
                <span key={x} className="rounded-full border border-white/10 px-2.5 py-1">{x}</span>
              )
            )}
          </div>
          <div className="mt-8">
            <Link href="/reports/track" className="rounded-full border border-[#ff8c14]/40 px-3 py-1 text-[13px] text-[#ff8c14]">
              Track an order →
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REPORT_PACKAGES.map((p) => {
              const active = packageId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPackage(p.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    active ? "border-[#ff8c14] bg-[#ff8c14]/10" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {p.badge && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff8c14]">{p.badge}</span>
                  )}
                  <h2 className="mt-1 font-display text-[17px] font-semibold text-white">{p.name}</h2>
                  <p className="mt-1 text-[20px] font-bold text-white">{formatNgn(p.priceNgn)}</p>
                  <p className="text-[12px] text-[#86868b]">
                    {formatUsdFromNgn(p.priceNgn)} · up to {p.maxPlatforms} channel{p.maxPlatforms > 1 ? "s" : ""}
                  </p>
                  <p className="mt-2 text-[13px] text-[#a1a1a6]">{p.blurb}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-10 space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="font-display text-[20px] font-semibold text-white">Order details</h2>
            <p className="text-[13px] text-[#a1a1a6]">
              <strong className="text-white">{pkg?.name}</strong> — {pkg ? formatNgn(pkg.priceNgn) : ""} · max {max} link{max > 1 ? "s" : ""}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[13px] text-[#a1a1a6]">
                Full name *
                <input required value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]" />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                Email *
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]" />
              </label>
            </div>
            <label className="block text-[13px] text-[#a1a1a6]">
              Phone / WhatsApp
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]" />
            </label>

            <div className="space-y-3">
              <p className="text-[13px] font-medium text-white">
                Platform links *{" "}
                <span className="font-normal text-[#a1a1a6]">(IG, FB, TikTok, YT, LinkedIn, WA, web, X…)</span>
              </p>
              {rows.map((row, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={row.platform}
                    onChange={(e) => setRow(i, { platform: e.target.value as PlatformId })}
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-[14px] text-white sm:w-44"
                  >
                    {PLATFORMS.map((pl) => (
                      <option key={pl.id} value={pl.id}>{pl.label}</option>
                    ))}
                  </select>
                  <input
                    value={row.url}
                    onChange={(e) => setRow(i, { url: e.target.value })}
                    placeholder={PLATFORMS.find((p) => p.id === row.platform)?.placeholder || "https://…"}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]"
                  />
                  {rows.length > 1 && (
                    <button type="button" onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-[13px] text-[#a1a1a6]">Remove</button>
                  )}
                </div>
              ))}
              {rows.length < max && (
                <button type="button" onClick={() => setRows((prev) => [...prev, { platform: "website", url: "" }])}
                  className="text-[13px] font-medium text-[#2997ff]">+ Add another platform</button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[13px] text-[#a1a1a6]">
                Business category
                <input value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)}
                  placeholder="e.g. Makeup, Property, Coaching"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]" />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                Main objective
                <input value={businessObjective} onChange={(e) => setBusinessObjective(e.target.value)}
                  placeholder="e.g. More bookings from social + web"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]" />
              </label>
            </div>
            <label className="block text-[13px] text-[#a1a1a6]">
              Target audience
              <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]" />
            </label>
            <label className="block text-[13px] text-[#a1a1a6]">
              Notes
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#ff8c14]" />
            </label>
            {error && <p className="text-[14px] text-red-300">{error}</p>}
            {orderId && (
              <p className="text-[14px] text-emerald-200">Order ID: <strong>{orderId}</strong></p>
            )}
            <button type="submit" disabled={loading}
              className="rounded-full bg-[#ff8c14] px-6 py-3.5 text-[15px] font-semibold text-black disabled:opacity-60">
              {loading ? "Starting payment…" : `Pay ${pkg ? formatNgn(pkg.priceNgn) : ""} & get report`}
            </button>
            <p className="text-[12px] text-[#86868b]">
              We analyse links you submit and public details only. No invented follower or view counts.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
