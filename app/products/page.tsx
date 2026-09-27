import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import ProductsCatalog from "@/components/products/ProductsCatalog";

export const metadata: Metadata = {
  title: "Digital Products — SME Kits & Templates | DoyinTech",
  description:
    "Buy instant-download kits: System Protector, WhatsApp Follow-up Agent, Sheets bundles. Paystack checkout for Nigerian SMEs.",
};

export default function ProductsPage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-16 pt-24">
        <div className="mx-auto max-w-[720px] px-6 pb-10 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Instant download · Paystack
          </p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[42px]">
            Pay. Download. Use today.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">
            Start with the kits that save money and close deals:{" "}
            <strong className="font-medium text-white">System Protector</strong> and{" "}
            <strong className="font-medium text-white">WhatsApp Follow-up Agent</strong>.
            Then grab Sheets packs if you need them.
          </p>
        </div>
        <ProductsCatalog />
      </main>
      <Footer />
    </>
  );
}
