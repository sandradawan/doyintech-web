import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Student tools — Analyzer & research projects",
  description:
    "Questionnaire data analyzer and research project portal for students. Track projects with a Request ID. ₦15k–₦30k packages.",
};

export default function StudentsHubPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1020px] px-5 sm:px-6">
          <p className="section-eyebrow">Students</p>
          <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[42px]">
            Tools for your research — not another SME dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6] sm:text-[17px]">
            Upload questionnaire responses for a real descriptive analysis draft,
            or start a supervised research project with payment, Request ID
            tracking, and a feedback box for corrections.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <Link
              href="/students/analyzer"
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#ff8c14]/40 hover:bg-white/[0.05]"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
                Free analyzer
              </p>
              <h2 className="mt-2 font-display text-[22px] font-semibold text-white">
                Questionnaire analyzer
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#a1a1a6]">
                Upload CSV responses. Get frequencies, means, tables, and a
                results-chapter style narrative you can edit for your supervisor.
              </p>
              <span className="mt-6 inline-flex text-[14px] font-semibold text-[#2997ff] group-hover:underline">
                Open analyzer →
              </span>
            </Link>

            <Link
              href="/students/projects"
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#25D366]/40 hover:bg-white/[0.05]"
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#25D366]">
                ₦15k – ₦30k
              </p>
              <h2 className="mt-2 font-display text-[22px] font-semibold text-white">
                Research project portal
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-[#a1a1a6]">
                Submit your topic, pay, get a Request ID, track writing stages,
                and send correction feedback in one place.
              </p>
              <span className="mt-6 inline-flex text-[14px] font-semibold text-[#2997ff] group-hover:underline">
                Start a project →
              </span>
            </Link>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-[13px] text-[#a1a1a6]">
            Already have a Request ID?{" "}
            <Link
              href="/students/projects/track"
              className="font-semibold text-[#2997ff] hover:underline"
            >
              Track your project
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
