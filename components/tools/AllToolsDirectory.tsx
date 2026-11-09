import Link from "next/link";
import { TOOLS_META, type ToolMeta } from "@/lib/tools/config";

const GROUPS: { category: ToolMeta["category"]; heading: string }[] = [
  { category: "core", heading: "Popular tools" },
  { category: "business", heading: "Business tools" },
  { category: "career", heading: "CV, career and student tools" },
  { category: "ai", heading: "AI tools" },
  { category: "paid", heading: "Premium tools" },
  { category: "utility", heading: "Everyday utilities" },
  { category: "security", heading: "Website security tools" },
  { category: "markets", heading: "Trading education tools" },
];

/** Plain links to every tool, in the page's HTML, so visitors and Google can reach all of them. */
export default function AllToolsDirectory() {
  return (
    <section aria-labelledby="all-tools-heading" className="mt-16">
      <h2 id="all-tools-heading" className="font-display text-2xl font-bold text-white">All {TOOLS_META.length} tools</h2>
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {GROUPS.map(({ category, heading }) => {
          const tools = TOOLS_META.filter((t) => t.category === category);
          if (!tools.length) return null;
          return (
            <div key={category}>
              <h3 className="text-[17px] font-semibold text-white">{heading}</h3>
              <ul className="mt-2 grid gap-x-4 sm:grid-cols-2">
                {tools.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className="inline-flex min-h-10 items-center text-[14px] text-brand-soft hover:text-white hover:underline">{t.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
