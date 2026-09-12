import Link from "next/link";
import { TOOLS_META } from "@/lib/tools/config";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function ToolsSection() {
  const featured = TOOLS_META.filter((t) => t.category === "core").slice(0, 4);

  return (
    <section className="apple-section apple-section-black">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="apple-headline">Free tools.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-2xl">
              Estimate cost, audit readiness, build a CV, and more — then talk to us when
              you are ready to build.
            </p>
            <Link href="/tools" className="apple-link mt-4 inline-block text-[17px]">
              View all {TOOLS_META.length} tools ›
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {featured.map((t, i) => (
            <ScrollReveal key={t.slug} delay={0.05 * i}>
              <Link href={t.href} className="apple-card flex h-full flex-col p-8">
                <h3 className="text-[21px] font-semibold tracking-tight text-[#f5f5f7]">
                  {t.title}
                </h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#a1a1a6]">
                  {t.short}
                </p>
                <span className="apple-link mt-5 text-[14px]">Use tool ›</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
