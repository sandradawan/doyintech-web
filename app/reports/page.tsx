"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { REPORT_PACKAGES, type ReportPackage } from "@/lib/reports/packages";
import { formatNgn, formatUsdFromNgn } from "@/lib/currency";

export default function ReportStudioPage() {
  const [packageId, setPackageId] = useState(
    REPORT_PACKAGES.find((p) => p.recommended)?.id || "ig-pro"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessObjective, setBusinessObjective] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const pkg = REPORT_PACKAGES.find((p) => p.id === packageId) as ReportPackage;
  const needsProfile =
    pkg?.reportType === "instagram_audit" || pkg?.reportType === "business_profile";

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/reports/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          name,
          email,
          phone,
          profileUrl,
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
            Your profile. Your data. Your personalized report. Pay once, receive a branded
            professional report — view online and Print → Save as PDF.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-[13px]">
            <Link href="/reports/track" className="rounded-full border border-[#ff8c14]/40 px-3 py-1 text-[#ff8c14]">
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
                  onClick={() => setPackageId(p.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    active ? "border-[#ff8c14] bg-[#ff8c14]/10" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {p.badge && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff8c14]">
                      {p.badge}
                    </span>
                  )}
                  <h2 className="mt-1 font-display text-[17px] font-semibold text-white">{p.name}</h2>
                  <p className="mt-1 text-[20px] font-bold text-white">{formatNgn(p.priceNgn)}</p>
                  <p className="text-[12px] text-[#86868b]">{formatUsdFromNgn(p.priceNgn)} · one-time</p>
                  <p className="mt-2 text-[13px] text-[#a1a1a6]">{p.blurb}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="mt-10 space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="font-display text-[20px] font-semibold text-white">Order details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[13px] text-[#a1a1a6]">
                Full name *
                <input required value={name} onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]" />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                Email *
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[13px] text-[#a1a1a6]">
                Phone / WhatsApp
                <input value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]" />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                Profile or website URL {needsProfile ? "*" : ""}
                <input required={needsProfile} value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://instagram.com/yourbrand"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[13px] text-[#a1a1a6]">
                Business category
                <input value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)}
                  placeholder="e.g. Makeup artist, Property"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]" />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                Main objective
                <input value={businessObjective} onChange={(e) => setBusinessObjective(e.target.value)}
                  placeholder="e.g. More bookings"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]" />
              </label>
            </div>
            <label className="block text-[13px] text-[#a1a1a6]">
              Target audience
              <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]" />
            </label>
            <label className="block text-[13px] text-[#a1a1a6]">
              Notes
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]" />
            </label>
            {error && <p className="text-[14px] text-red-300">{error}</p>}
            {orderId && (
              <p className="text-[14px] text-emerald-200">Order ID: <strong>{orderId}</strong> — save to track delivery.</p>
            )}
            <button type="submit" disabled={loading}
              className="rounded-full bg-[#ff8c14] px-6 py-3.5 text-[15px] font-semibold text-black disabled:opacity-60">
              {loading ? "Starting payment…" : `Pay ${pkg ? formatNgn(pkg.priceNgn) : ""} & get report`}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
