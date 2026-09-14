import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import OutreachHub from "@/components/outreach/OutreachHub";

export const metadata: Metadata = {
  title: "Outreach Hub — US & UK Client Pipeline",
  description:
    "DoyinTech internal outreach system: prospect tracker, message templates, free digital audit builder, and daily checklist for US and UK local businesses.",
  robots: { index: false, follow: false },
};

export default function OutreachPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[960px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Sales system
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">
            US & UK Outreach Hub
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#a1a1a6]">
            Track prospects, generate personalized cold emails and LinkedIn notes, build free
            3-minute digital audits, and run a daily 90-minute outreach plan. Data stays in your
            browser until you export CSV.
          </p>

          <div className="mt-10">
            <OutreachHub />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
