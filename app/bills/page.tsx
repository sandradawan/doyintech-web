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
      <main className="relative min-h-screen overflow-hidden bg-[#070b12] pb-28 pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,140,20,0.1),_transparent_50%)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#0071e3]/8 blur-3xl" />
        <div className="relative mx-auto max-w-[420px] px-5">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ff8c14] shadow-[0_0_24px_rgba(255,140,20,0.2)] backdrop-blur-xl">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M13 2 4 14h7l-1 8 10-14h-7l0-6z" />
              </svg>
            </div>
            <h1 className="text-[26px] font-semibold tracking-tight text-white">
              Top up from wallet
            </h1>
            <p className="mt-1 text-[14px] text-white/40">Airtime · Data · Remita RRR</p>
          </div>
          <BillsWorkspace />
        </div>
      </main>
      <Footer />
    </>
  );
}
