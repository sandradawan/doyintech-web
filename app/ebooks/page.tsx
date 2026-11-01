import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import EbookCatalog from "@/components/ebooks/EbookCatalog";
import { ALL_EBOOKS } from "@/lib/ebooks-catalog";
import { publicEbook } from "@/lib/shop/public";

export const metadata: Metadata = {
  title: "Ebooks for Nigerian Business Owners, Workers & Students (PDF)",
  description:
    "Practical ebooks: start and register a business in Nigeria, Excel for office work, bookkeeping, grants and funding, remote jobs, final year projects, marketing and personal finance. Read chapter one free; instant PDF after payment.",
  alternates: { canonical: "/ebooks" },
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
            Practical books for running a business, getting ahead at work and finishing school: registration and tax, Excel, bookkeeping, funding, remote jobs, final year projects, marketing and money. Read the first chapter free, then get the full PDF and on-site reader after payment.
          </p>

          <EbookCatalog books={ALL_EBOOKS.map(publicEbook)} />
        </div>
      </main>
      <Footer />
    </>
  );
}
