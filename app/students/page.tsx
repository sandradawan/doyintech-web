import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { formatUsdFromNgn, CURRENCY_NOTE } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Student research tools & AI Project Studio",
  description:
    "All student tools in one place: AI Project Studio, questionnaire analyzer, citations, cover letter, CV builder, and managed research projects with USD pricing.",
};

type Tool = {
  href: string;
  eyebrow: string;
  eyebrowClass: string;
  borderHover: string;
  title: string;
  body: string;
};

const writeTools: Tool[] = [
  {
    href: "/students/studio",
    eyebrow: "New · Free",
    eyebrowClass: "text-[#ff8c14]",
    borderHover: "hover:border-[#ff8c14]/40",
    title: "AI Project Studio",
    body: "Research outlines, chapter scaffolds (1–5), abstracts, interactive demo, and free academic templates.",
  },
  {
    href: "/students/citations",
    eyebrow: "Free",
    eyebrowClass: "text-[#2997ff]",
    borderHover: "hover:border-[#2997ff]/40",
    title: "Citation formatter",
    body: "Format book, journal, website, and thesis references in APA, MLA, Chicago, or Harvard.",
  },
];

const dataTools: Tool[] = [
  {
    href: "/students/analyzer",
    eyebrow: "Free",
    eyebrowClass: "text-[#ff8c14]",
    borderHover: "hover:border-[#ff8c14]/40",
    title: "Questionnaire analyzer",
    body: "Upload CSV responses — descriptive tables plus an AI-style results narrative for Chapter 4.",
  },
];

const careerTools: Tool[] = [
  {
    href: "/students/cover-letter",
    eyebrow: "Free",
    eyebrowClass: "text-[#2997ff]",
    borderHover: "hover:border-[#2997ff]/40",
    title: "AI cover letter",
    body: "Job-ready drafts for internships and graduate roles. Choose professional, confident, or warm tone.",
  },
  {
    href: "/tools/cv-builder",
    eyebrow: "Free tool",
    eyebrowClass: "text-[#a1a1a6]",
    borderHover: "hover:border-white/30",
    title: "CV & portfolio builder",
    body: "Live preview templates for students and job seekers. Print-ready download.",
  },
];

const managedTools: Tool[] = [
  {
    href: "/students/projects",
    eyebrow: `${formatUsdFromNgn(15_000)} – ${formatUsdFromNgn(30_000)}`,
    eyebrowClass: "text-[#25D366]",
    borderHover: "hover:border-[#25D366]/40",
    title: "Research project portal",
    body: "Submit your topic, pay 50% to start, track stages with a Request ID, pay balance to unlock delivery.",
  },
  {
    href: "/students/projects/track",
    eyebrow: "Track",
    eyebrowClass: "text-[#a1a1a6]",
    borderHover: "hover:border-white/30",
    title: "Track your project",
    body: "Enter your Request ID (and email if needed) to see stage, feedback, and payment status.",
  },
];

function ToolGrid({ items }: { items: Tool[] }) {
  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2">
      {items.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition ${t.borderHover}`}
        >
          <p className={`text-[12px] font-semibold uppercase tracking-wider ${t.eyebrowClass}`}>
            {t.eyebrow}
          </p>
          <h3 className="mt-2 font-display text-[20px] font-semibold text-white">{t.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">{t.body}</p>
        </Link>
      ))}
    </div>
  );
}

export default function StudentsHubPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1020px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/" className="text-[#2997ff] hover:underline">
              Home
            </Link>{" "}
            / Students
          </p>
          <p className="section-eyebrow mt-4">Students · Worldwide</p>
          <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[42px]">
            All student tools in one place
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Free writing and data tools for research projects, plus managed full-project
            support ({formatUsdFromNgn(15_000)}–{formatUsdFromNgn(30_000)}) with Request ID
            tracking. Prices shown in USD.
          </p>

          {/* Path strip */}
          <div className="mt-10 overflow-hidden rounded-3xl border border-[#ff8c14]/25 bg-gradient-to-br from-[#ff8c14]/10 via-transparent to-white/[0.03] p-6 sm:p-8">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[#ff8c14]">
              Recommended path
            </p>
            <h2 className="mt-2 font-display text-[22px] font-semibold text-white">
              Topic → outline → data → chapters → delivery
            </h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-5">
              {[
                { n: "1", t: "Topic", href: "/students/studio" },
                { n: "2", t: "AI outline", href: "/students/studio" },
                { n: "3", t: "CSV analysis", href: "/students/analyzer" },
                { n: "4", t: "Chapter draft", href: "/students/studio" },
                { n: "5", t: "Portal track", href: "/students/projects" },
              ].map((step) => (
                <li key={step.n}>
                  <Link
                    href={step.href}
                    className="block rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-center transition hover:border-[#ff8c14]/40"
                  >
                    <span className="text-[11px] text-[#6b7280]">{step.n}</span>
                    <p className="mt-1 text-[13px] font-semibold text-white">{step.t}</p>
                  </Link>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/students/studio"
                className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black"
              >
                Start in AI Project Studio
              </Link>
              <Link
                href="/students/projects"
                className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white"
              >
                Hire full project support
              </Link>
              <Link href="/" className="rounded-full border border-white/10 px-5 py-2.5 text-[13px] font-semibold text-[#a1a1a6] hover:text-white">
                ← Back to home
              </Link>
            </div>
          </div>

          {/* Organized sections */}
          <section className="mt-14">
            <h2 className="font-display text-[18px] font-semibold text-white">Write & research</h2>
            <p className="mt-1 text-[13px] text-[#a1a1a6]">Outlines, chapters, abstracts, references</p>
            <ToolGrid items={writeTools} />
          </section>

          <section className="mt-12">
            <h2 className="font-display text-[18px] font-semibold text-white">Data & analysis</h2>
            <p className="mt-1 text-[13px] text-[#a1a1a6]">Questionnaire results for Chapter 4</p>
            <ToolGrid items={dataTools} />
          </section>

          <section className="mt-12">
            <h2 className="font-display text-[18px] font-semibold text-white">Career</h2>
            <p className="mt-1 text-[13px] text-[#a1a1a6]">Applications after graduation or NYSC</p>
            <ToolGrid items={careerTools} />
          </section>

          <section className="mt-12">
            <h2 className="font-display text-[18px] font-semibold text-white">Managed research support</h2>
            <p className="mt-1 text-[13px] text-[#a1a1a6]">
              Human-assisted projects with stage tracking and 50% deposit
            </p>
            <ToolGrid items={managedTools} />
          </section>

          <p className="mt-10 max-w-xl text-[12px] leading-relaxed text-[#6b7280]">
            {CURRENCY_NOTE}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
