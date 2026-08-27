import Footer from "@/components/ui/Footer";
import Link from "next/link";
import ShareBar from "@/components/blog/ShareBar";

export const metadata = {
  title: "Practical AI Automation for SMEs (Not Hype)",
  description:
    "Simple AI workflows can remove repetitive work from sales, support and operations today — without a research lab.",
};

export default function Post() {
  return (
    <>
      <main className="pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-sm text-primary hover:underline">
            ← Back to Blog
          </Link>
          <p className="mt-8 text-sm text-primary font-medium">
            AI Automation · August 2026 · 4 min read
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            Practical AI Automation for SMEs (Not Hype)
          </h1>
          <div className="mt-10 space-y-6 text-gray-300 leading-relaxed">
            <p>
              You don’t need a research lab. Simple AI workflows can remove
              repetitive work from sales, support and operations today — if you
              pick the right processes.
            </p>
            <p>
              Start with high-volume, low-judgment tasks: first-response drafts,
              lead triage, report summaries, and document classification. Measure
              time saved before expanding scope.
            </p>
            <p>
              DoyinTech helps SMEs map opportunities, integrate tools they already
              use, and ship automations that staff can trust.
            </p>
            <div className="pt-6">
              <a
                href="/services/ai-automation"
                className="inline-flex px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Explore AI automation
              </a>
            </div>

            <ShareBar
              title="Practical AI Automation for SMEs (Not Hype)"
              path="/blog/practical-ai-automation-for-smes"
            />

            <div className="border-t border-white/10 pt-8">
              <p className="text-sm font-semibold text-white mb-3">Related</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog/why-production-grade-backends-matter"
                    className="text-primary hover:underline"
                  >
                    Why Production-Grade Backends Matter
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-primary hover:underline">
                    Talk to us about automation
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
