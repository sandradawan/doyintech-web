import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import BillsWorkspace from "@/components/bills/BillsWorkspace";

export const metadata: Metadata = {
  title: "Top up airtime & data | DoyinTech Wallet",
  description: "Fund your wallet and buy MTN, Airtel, Glo, 9mobile airtime and data.",
};

export default function BillsPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-28 pt-20">
        <div className="mx-auto max-w-[420px] px-5">
          <h1 className="text-center text-[26px] font-semibold tracking-tight text-white">
            Top up from wallet
          </h1>
          <p className="mt-1 text-center text-[14px] text-[#86868b]">
            Sign in · fund once · buy in seconds
          </p>
          <div className="mt-6">
            <BillsWorkspace />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
