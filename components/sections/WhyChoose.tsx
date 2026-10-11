"use client";

import ScrollReveal from "../animations/ScrollReveal";

const rows = [
  {
    label: "Pricing",
    others: "Custom quote after several calls",
    us: "Fixed starting prices you can see upfront",
  },
  {
    label: "Scope",
    others: "Unclear deliverables & moving goalposts",
    us: "Clear packages and written deliverables",
  },
  {
    label: "Billing",
    others: "Surprise charges and change-order bills",
    us: "50% deposit · balance only before handoff",
  },
  {
    label: "Communication",
    others: "Slow replies, disappearing freelancers",
    us: "WhatsApp support and structured updates",
  },
  {
    label: "After launch",
    others: "You’re on your own",
    us: "Optional care plans + real post-launch help",
  },
];

export default function WhyChoose() {
  return (
    <section className="apple-section apple-section-black border-y border-white/5">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
              Why DoyinTech
            </p>
            <h2 className="apple-headline mt-2">
              Clear process. No surprises.
            </h2>
            <p className="apple-subhead mx-auto mt-3 max-w-xl">
              Most SMEs lose money to vague quotes and unfinished work. We built
              the opposite.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.08}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0e17]">
            <div className="grid grid-cols-3 border-b border-white/10 bg-white/[0.03] px-5 py-4 text-[13px] font-semibold sm:px-8">
              <div className="text-[#86868b]">Comparison</div>
              <div className="text-center text-[#a1a1a6]">Most agencies</div>
              <div className="text-center text-[#ff8c14]">DoyinTech</div>
            </div>

            {rows.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 gap-2 px-5 py-4 text-[13px] sm:px-8 sm:text-[14px] ${
                  i !== rows.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <div className="font-medium text-[#f5f5f7]">{row.label}</div>
                <div className="text-center text-[#86868b]">
                  <span className="mr-1.5 text-red-400/80">✕</span>
                  {row.others}
                </div>
                <div className="text-center text-[#f5f5f7]">
                  <span className="mr-1.5 text-emerald-400">✓</span>
                  {row.us}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.12}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="/hire" className="apple-btn apple-btn-primary">
              See packages & pay deposit
            </a>
            <a
              href="/portfolio"
              className="apple-btn apple-btn-secondary"
            >
              View live work ›
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
