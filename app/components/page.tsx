import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { ComponentCard } from "@/components/shop/ComponentShop";
import { UI_COMPONENTS } from "@/lib/ui-components";

export const metadata: Metadata = {
  title: "Next.js Components — Buy & download",
  description:
    "Production-ready Next.js + Tailwind components: navbar, pricing, WhatsApp CTA, contact blocks. Pay once, download source.",
};

export default function ComponentsShopPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Code marketplace
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">
            Next.js components
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Drop-in UI packs for App Router + Tailwind. Preview code free. Pay once, unlock full
            source on this site.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {UI_COMPONENTS.map((item) => (
              <ComponentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
