import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import AiStudioClient from "@/components/ai/AiStudioClient";

export const metadata: Metadata = {
  title: "AI Tools — Education, Finance, SME, Real Estate & Sales",
  description:
    "Free structured AI tools for education, finance, SMEs, real estate, and sales. Optional OpenAI polish when configured. Student research tools included.",
};

const sectors = [
  {
    id: "education",
    title: "Education",
    body: "Lesson plans, study schedules, plus full student research studio.",
    href: "#education",
  },
  {
    id: "finance",
    title: "Finance",
    body: "Payment reminders, cash-flow checklists, pricing worksheets.",
    href: "#finance",
  },
  {
    id: "sme",
    title: "SME / Business",
    body: "Business plan outlines, elevator pitches, SWOT worksheets.",
    href: "#sme",
  },
  {
    id: "real_estate",
    title: "Real estate",
    body: "Listing copy, viewing follow-ups, buyer qualification scripts.",
    href: "#real_estate",
  },
  {
    id: "sales",
    title: "Sales",
    body: "Outreach scripts, proposal outlines, objection handlers.",
    href: "#sales",
  },
];

export default function AiHubPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/" className="text-[#2997ff] hover:underline">
              Home
            </Link>{" "}
            / AI Tools
          </p>
          <p className="section-eyebrow mt-4">AI Tools · Multi-sector</p>
          <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[42px]">
            AI for education, finance, SMEs, real estate & sales
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Structured generators that work immediately. When you add an OpenAI API
            key, optional polish improves tone and clarity — without inventing facts.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {sectors.map((s) => (
              <a
                key={s.id}
                href={s.href}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#ff8c14]/40"
              >
                <p className="text-[14px] font-semibold text-white">{s.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-[#a1a1a6]">{s.body}</p>
              </a>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/students"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              Student research tools →
            </Link>
            <Link
              href="/students/studio"
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black"
            >
              AI Project Studio
            </Link>
          </div>

          <AiStudioClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
