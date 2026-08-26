import Image from "next/image";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Case Study — Imperial Villa Property Platform",
  description:
    "How DoyinTech built the corporate website, client portal and internal management system for Imperial Villa Property Development.",
};

export default function ImperialVillaCaseStudy() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/portfolio"
            className="text-sm text-primary hover:underline"
          >
            ← Back to Portfolio
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-primary">
            Case Study
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            Imperial Villa Property Platform
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Corporate website + Client Portal + Staff Management System for a
            premium property & pension facilitation company.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Next.js", "Laravel / PHP", "MySQL", "Auth", "Dashboards"].map(
              (t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300"
                >
                  {t}
                </span>
              )
            )}
          </div>

          <div className="mt-12 space-y-10 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">The Challenge</h2>
              <p>
                Imperial Villa needed a professional digital presence and internal tools to manage clients, RSA accounts, equity mortgage products and multi-branch operations. Existing processes were fragmented and not built for scale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">The Solution</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Modern marketing website showcasing estates, 25% Equity Mortgage offering and lead generation.
                </li>
                <li>
                  Secure client portal for account access and communication.
                </li>
                <li>
                  Internal staff system for client management, fund tracking and branch operations.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Results</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Unified digital presence for the brand</li>
                <li>Streamlined client onboarding and staff workflows</li>
                <li>Scalable foundation for future product features</li>
              </ul>
            </section>

            <div className="pt-6 flex flex-wrap gap-4">
              <a
                href="https://www.imperialvillapropertydevelopment.com"
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
