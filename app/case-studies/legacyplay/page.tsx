import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Case Study — LegacyPlay Gaming Lounge",
  description:
    "Website and booking experience for LegacyPlay — a premium PlayStation gaming lounge.",
};

export default function LegacyPlayCaseStudy() {
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
            LegacyPlay — PlayStation Gaming Lounge
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            A high-converting website for station booking, tournaments and brand presence.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Next.js", "Booking UX", "WhatsApp Integration", "Local Business"].map(
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
                LegacyPlay needed a professional online presence that made it easy for customers to discover the lounge, understand pricing, see tournaments and reserve stations — especially via WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">The Solution</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Bold dark UI that matches the gaming brand</li>
                <li>Clear CTAs for reservation and WhatsApp contact</li>
                <li>Tournament and location information structured for conversion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Results</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Strong first impression for walk-ins and online visitors</li>
                <li>Simplified path from interest to booking</li>
                <li>Brand that feels premium and professional</li>
              </ul>
            </section>

            <div className="pt-6 flex flex-wrap gap-4">
              <a
                href="https://legacyplay.vercel.app"
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
