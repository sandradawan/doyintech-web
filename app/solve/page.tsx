import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import SolveWorkspace from "@/components/solve/SolveWorkspace";

export const metadata: Metadata = {
  title: "SME Solve — Pipeline, Booking, Quotes, Cash & More | DoyinTech",
  description:
    "Free browser tools for Nigerian SMEs: lead pipeline, booking + deposit requests, quote builder, SOP hub, cash log, reviews, package finder, receivables.",
};

export default function SolvePage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[900px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Real business pains · free in-browser
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">
            Solve the problems kits can’t.
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Not another download. Working tools for leads, deposits, pricing, staff SOPs, cash,
            reviews, and money owed — saved on this device. When you outgrow local tools, we
            install the same flows on your site with Paystack.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-[13px]">
            <Link href="/hire" className="text-[#ff8c14] hover:underline">
              Hire — put this on my website →
            </Link>
            <Link href="/products" className="text-[#2997ff] hover:underline">
              Digital kits store
            </Link>
            <Link href="/tools" className="text-[#86868b] hover:underline">
              All tools
            </Link>
          </div>

          <div className="mt-10">
            <SolveWorkspace />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
