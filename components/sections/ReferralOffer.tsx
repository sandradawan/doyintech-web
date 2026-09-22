"use client";

import ScrollReveal from "../animations/ScrollReveal";
import ViralShare from "@/components/ui/ViralShare";

export default function ReferralOffer() {
  const wa =
    "https://wa.me/2348085343926?text=" +
    encodeURIComponent(
      "Hi DoyinTech, I want to refer a business for a website package. How does the ₦10,000 credit work?"
    );

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1a2030] to-[#0c1018] p-8 md:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
              Refer & earn
            </p>
            <h2 className="mt-2 text-[26px] font-semibold tracking-tight text-white sm:text-[32px]">
              Refer a business → ₦10,000 credit
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
              When a business you introduce pays a deposit on any fixed-price website package, you
              get ₦10,000 credit toward your next DoyinTech product or package. Simple WhatsApp
              intro — we handle the rest.
            </p>
            <ul className="mt-4 space-y-1 text-[14px] text-[#c7cdd8]">
              <li>✓ Applies after their deposit clears</li>
              <li>✓ Credit valid 12 months</li>
              <li>✓ Stack with digital products or your own project</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-white"
              >
                Refer on WhatsApp
              </a>
              <a
                href="/hire"
                className="inline-flex rounded-full border border-white/20 px-6 py-3 text-[14px] font-semibold text-white"
              >
                View packages
              </a>
              <a
                href="/refer"
                className="inline-flex rounded-full border border-white/20 px-6 py-3 text-[14px] font-semibold text-white"
              >
                Full rules
              </a>
            </div>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-[13px] text-[#a1a1a6]">Forward this offer to a friend:</p>
              <ViralShare
                className="mt-2"
                compact
                text="DoyinTech pays ₦10,000 credit when you refer a business that pays a website deposit. Fixed-price sites for Nigerian SMEs."
                url="https://doyintech.vercel.app/refer"
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
