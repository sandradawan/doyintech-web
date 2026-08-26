import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Case Study — DoyinMart Marketplace",
  description:
    "How DoyinTech built a modern software marketplace tailored for African markets.",
};

export default function DoyinMartCaseStudy() {
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
            DoyinMart — African Software Marketplace
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            A clean, conversion-focused marketplace for digital products, tools and services built for local pricing and discovery.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Next.js", "TypeScript", "Tailwind", "Marketplace", "E-commerce"].map(
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
                African creators and businesses needed a simple place to discover and sell software, learning systems and digital tools with local currency and a modern buying experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">The Solution</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Product catalogue with categories, ratings and pricing in ₦ and $</li>
                <li>Clean storefront UI optimised for mobile and desktop</li>
                <li>Foundation for seller onboarding and future monetisation features</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Results</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Professional marketplace presence for the brand</li>
                <li>Fast, modern shopping experience</li>
                <li>Ready for iterative growth and new product categories</li>
              </ul>
            </section>

            <div className="pt-6 flex flex-wrap gap-4">
              <a
                href="https://doyinsoft.vercel.app"
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
