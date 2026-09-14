import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { EbookCard } from "@/components/ebooks/EbookShop";
import { EBOOKS } from "@/lib/ebooks";

export const metadata: Metadata = {
  title: "Ebooks — Practical guides for business & builders",
  description:
    "Buy DoyinTech ebooks: WhatsApp Business, freelancing clients, cyber basics, founder website launch. Instant access after payment.",
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
            Short, practical guides for SMEs, freelancers, and founders — written to implement the
            same day. Preview chapter free; unlock full book after payment.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {EBOOKS.map((book) => (
              <EbookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
