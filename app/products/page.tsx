import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import PassiveProducts from "@/components/sections/PassiveProducts";
import LeadMagnet from "@/components/sections/LeadMagnet";
import BookCall from "@/components/sections/BookCall";

export const metadata: Metadata = {
  title: "Digital Products — Pay with Paystack",
  description:
    "Buy digital products from DoyinTech: WhatsApp packs, website kits, invoice templates, PDF packs, and more. Pay with Paystack.",
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
            Digital packs for freelancers and SMEs. Secure checkout with Paystack — delivery by
            email or WhatsApp after payment.
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
