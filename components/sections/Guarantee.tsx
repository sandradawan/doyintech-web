"use client";

import ScrollReveal from "../animations/ScrollReveal";

const points = [
  {
    title: "Fixed scope",
    body: "What is in the package is written before you pay. No surprise invoices for basic pages.",
  },
  {
    title: "Revision rounds included",
    body: "Structured feedback on the draft — not unlimited redesigns, but real polish before launch.",
  },
  {
    title: "Balance only when ready",
    body: "50% deposit starts the work. You pay the rest before final handoff when the site is approved.",
  },
  {
    title: "Post-launch support",
    body: "Short WhatsApp support window after go-live so small fixes do not leave you stranded.",
  },
];

export default function Guarantee() {
  return (
    <section className="border-y border-white/10 bg-[#0a0a0b] py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
              Risk reduced
            </p>
            <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-white sm:text-[34px]">
              Clear terms. No games.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[16px] text-[#a1a1a6]">
              Built for Nigerian SMEs who have been burned by vague quotes and silent freelancers.
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {points.map((p, i) => (
            <ScrollReveal key={p.title} direction="up" delay={i * 0.05}>
              <div className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-6">
                <p className="text-[17px] font-semibold text-white">{p.title}</p>
                <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">{p.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a
            href="/hire"
            className="inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
          >
            See packages & pay deposit
          </a>
        </div>
      </div>
    </section>
  );
}
