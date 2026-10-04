"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";

const included = [
  "Fixed-scope proposal before deposit",
  "Mobile-responsive build",
  "WhatsApp / contact CTAs wired",
  "Launch checklist + basic SEO setup",
  "Handover notes so you can update content",
];

const notIncluded = [
  "Unlimited revision rounds (scope is fixed)",
  "Paid ads management (unless quoted)",
  "Custom software outside the agreed package",
  "Domain/hosting renewals (you own the accounts)",
  "Content writing for every page (unless quoted)",
];

const deposit = [
  { t: "50% deposit", d: "Locks your slot and starts design/build." },
  { t: "Milestone updates", d: "You see progress on WhatsApp or portal." },
  { t: "Balance before handoff", d: "Final files + go-live after balance." },
];

export default function PricingClarity() {
  return (
    <section id="clarity" className="apple-section apple-section-black border-t border-white/[0.06]">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <p className="section-eyebrow">Clarity</p>
          <h2 className="section-title mt-2">What you get — and what you don't</h2>
          <p className="section-lead mt-3">
            Fewer surprises. Packages are fixed-scope so delivery stays on time and on budget.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="glass-card h-full p-6 sm:p-8">
              <h3 className="text-[17px] font-semibold text-[#25D366]">Included</h3>
              <ul className="mt-4 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex gap-2 text-[14px] text-[#c7cdd8]">
                    <span className="text-[#25D366]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <div className="glass-card h-full p-6 sm:p-8">
              <h3 className="text-[17px] font-semibold text-[#ff8c14]">Not included by default</h3>
              <ul className="mt-4 space-y-3">
                {notIncluded.map((item) => (
                  <li key={item} className="flex gap-2 text-[14px] text-[#c7cdd8]">
                    <span className="text-[#ff8c14]">–</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {deposit.map((s, i) => (
            <ScrollReveal key={s.t} direction="up" delay={0.05 * i}>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <p className="text-[15px] font-semibold text-white">{s.t}</p>
                <p className="mt-1 text-[13px] text-[#a1a1a6]">{s.d}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
