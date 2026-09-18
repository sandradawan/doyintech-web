"use client";

import ScrollReveal from "../animations/ScrollReveal";

const items = [
  {
    title: "Fixed price",
    desc: "No vague quotes. See packages before you pay.",
  },
  {
    title: "50% to start",
    desc: "Deposit online, balance only before handoff.",
  },
  {
    title: "Live in days",
    desc: "Landing pages in ~1 week. Full sites in 2–4.",
  },
  {
    title: "Paystack ready",
    desc: "Card, bank, USSD — Naira & digital products.",
  },
];

export default function TrustBar() {
  return (
    <section className="border-b border-white/10 bg-[#0a0a0b] py-10">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {items.map((item) => (
              <div key={item.title} className="text-center md:text-left">
                <p className="text-[15px] font-semibold tracking-tight text-[#f5f5f7]">
                  {item.title}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-[#a1a1a6]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
