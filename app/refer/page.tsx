import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/ui/Footer";
import ReferWorkspace from "@/components/refer/ReferWorkspace";
import ReferralCapture from "@/components/ui/ReferralCapture";

export const metadata: Metadata = { alternates: { canonical: "/refer" },
  title: "Refer a business · ₦10,000 credit",
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
      <main className="min-h-screen bg-brand-deep pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6">
          <div className="text-center">
            <p className="section-eyebrow text-brand-link">Refer & earn</p>
            <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-brand-ink sm:text-[42px]">
              Refer a business → ₦10,000 credit
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-brand-muted">
              Know a salon, clinic, property agent, coach, or shop that needs a real website?
              Share your link. When they pay a deposit, you get ₦10k credit on your next order.
            </p>
          </div>

          <div className="mt-10">
            <ReferWorkspace />
          </div>

          <div className="mt-10 rounded-2xl border border-brand-ink/10 bg-brand-surface p-6">
            <h2 className="text-[18px] font-semibold text-brand-ink">How it works</h2>
            <ol className="mt-4 space-y-3 text-[15px] text-brand-soft">
              <li>1. Generate your referral link and share it.</li>
              <li>2. They book a call or pay a deposit on Hire.</li>
              <li>3. Deposit clears → your ₦10,000 credit is locked in.</li>
            </ol>
          </div>

          <div className="mt-8 rounded-2xl border border-brand-ink/10 bg-brand-surface p-6">
            <h2 className="text-[18px] font-semibold text-brand-ink">Rules (plain English)</h2>
            <ul className="mt-4 space-y-2">
              {rules.map((r) => (
                <li key={r} className="flex gap-2 text-[14px] text-brand-soft">
                  <span className="text-brand-link">•</span> {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a href="/hire" className="glass-card p-5 transition hover:border-brand-link/40">
              <p className="text-[13px] font-semibold text-brand-link">Packages</p>
              <p className="mt-1 text-[16px] font-semibold text-brand-ink">Fixed-price hire</p>
              <p className="mt-1 text-[13px] text-brand-subtle">Deposits that unlock your credit</p>
            </a>
            <a href="/case-studies" className="glass-card p-5 transition hover:border-brand-link/40">
              <p className="text-[13px] font-semibold text-brand-link">Proof</p>
              <p className="mt-1 text-[16px] font-semibold text-brand-ink">Case studies</p>
              <p className="mt-1 text-[13px] text-brand-subtle">Share real results with referrals</p>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
