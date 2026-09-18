import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import PassiveProducts from "@/components/sections/PassiveProducts";
import LeadMagnet from "@/components/sections/LeadMagnet";
import BookCall from "@/components/sections/BookCall";

export const metadata: Metadata = {
  title: "Digital Products — Google Sheets Templates & Packs",
  description:
    "Buy Etsy-style Google Sheets templates from DoyinTech: budget dashboard, client CRM, content calendar, habit tracker, bookkeeping, project tracker — plus freelancer packs. Pay with Paystack.",
};

export default function ProductsPage() {
  return (
    <>
      <main className="bg-black pt-20">
        <div className="mx-auto max-w-[980px] px-6 pb-4 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
            Instant digital products
          </p>
          <h1 className="apple-headline mt-3 text-[#f5f5f7]">Pay. Download. Use today.</h1>
          <p className="apple-subhead mx-auto mt-4 max-w-2xl">
            Etsy-style <strong className="font-medium text-[#f5f5f7]">Google Sheets templates</strong>{" "}
            (budget, CRM, content calendar, habits, bookkeeping, projects) plus freelancer packs.
            Secure Paystack checkout — download right after payment.
          </p>
        </div>
        <PassiveProducts />
        <LeadMagnet />
        <BookCall />
      </main>
      <Footer />
    </>
  );
}
