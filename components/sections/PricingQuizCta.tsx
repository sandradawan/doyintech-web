"use client";

import ScrollReveal from "../animations/ScrollReveal";

export default function PricingQuizCta() {
  return (
    <section className="apple-section apple-section-black border-t border-white/5">
      <div className="mx-auto max-w-[900px] px-6">
        <ScrollReveal direction="up">
          <div className="rounded-[28px] border border-[#ff8c14]/25 bg-gradient-to-br from-[#1a2030] to-[#0c1018] p-8 sm:p-10 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
              30-second quiz
            </p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
              Not sure which package fits?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-[#a1a1a6]">
              Answer three questions about pages, goals, and booking. Get a fixed-price
              recommendation and a Paystack deposit link.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/pricing-quiz"
                className="rounded-full bg-[#ff8c14] px-7 py-3.5 text-[15px] font-semibold text-black transition hover:bg-[#ffa03a]"
              >
                Take the pricing quiz
              </a>
              <a
                href="/hire"
                className="rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-white/5"
              >
                See all packages
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
