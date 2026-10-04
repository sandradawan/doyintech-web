import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { CASE_STUDIES } from "@/lib/case-studies-data";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Case Studies — Real results for Nigerian businesses",
  description:
    "How DoyinTech ships websites and systems that get enquiries: property platforms, local service brands, gaming lounges, and marketplaces.",
};

export default function CaseStudiesIndex() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[980px] px-6">
          <p className="section-eyebrow text-[#ff8c14]">Proof · not promises</p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">
            Case studies
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#a1a1a6]">
            Real projects shipped for Nigerian businesses — from single-offer landing pages to
            multi-portal platforms. Fixed scope, clear handoff, WhatsApp-ready delivery.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {CASE_STUDIES.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="glass-card group flex flex-col p-6 transition hover:border-[#2997ff]/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
                    {s.tag}
                  </span>
                  <span className="text-[12px] text-[#a1a1a6]">{s.metric}</span>
                </div>
                <h2 className="mt-3 text-[20px] font-semibold text-white group-hover:text-[#2997ff]">
                  {s.name}
                </h2>
                <p className="mt-1 text-[13px] text-[#86868b]">{s.sector}</p>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#a1a1a6]">
                  {s.outcome}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {s.results.map((r) => (
                    <div
                      key={r.label}
                      className="rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2"
                    >
                      <p className="text-[13px] font-semibold text-white">{r.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500">
                        {r.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-[13px] font-medium text-[#2997ff]">Read story →</p>
              </Link>
            ))}
          </div>

          <div className="mt-16 rounded-[28px] border border-white/[0.1] bg-gradient-to-br from-[#0071e3]/15 to-[#1d1d1f] p-8 text-center sm:p-10">
            <h2 className="text-[24px] font-semibold text-white sm:text-[28px]">
              Want results like these?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-[#a1a1a6]">
              Fixed-price packages, 50% deposit, clear scope. Book a free discovery call.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/hire" className="apple-btn apple-btn-primary">
                View packages & deposit
              </a>
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white"
              >
                Book free call
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
