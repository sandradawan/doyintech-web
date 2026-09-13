"use client";

import ScrollReveal from "../animations/ScrollReveal";
import {
  PACKAGES,
  MAINTENANCE,
  packageWhatsAppLink,
  discoveryCallLink,
} from "@/lib/packages";

export default function Packages() {
  return (
    <section id="pricing" className="apple-section apple-section-black">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
              Clear offers
            </p>
            <h2 className="apple-headline mt-2">Packages & pricing.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-2xl">
              Fixed starting prices. Final quote after a free discovery call — no
              surprises.
            </p>
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="apple-link mt-4 inline-block text-[17px]">
              Book a free discovery call ›
            </a>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PACKAGES.map((pkg, i) => (
            <ScrollReveal key={pkg.id} direction="up" delay={i * 0.05}>
              <article
                className={`apple-card relative flex h-full flex-col p-6 ${
                  pkg.featured ? "ring-1 ring-[#2997ff]/50" : ""
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[#0071e3] px-3 py-1 text-[11px] font-semibold text-white">
                    {pkg.badge}
                  </span>
                )}
                <h3 className="text-[20px] font-semibold tracking-tight text-[#f5f5f7]">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-[13px] text-[#a1a1a6]">{pkg.tagline}</p>

                <div className="mt-5">
                  <p className="text-[26px] font-semibold tracking-tight text-[#f5f5f7]">
                    {pkg.priceUsd}
                  </p>
                  <p className="text-[13px] text-[#a1a1a6]">{pkg.priceNgn}</p>
                  <p className="mt-1 text-[12px] text-[#2997ff]">{pkg.timeline}</p>
                </div>

                <p className="mt-4 text-[12px] text-[#a1a1a6]">
                  Ideal for: {pkg.idealFor}
                </p>

                <ul className="mt-4 flex-1 space-y-2">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-2 text-[13px] leading-snug text-[#f5f5f7]/90"
                    >
                      <span className="mt-0.5 text-[#2997ff]">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={packageWhatsAppLink(pkg.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full py-3 text-[14px] font-medium transition ${
                    pkg.featured
                      ? "bg-[#0071e3] text-white hover:bg-[#0077ed]"
                      : "border border-white/20 text-[#f5f5f7] hover:bg-white/5"
                  }`}
                >
                  {pkg.ctaLabel}
                </a>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Maintenance strip */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-[28px] border border-white/10 bg-[#1d1d1f] p-8 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[22px] font-semibold text-[#f5f5f7]">
                {MAINTENANCE.name}
              </h3>
              <p className="mt-1 text-[15px] text-[#a1a1a6]">{MAINTENANCE.tagline}</p>
              <p className="mt-3 text-[18px] font-semibold text-[#f5f5f7]">
                {MAINTENANCE.priceUsd}{" "}
                <span className="text-[14px] font-normal text-[#a1a1a6]">
                  · {MAINTENANCE.priceNgn}
                </span>
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {MAINTENANCE.features.map((f) => (
                  <li key={f} className="text-[13px] text-[#a1a1a6]">
                    ✓ {f}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={packageWhatsAppLink(MAINTENANCE.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-btn apple-btn-primary shrink-0"
            >
              Start care plan
            </a>
          </div>
        </ScrollReveal>

        <p className="mt-6 text-center text-[12px] text-[#a1a1a6]">
          All prices are starting ranges. Complex scope is quoted after discovery.
          Prefer a full page?{" "}
          <a href="/pricing" className="apple-link">
            See pricing details ›
          </a>
        </p>
      </div>
    </section>
  );
}
