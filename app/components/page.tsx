import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { ComponentCard } from "@/components/shop/ComponentShop";
import { UI_COMPONENTS } from "@/lib/ui-components";

export const metadata: Metadata = {
  title: "Next.js Components — Buy & download",
  description:
    "Production-ready Next.js + Tailwind components with live demos and AI prompts. Pay once, download source.",
};

/** Rotate featured component weekly without Intl week options (TS-safe). */
function featuredThisWeek() {
  const singles = UI_COMPONENTS.filter((c) => c.slug !== "agency-ui-kit");
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000) + 1;
  const week = Math.floor(dayOfYear / 7);
  return singles[week % singles.length] || singles[0];
}

export default function ComponentsShopPage() {
  const featured = featuredThisWeek();
  const rest = UI_COMPONENTS.filter((c) => c.id !== featured.id);

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Code marketplace · {UI_COMPONENTS.length} packs
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">
            Next.js components
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Live demos. Copy AI prompts for Cursor and Claude. Pay once for full source. Impulse
            prices from ₦2,000.
          </p>

          {featured && (
            <div className="mt-10 rounded-2xl border border-[#ff8c14]/30 bg-gradient-to-r from-[#ff8c14]/10 to-transparent p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                Featured this week
              </p>
              <div className="mt-4 max-w-md">
                <ComponentCard item={featured} />
              </div>
            </div>
          )}

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item) => (
              <ComponentCard key={item.id} item={item} />
            ))}
          </div>

          <p className="mt-10 text-center text-[14px] text-[#86868b]">
            Agents:{" "}
            <a href="/api/registry" className="text-[#ff8c14] hover:underline">
              /api/registry
            </a>
            {" "}· Templates{" "}
            <a href="/templates" className="text-[#ff8c14] hover:underline">
              here
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
