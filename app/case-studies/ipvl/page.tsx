import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Case Study — IPVL Lobby Dashboard",
  description:
    "Operations lobby dashboard for ImperialVilla (IPVL) — real-time overview and staff access for property & pension facilitation.",
};

export default function IpvlCaseStudy() {
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
            IPVL Lobby — Operations Dashboard
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            A focused lobby and operations dashboard for ImperialVilla staff and branch workflows.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Dashboard", "Operations", "Real-time", "Internal Tool"].map((t) => (
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
                Branch and lobby staff needed a simple entry point into ImperialVilla operations — not another overloaded admin panel, but a clear dashboard for daily access and visibility.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">The Solution</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Lightweight lobby dashboard as the staff access layer</li>
                <li>Aligned with the wider ImperialVilla portal and management system</li>
                <li>Designed for speed on typical office and lobby devices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Results</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Clearer operational entry point for staff</li>
                <li>Consistent experience across the ImperialVilla product suite</li>
                <li>Reduced friction for day-to-day branch activity</li>
              </ul>
            </section>

            <div className="pt-6 flex flex-wrap gap-4">
              <a
                href="https://ipvl.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Visit Live Site
              </a>
              <Link
                href="/case-studies/imperial-villa"
                className="px-6 py-3 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition"
              >
                Related: Imperial Villa Suite
              </Link>
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
