import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Case Studies — Real results for Nigerian businesses",
  description:
    "How DoyinTech ships websites and systems that get enquiries: property platforms, local service brands, gaming lounges, and marketplaces.",
};

const studies = [
  {
    slug: "imperial-villa",
    name: "Imperial Villa Property",
    sector: "Property & fintech",
    outcome: "Unified brand site + client portal + staff tools",
    metric: "3 products live",
    tag: "Complex",
  },
  {
    slug: "jennyglams",
    name: "JennyGlams",
    sector: "Beauty · Jos",
    outcome: "Portfolio + WhatsApp booking — DM chaos → one-tap enquire",
    metric: "Before → after in ~7 days",
    tag: "Local SME",
  },
  {
    slug: "legacyplay",
    name: "LegacyPlay",
    sector: "Gaming lounge",
    outcome: "Bold site built for station booking & tournaments",
    metric: "Clear reserve CTA",
    tag: "Local SME",
  },
  {
    slug: "doyinmart",
    name: "DoyinMart",
    sector: "Marketplace",
    outcome: "African software marketplace with local pricing",
    metric: "Multi-vendor ready",
    tag: "Platform",
  },
  {
    slug: "ipvl",
    name: "IPVL Lobby Dashboard",
    sector: "Ops dashboard",
    outcome: "Real-time lobby & staff access for property ops",
    metric: "Internal system",
    tag: "SaaS",
  },
  {
    slug: "arqademy-cbt",
    name: "Arqademy CBT",
    sector: "Education",
    outcome: "Computer-based testing experience for learners",
    metric: "Exam-ready UX",
    tag: "EdTech",
  },
];

export default function CaseStudiesIndex() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[980px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Proof · not promises
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">
            Case studies
          </h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[#a1a1a6]">
            Real projects shipped for Nigerian businesses — from single-offer landing pages to multi-portal platforms.
            Fixed scope, clear handoff, WhatsApp-ready delivery.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {studies.map((s) => (
              <Link
                key={s.slug}
                href={`/case-studies/${s.slug}`}
                className="group rounded-2xl border border-white/10 bg-[#1d1d1f] p-6 transition hover:border-[#ff8c14]/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#86868b]">
                      {s.sector}
                    </p>
                    <h2 className="mt-1 text-[20px] font-semibold text-white group-hover:text-[#ff8c14]">
                      {s.name}
                    </h2>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-[#a1a1a6]">
                    {s.tag}
                  </span>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-[#a1a1a6]">{s.outcome}</p>
                <p className="mt-4 text-[13px] font-semibold text-[#2997ff]">{s.metric} →</p>
              </Link>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a2030] to-[#0c1018] p-8 text-center">
            <h2 className="text-[22px] font-semibold text-white">
              Want results like these?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-[15px] text-[#a1a1a6]">
              Landing page from ₦100,000 or a full local business site from ₦250,000 — 50% deposit, fixed price.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/hire"
                className="inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
              >
                See fixed-price packages
              </a>
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-white/20 px-6 py-3 text-[14px] font-semibold text-white"
              >
                Book free 15-min call
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
