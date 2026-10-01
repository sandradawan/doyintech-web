import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import BillsWorkspace from "@/components/bills/BillsWorkspace";

export const metadata: Metadata = {
  title: "Top up airtime & data | DoyinTech Bills",
  description:
    "Buy MTN, Airtel, Glo, 9mobile airtime and data. Pay Remita RRR. Fast Paystack checkout.",
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
      <main className="min-h-screen bg-[#0a0e17] pb-28 pt-20">
        <div className="mx-auto max-w-[420px] px-5">
          <h1 className="text-center text-[26px] font-semibold tracking-tight text-white">
            Top up in 3 taps
          </h1>
          <p className="mt-1 text-center text-[14px] text-[#86868b]">
            Airtime · Data · Remita RRR
          </p>
          <div className="mt-6">
            <BillsWorkspace paidRef={paidRef} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
