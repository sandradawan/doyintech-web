import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import DataAnalysisTool from "@/components/students/DataAnalysisTool";

export const metadata: Metadata = {
  title: "Data Analysis Tool for Final Year Projects (Chapter Four)",
  description:
    "Upload your questionnaire responses and get a complete Chapter Four: frequency tables, mean and standard deviation, Cronbach's alpha, chi-square, correlation, t-test and ANOVA. Download as Word or PDF.",
  alternates: { canonical: "/students/data-analysis" },
};

const FEATURES = [
  "Demographic tables with charts",
  "Mean, standard deviation and decision for every item",
  "Cronbach's alpha reliability",
  "Chi-square, correlation, t-test and ANOVA",
  "Interpretation written under every table",
  "Summary of findings",
];

export default function DataAnalysisPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <p className="text-[13px] text-brand-muted">
            <Link href="/students" className="text-brand-link hover:underline">
              Students
            </Link>{" "}
            / Data analysis
          </p>
          <h1 className="mt-3 font-display text-[30px] font-semibold leading-tight text-brand-ink sm:text-[36px]">Chapter Four data analysis tool</h1>
          <p className="mt-3 max-w-[680px] text-[15px] text-brand-muted">
            Upload your questionnaire responses and get your data presentation, analysis and interpretation as a ready-to-edit Word document or PDF, in the format supervisors expect.
          </p>
          <ul className="mt-5 grid gap-2 text-[14px] text-brand-ink sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-brand-link" fill="currentColor">
                  <path d="M7.6 13.2 4.4 10l-1.1 1.1 4.3 4.3 9.1-9.1-1.1-1.1z" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <DataAnalysisTool />
        </div>
      </main>
      <Footer />
    </>
  );
}
