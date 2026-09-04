import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { TOOLS_META, TOOLS_CONFIG, TOOL_CATEGORIES } from "@/lib/tools/config";

export const metadata: Metadata = {
  title: "Free Business & Career Tools",
  description:
    "Free DoyinTech tools: website cost calculator Nigeria, business audit, CV builder, tech stack advisor, salary calculator, AI use-case finder, and more.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "DoyinTech Tools — Free Business & Career Tools",
    description:
      "Calculate costs, audit your business, build a CV, plan tech stacks, and more — free tools for Nigerian businesses and professionals.",
    url: `${TOOLS_CONFIG.siteUrl}/tools`,
  },
};

const icons: Record<string, string> = {
  calculator: "₦",
  audit: "◎",
  cv: "▤",
  readiness: "◈",
  brief: "☰",
  stack: "⬡",
  hosting: "☁",
  roi: "%",
  invoice: "§",
  wa: "✆",
  maintain: "⚙",
  email: "✉",
  salary: "₦",
  skills: "◆",
  letter: "✎",
  ideas: "✦",
  interview: "?",
  ai: "◉",
  bot: "▣",
  qr: "▦",
  lock: "🔒",
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
            Practical free tools for Nigerian businesses, freelancers, students, and
            founders — from cost estimates to CVs, stack advice, and AI ideas.
          </p>

          {TOOL_CATEGORIES.map((cat) => {
            const tools = TOOLS_META.filter((t) => t.category === cat.id);
            if (tools.length === 0) return null;
            return (
              <section key={cat.id} className="mt-14">
                <h2 className="font-display text-xl font-bold text-white">{cat.label}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tools.map((t) => (
                    <Link
                      key={t.slug}
                      href={t.href}
                      className="group rounded-2xl border border-white/10 bg-surface/80 p-5 transition hover:border-primary/40 hover:bg-surface"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-lg text-primary">
                        {icons[t.icon] || "•"}
                      </div>
                      <h3 className="mt-3 font-display text-lg font-bold text-white group-hover:text-primary">
                        {t.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-400">{t.short}</p>
                      <span className="mt-4 inline-flex text-xs font-bold uppercase tracking-wider text-primary">
                        Use tool →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="mt-16 rounded-3xl border border-white/10 bg-black/30 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-white">
              Built for Nigerian businesses & professionals
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-400">
              Use these tools freely. When you are ready to implement — websites, mobile
              apps, AI automation, or training —{" "}
              <Link href="/contact" className="text-primary hover:underline">
                talk to DoyinTech
              </Link>{" "}
              or explore{" "}
              <a
                href={TOOLS_CONFIG.academyUrl}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                DoyinTech Academy
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
