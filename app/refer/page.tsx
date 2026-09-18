import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Refer a business · ₦10,000 credit | DoyinTech",
  description:
    "Introduce a business that pays a website deposit — earn ₦10,000 credit toward your next DoyinTech package or product.",
};

const rules = [
  "The referred business must be new to DoyinTech (no prior deposit).",
  "Credit unlocks only after their 50% deposit clears on Paystack.",
  "₦10,000 credit is valid for 12 months on any service package or digital product.",
  "One credit per successful referral. No cash payout — credit only.",
  "Share your name when you introduce them so we can attribute the referral.",
];

export default function ReferPage() {
  const waIntro =
    "https://wa.me/2348085343926?text=" +
    encodeURIComponent(
      "Hi DoyinTech — I want to REFER a business for a website package.\n\nMy name: \nTheir business / contact: \nWhat they need (if known):"
    );

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
              Refer & earn · simple
            </p>
            <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[42px]">
              Refer a business → ₦10,000 credit
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-[#a1a1a6]">
              Know a salon, clinic, property agent, coach, or shop that needs a real website?
              Introduce them. When they pay a deposit, you get ₦10k credit on your next DoyinTech
              order.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-[#ff8c14]/30 bg-gradient-to-b from-[#ff8c14]/10 to-[#141a28] p-6 text-center">
            <p className="text-[13px] font-medium text-[#c7cdd8]">How it works</p>
            <ol className="mx-auto mt-4 max-w-md space-y-3 text-left text-[15px] text-white">
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff8c14] text-[13px] font-bold text-black">
                  1
                </span>
                Message us on WhatsApp with their name / business.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff8c14] text-[13px] font-bold text-black">
                  2
                </span>
                We send them a clear package + deposit link.
              </li>
              <li className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff8c14] text-[13px] font-bold text-black">
                  3
                </span>
                When deposit clears → your ₦10,000 credit is locked in.
              </li>
            </ol>
            <a
              href={waIntro}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex rounded-full bg-[#25D366] px-8 py-3.5 text-[16px] font-semibold text-white"
            >
              Refer on WhatsApp
            </a>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-[#141a28] p-6">
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
            <a
              href="/hire"
              className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5 transition hover:border-[#ff8c14]/40"
            >
              <p className="text-[13px] font-semibold text-[#ff8c14]">Packages</p>
              <p className="mt-1 text-[16px] font-semibold text-white">Landing from ₦100k</p>
              <p className="mt-1 text-[13px] text-[#86868b]">Local website · Growth · fixed deposits</p>
            </a>
            <a
              href="/free-audit"
              className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5 transition hover:border-[#ff8c14]/40"
            >
              <p className="text-[13px] font-semibold text-[#ff8c14]">Lead magnet</p>
              <p className="mt-1 text-[16px] font-semibold text-white">Free 3-min audit</p>
              <p className="mt-1 text-[13px] text-[#86868b]">Easy first step for cold intros</p>
            </a>
          </div>

          <p className="mt-10 text-center text-[13px] text-[#86868b]">
            Already a client? Same deal — refer and stack credit on your next build or product.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
