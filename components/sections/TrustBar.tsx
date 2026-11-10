"use client";

import type { ReactNode } from "react";
import ScrollReveal from "../animations/ScrollReveal";

const icon = (path: ReactNode) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {path}
  </svg>
);

const items = [
  {
    title: "Fixed price",
    desc: "No vague quotes. See packages before you pay.",
    icon: icon(<><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.2" /></>),
  },
  {
    title: "50% to start",
    desc: "Deposit online, balance only before handoff.",
    icon: icon(<><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></>),
  },
  {
    title: "Live in days",
    desc: "Landing pages in ~1 week. Full sites in 2–4.",
    icon: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  },
  {
    title: "Paystack ready",
    desc: "Card, bank, USSD — Naira & digital products.",
    icon: icon(<><path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></>),
  },
];

/** The dark strip that closes the hero: four promises on one frosted bar. */
export default function TrustBar() {
  return (
    <section className="theme-dark bg-brand-deep pb-12 pt-2">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <ScrollReveal direction="up">
          <div className="glass grid grid-cols-1 gap-x-6 gap-y-5 rounded-[22px] px-6 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-brand-ink/10">
            {items.map((item) => (
              <div key={item.title} className="flex items-start gap-3.5 lg:px-5 lg:first:pl-0 lg:last:pr-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-link/40 bg-brand-link/10 text-brand-link">
                  {item.icon}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold tracking-tight text-brand-ink">{item.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-brand-muted">{item.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
