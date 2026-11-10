"use client";

import Link from "next/link";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { CASE_STUDIES } from "@/lib/case-studies-data";

export default function CaseStudiesTeaser() {
  const featured = CASE_STUDIES.slice(0, 3);

  return (
    <section className="apple-section apple-section-black border-t border-brand-ink/[0.06]">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Proof</p>
              <h2 className="section-title mt-2">Real projects. Clear outcomes.</h2>
              <p className="section-lead mt-3">
                Not stock screenshots — work shipped for Nigerian businesses.
              </p>
            </div>
            <Link
              href="/case-studies"
              className="apple-link shrink-0 text-[15px] font-medium"
            >
              All case studies →
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {featured.map((c, i) => (
            <ScrollReveal key={c.slug} direction="up" delay={i * 0.06}>
              <Link
                href={c.href}
                className="glass-card group flex h-full flex-col p-6 transition"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-link">
                  {c.tag} · {c.sector}
                </span>
                <h3 className="mt-2 text-[18px] font-semibold text-brand-ink group-hover:text-brand-link">
                  {c.name}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-brand-muted">
                  {c.outcome}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {c.results.slice(0, 2).map((r) => (
                    <div
                      key={r.label}
                      className="rounded-xl border border-brand-ink/[0.08] bg-brand-well px-3 py-2"
                    >
                      <p className="text-[13px] font-semibold text-brand-ink">{r.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-brand-subtle">
                        {r.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
