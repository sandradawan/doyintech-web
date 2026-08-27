import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Case Study — Arqademy CBT Platform",
  description:
    "Computer-based testing platform for practice exams, student assessment and digital learning workflows.",
};

export default function ArqademyCbtCaseStudy() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/portfolio" className="text-sm text-primary hover:underline">
            ← Back to Portfolio
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-primary">
            Case Study
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            Arqademy CBT — Computer-Based Testing
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            A digital exam platform built for practice tests, assessments and scalable learning workflows.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["CBT", "Education", "Exam Platform", "SaaS"].map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-12 space-y-10 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">The Challenge</h2>
              <p>
                Education providers needed a reliable way to run computer-based tests — timed questions, structured scoring, and a student experience that works on everyday devices without heavy install requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">The Solution</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Web-based CBT flows optimised for exam conditions</li>
                <li>Clear student navigation during timed assessments</li>
                <li>Admin-ready structure for question banks and sessions</li>
                <li>Deployed under the Arqademy domain for institutional trust</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Results</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Digitised assessment path for students and organisers</li>
                <li>Faster exam cycles versus paper-only processes</li>
                <li>Foundation for further learning-product features</li>
              </ul>
            </section>

            <div className="pt-6 flex flex-wrap gap-4">
              <a
                href="https://cbt.arqademy.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Visit Live Site
              </a>
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition"
              >
                Start a Similar Project
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
