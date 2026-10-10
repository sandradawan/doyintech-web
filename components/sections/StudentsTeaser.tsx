"use client";

import Link from "next/link";
import ScrollReveal from "../animations/ScrollReveal";

const highlights = [
  {
    href: "/students/studio",
    label: "AI Project Studio",
    desc: "Outlines, chapters, abstracts",
    tag: "Free",
  },
  {
    href: "/students/analyzer",
    label: "Questionnaire analyzer",
    desc: "CSV → tables + narrative",
    tag: "Free",
  },
  {
    href: "/students/projects",
    label: "Research portal",
    desc: "50% deposit · track by ID",
    tag: "Managed",
  },
  {
    href: "/students/citations",
    label: "Citations & career",
    desc: "APA/MLA + cover letter + CV",
    tag: "Free",
  },
];

export default function StudentsTeaser() {
  return (
    <section id="students" className="border-y border-white/[0.06] bg-[#0a0a0b] py-20 sm:py-24">
      <div className="mx-auto max-w-[1020px] px-5 sm:px-6">
        <ScrollReveal direction="up">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="section-eyebrow">Students · Worldwide</p>
              <h2 className="mt-3 font-display text-[28px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[34px]">
                Research tools built for final-year & postgraduate work
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#a1a1a6] sm:text-[16px]">
                Free AI studio, questionnaire analysis, citations, and cover letters —
                plus managed project support with live Request ID tracking.
              </p>
            </div>
            <Link
              href="/students"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black transition hover:brightness-110"
            >
              Open student tools →
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <ScrollReveal key={h.href} direction="up" delay={i * 0.05}>
              <Link
                href={h.href}
                className="block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#ff8c14]/40 hover:bg-white/[0.05]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff8c14]">
                  {h.tag}
                </span>
                <p className="mt-2 text-[16px] font-semibold text-white">{h.label}</p>
                <p className="mt-1 text-[13px] text-[#a1a1a6]">{h.desc}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] text-[#6b7280]">
          Already have a Request ID?{" "}
          <Link href="/students/projects/track" className="text-[#2997ff] hover:underline">
            Track your project
          </Link>
        </p>
      </div>
    </section>
  );
}
