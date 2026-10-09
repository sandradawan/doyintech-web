import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { formatUsdFromNgn, CURRENCY_NOTE } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Student research tools & AI Project Studio",
  description:
    "AI Project Studio, questionnaire analyzer, citation formatter, cover letter AI, and managed research project portal. USD pricing, secure checkout, live tracking.",
};

const tools = [
  {
    href: "/students/studio",
    eyebrow: "New · Free",
    eyebrowClass: "text-[#ff8c14]",
    borderHover: "hover:border-[#ff8c14]/40",
    title: "AI Project Studio",
    body: "Outlines, chapter scaffolds, abstracts, interactive demo, and research templates.",
  },
  {
    href: "/students/analyzer",
    eyebrow: "Free",
    eyebrowClass: "text-[#ff8c14]",
    borderHover: "hover:border-[#ff8c14]/40",
    title: "Questionnaire analyzer",
    body: "Upload CSV responses — get tables plus an AI results narrative for Chapter 4.",
  },
  {
    href: "/students/citations",
    eyebrow: "Free",
    eyebrowClass: "text-[#2997ff]",
    borderHover: "hover:border-[#2997ff]/40",
    title: "Citation formatter",
    body: "APA, MLA, Chicago, and Harvard references in one click.",
  },
  {
    href: "/students/cover-letter",
    eyebrow: "Free",
    eyebrowClass: "text-[#2997ff]",
    borderHover: "hover:border-[#2997ff]/40",
    title: "AI cover letter",
    body: "Job-ready drafts for internships and graduate roles. Pair with the CV builder.",
  },
  {
    href: "/students/projects",
    eyebrow: "Managed",
    eyebrowClass: "text-[#25D366]",
    borderHover: "hover:border-[#25D366]/40",
    title: "Research project portal",
    body: "Submit your topic, pay 50% to start, track stages with a Request ID, unlock on full payment.",
  },
  {
    href: "/tools/cv-builder",
    eyebrow: "Free tool",
    eyebrowClass: "text-[#a1a1a6]",
    borderHover: "hover:border-white/30",
    title: "CV & portfolio builder",
    body: "Live preview templates for students and job seekers.",
  },
];

export default function StudentsHubPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1020px] px-5 sm:px-6">
          <p className="section-eyebrow">Students · Worldwide</p>
          <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[42px]">
            Student research tools
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Free AI studio for outlines and chapters, questionnaire analysis with
            narrative drafts, citations, and cover letters — plus managed research
            projects ({formatUsdFromNgn(15_000)} to {formatUsdFromNgn(30_000)}) with
            Request ID tracking.
          </p>

          <div className="mt-10 overflow-hidden rounded-3xl border border-[#ff8c14]/25 bg-gradient-to-br from-[#ff8c14]/10 via-transparent to-white/[0.03] p-6 sm:p-8">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[#ff8c14]">
              Interactive path
            </p>
            <h2 className="mt-2 font-display text-[22px] font-semibold text-white">
              From topic → outline → data → delivery
            </h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-5">
              {["Topic", "AI outline", "CSV analysis", "Chapter draft", "Portal track"].map(
                (step, i) => (
                  <li
                    key={step}
                    className="rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-center"
                  >
                    <span className="text-[11px] text-[#6b7280]">{i + 1}</span>
                    <p className="mt-1 text-[13px] font-semibold text-white">{step}</p>
                  </li>
                )
              )}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/students/studio"
                className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black"
              >
                Open AI Project Studio
              </Link>
              <Link
                href="/students/projects"
                className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white"
              >
                Full project portal
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition ${t.borderHover}`}
              >
                <p className={`text-[12px] font-semibold uppercase tracking-wider ${t.eyebrowClass}`}>
                  {t.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-[22px] font-semibold text-white">{t.title}</h2>
                <p className="mt-3 text-[14px] text-[#a1a1a6]">{t.body}</p>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-[13px] text-[#a1a1a6]">
            Have a Request ID?{" "}
            <Link href="/students/projects/track" className="text-[#2997ff] hover:underline">
              Track your project
            </Link>
          </p>
          <p className="mt-6 max-w-xl text-[12px] leading-relaxed text-[#6b7280]">{CURRENCY_NOTE}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
