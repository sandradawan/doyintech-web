import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { TOOLS_META, TOOLS_CONFIG } from "@/lib/tools/config";

export const metadata: Metadata = {
  title: "Free Business & Career Tools",
  description:
    "Free tools from DoyinTech: website cost calculator Nigeria, business digital audit, CV builder, and digital readiness assessment.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "DoyinTech Tools — Free Business & Career Tools",
    description:
      "Calculate website budget, audit your business, build a CV, and measure digital readiness.",
    url: `${TOOLS_CONFIG.siteUrl}/tools`,
  },
};

const icons: Record<string, string> = {
  calculator: "₦",
  audit: "◎",
  cv: "▤",
  readiness: "◈",
};

export default function ToolsHubPage() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            DoyinTech Tools
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Free Tools to Grow Your Business & Career
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-400">
            Calculate your website budget, audit your business, measure your digital
            readiness, and create a professional CV or portfolio — all in one place.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {TOOLS_META.map((t) => (
              <Link
                key={t.slug}
                href={t.href}
                className="group rounded-3xl border border-white/10 bg-surface/80 p-6 transition hover:border-primary/40 hover:bg-surface"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-xl text-primary">
                  {icons[t.icon] || "•"}
                </div>
                <h2 className="mt-4 font-display text-xl font-bold text-white group-hover:text-primary">
                  {t.title}
                </h2>
                <p className="mt-2 text-sm text-gray-400">{t.short}</p>
                <span className="mt-5 inline-flex text-xs font-bold uppercase tracking-wider text-primary">
                  Use tool →
                </span>
              </Link>
            ))}
          </div>

          <section className="mt-16 rounded-3xl border border-white/10 bg-black/30 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-white">
              Built for Nigerian businesses & professionals
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
              These free tools help SMEs, freelancers, students, and founders make
              clearer technology decisions. When you are ready to implement — websites,
              mobile apps, AI automation, or digital transformation — DoyinTech can help
              you ship production systems. Also explore{" "}
              <a
                href={TOOLS_CONFIG.academyUrl}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                DoyinTech Academy
              </a>{" "}
              for learning pathways.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
