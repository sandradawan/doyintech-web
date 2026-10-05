import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Student tools",
  description: "Questionnaire analyzer and research project portal for students.",
};

export default function StudentsHubPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1020px] px-5 sm:px-6">
          <p className="section-eyebrow">Students</p>
          <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[42px]">
            Student research tools
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Analyze questionnaire CSV data for free, or start a research project
            (NGN 15,000 to 30,000) with Request ID tracking.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Link
              href="/students/analyzer"
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#ff8c14]/40"
            >
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#ff8c14]">Free</p>
              <h2 className="mt-2 font-display text-[22px] font-semibold text-white">Questionnaire analyzer</h2>
              <p className="mt-3 text-[14px] text-[#a1a1a6]">Upload CSV responses and get tables plus a results draft.</p>
            </Link>
            <Link
              href="/students/projects"
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#25D366]/40"
            >
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#25D366]">NGN 15k to 30k</p>
              <h2 className="mt-2 font-display text-[22px] font-semibold text-white">Research project portal</h2>
              <p className="mt-3 text-[14px] text-[#a1a1a6]">Submit your topic, pay, track stages with a Request ID.</p>
            </Link>
          </div>
          <p className="mt-8 text-[13px] text-[#a1a1a6]">
            Have a Request ID?{" "}
            <Link href="/students/projects/track" className="text-[#2997ff] hover:underline">
              Track your project
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
