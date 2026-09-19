import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import EbookCatalog from "@/components/ebooks/EbookCatalog";
import { ALL_EBOOKS } from "@/lib/ebooks-catalog";

export const metadata: Metadata = {
  title: "Ebooks — Finance, education, fitness, business & more | DoyinTech",
  description:
    "Full practical ebooks from DoyinTech Press: personal finance, education, fitness, food, culture, marketing, freelancing, and founder systems. Instant PDF after payment.",
};

export default function EbooksPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            DoyinTech Press
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">
            Full ebooks for work and life
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Practical books across finance, education, fitness, food, culture, marketing, and
            business. Buy once — get a professional PDF and on-site reader after payment.
          </p>

          <EbookCatalog books={ALL_EBOOKS} />
        </div>
      </main>
      <Footer />
    </>
  );
}
