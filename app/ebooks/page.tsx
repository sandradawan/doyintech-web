import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { EbookCard } from "@/components/ebooks/EbookShop";
import { ALL_EBOOKS } from "@/lib/ebooks-catalog";

export const metadata: Metadata = {
  title: "Ebooks — Digital marketing, affiliate, SMM, VA & more",
  description:
    "Buy DoyinTech ebooks: digital marketing, affiliate marketing, social media management, virtual assistant, WhatsApp, and founder guides.",
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
            Ebooks that get used
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Practical guides for SMEs and freelancers — digital marketing, affiliate marketing,
            social media management, virtual assistant work, and more. Preview a chapter free.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ALL_EBOOKS.map((book) => (
              <EbookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
