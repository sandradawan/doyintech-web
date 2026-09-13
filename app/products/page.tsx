import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import PassiveProducts from "@/components/sections/PassiveProducts";
import LeadMagnet from "@/components/sections/LeadMagnet";
import BookCall from "@/components/sections/BookCall";

export const metadata: Metadata = {
  title: "Products & Recurring Plans",
  description:
    "Digital products, WhatsApp automation waitlist, SME CRM waitlist, and monthly care plans from DoyinTech.",
};

export default function ProductsPage() {
  return (
    <>
      <main className="bg-black pt-20">
        <div className="mx-auto max-w-[980px] px-6 pb-4 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
            Products
          </p>
          <h1 className="apple-headline mt-3 text-[#f5f5f7]">Sell once. Bill monthly.</h1>
          <p className="apple-subhead mx-auto mt-4 max-w-2xl">
            Templates and checklists for one-time sales. Waitlists for SaaS. Care plans for
            recurring income.
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
