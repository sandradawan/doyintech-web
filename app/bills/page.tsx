import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import BillsWorkspace from "@/components/bills/BillsWorkspace";

export const metadata: Metadata = {
  title: "Buy Airtime, Data & Pay RRR | DoyinTech Bills",
  description:
    "Buy MTN, Airtel, Glo and 9mobile airtime & data. Pay Remita RRR invoices. Paystack checkout.",
};

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<{ paid?: string; ref?: string }>;
}) {
  const sp = await searchParams;
  const paidRef = sp.paid === "1" && sp.ref ? sp.ref : null;

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[640px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Bills · Airtime · Data · RRR
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white sm:text-[38px]">
            Pay everyday bills fast.
          </h1>
          <p className="mt-3 text-[16px] leading-relaxed text-[#a1a1a6]">
            Top up airtime and data with Paystack. Pay government and school RRRs via Remita.
            Built for Nigerian phones and wallets.
          </p>
          <div className="mt-8">
            <BillsWorkspace paidRef={paidRef} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
