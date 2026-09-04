import Link from "next/link";
import { TOOLS_META } from "@/lib/tools/config";
import ScrollReveal from "@/components/animations/ScrollReveal";

const icons: Record<string, string> = {
  calculator: "₦",
  audit: "◎",
  cv: "▤",
  readiness: "◈",
  brief: "☰",
  stack: "⬡",
  roi: "%",
  ai: "◉",
};

export default function ToolsSection() {
  const featured = TOOLS_META.filter((t) => t.category === "core").slice(0, 4);

  return (
    <section className="py-20 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Free Business & Career Tools
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
                Useful tools. Real value. Zero cost.
              </h2>
              <p className="mt-3 max-w-xl text-gray-400">
                Estimate website cost, audit your digital presence, build a CV, plan
                tech stacks, and more — then talk to us when you are ready to build.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex text-sm font-semibold text-primary hover:underline"
            >
              View all {TOOLS_META.length} tools →
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t, i) => (
            <ScrollReveal key={t.slug} delay={0.05 * i}>
              <Link
                href={t.href}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:border-primary/40 hover:bg-black/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  {icons[t.icon] || "•"}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  {t.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-gray-400">{t.short}</p>
                <span className="mt-4 text-xs font-bold uppercase tracking-wider text-primary">
                  Use tool
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
