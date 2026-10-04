import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/ui/Footer";
import ReferWorkspace from "@/components/refer/ReferWorkspace";
import ReferralCapture from "@/components/ui/ReferralCapture";

export const metadata: Metadata = {
  title: "Refer a business · ₦10,000 credit | DoyinTech",
  description:
    "Introduce a business that pays a website deposit — earn ₦10,000 credit toward your next DoyinTech package or product. Get a shareable referral link.",
};

const rules = [
  "The referred business must be new to DoyinTech (no prior deposit).",
  "Credit unlocks only after their 50% deposit clears on Paystack.",
  "₦10,000 credit is valid for 12 months on any service package or digital product.",
  "One credit per successful referral. No cash payout — credit only.",
  "Share your referral link or code so we can attribute the deposit.",
];

export default function ReferPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6">
          <div className="text-center">
            <p className="section-eyebrow text-[#ff8c14]">Refer & earn</p>
            <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[42px]">
              Refer a business → ₦10,000 credit
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-[#a1a1a6]">
              Know a salon, clinic, property agent, coach, or shop that needs a real website?
              Share your link. When they pay a deposit, you get ₦10k credit on your next order.
            </p>
          </div>

          <div className="mt-10">
            <ReferWorkspace />
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-[#1d1d1f] p-6">
            <h2 className="text-[18px] font-semibold text-white">How it works</h2>
            <ol className="mt-4 space-y-3 text-[15px] text-[#c7cdd8]">
              <li>1. Generate your referral link and share it.</li>
              <li>2. They book a call or pay a deposit on Hire.</li>
              <li>3. Deposit clears → your ₦10,000 credit is locked in.</li>
            </ol>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-[#1d1d1f] p-6">
            <h2 className="text-[18px] font-semibold text-white">Rules (plain English)</h2>
            <ul className="mt-4 space-y-2">
              {rules.map((r) => (
                <li key={r} className="flex gap-2 text-[14px] text-[#c7cdd8]">
                  <span className="text-[#ff8c14]">•</span> {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a href="/hire" className="glass-card p-5 transition hover:border-[#ff8c14]/40">
              <p className="text-[13px] font-semibold text-[#ff8c14]">Packages</p>
              <p className="mt-1 text-[16px] font-semibold text-white">Fixed-price hire</p>
              <p className="mt-1 text-[13px] text-[#86868b]">Deposits that unlock your credit</p>
            </a>
            <a href="/case-studies" className="glass-card p-5 transition hover:border-[#ff8c14]/40">
              <p className="text-[13px] font-semibold text-[#ff8c14]">Proof</p>
              <p className="mt-1 text-[16px] font-semibold text-white">Case studies</p>
              <p className="mt-1 text-[13px] text-[#86868b]">Share real results with referrals</p>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
