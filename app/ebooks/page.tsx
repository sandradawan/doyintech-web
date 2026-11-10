import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import EbookCatalog from "@/components/ebooks/EbookCatalog";
import { ALL_EBOOKS } from "@/lib/ebooks-catalog";
import { catalogEbook } from "@/lib/shop/public";

export const metadata: Metadata = {
  title: "Business and Career Ebooks for Nigerians (PDF)",
  description:
    "Practical PDF ebooks on registering a business, Excel, bookkeeping, grants, remote jobs, final year projects and marketing. Read chapter one free.",
  alternates: { canonical: "/ebooks" },
};

export default function EbooksPage() {
  return (
    <>
      <main className="min-h-screen bg-brand-deep pb-24 pt-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-link">
            DoyinTech Press
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-brand-ink sm:text-[44px]">
            Practical ebooks for business, work and school in Nigeria
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-brand-muted">
            Practical books for running a business, getting ahead at work and finishing school: registration and tax, Excel, bookkeeping, funding, remote jobs, final year projects, marketing and money. Read the first chapter free, then get the full PDF and on-site reader after payment.
          </p>

          <EbookCatalog books={ALL_EBOOKS.map(catalogEbook)} />
        </div>
      </main>
      <Footer />
    </>
  );
}
