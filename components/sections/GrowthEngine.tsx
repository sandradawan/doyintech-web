"use client";

import Link from "next/link";
import ScrollReveal from "../animations/ScrollReveal";

const CARDS = [
  {
    title: "Free website audit",
    body: "3 minutes. Real fixes. Pipeline starts here.",
    href: "/free-audit",
    cta: "Run audit",
    accent: "border-[#ff8c14]/35",
  },
  {
    title: "WhatsApp scripts",
    body: "Price replies, booking, reviews — copy and paste.",
    href: "/tools/whatsapp-scripts",
    cta: "Open tool",
    accent: "border-[#25D366]/35",
  },
  {
    title: "Refer → ₦10k credit",
    body: "Introduce a business. They deposit. You earn credit.",
    href: "/refer",
    cta: "Refer a business",
    accent: "border-[#2997ff]/35",
  },
  {
    title: "Status captions",
    body: "7 ready posts to fill Status this week (share the brand).",
    href: "/status-pack",
    cta: "Copy captions",
    accent: "border-white/15",
  },
];

export default function GrowthEngine() {
  return (
    <section className="border-y border-white/10 bg-[#0a0e17] py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
              Grow with us
            </p>
            <h2 className="mt-2 text-[26px] font-semibold tracking-tight text-white sm:text-[32px]">
              Free tools. Real referrals. Daily reach.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[#a1a1a6]">
              Use something free today, hire when you need it built, or earn credit when you
              introduce a business that pays a deposit.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <ScrollReveal key={c.href} direction="up" delay={i * 0.05}>
              <Link
                href={c.href}
                className={`flex h-full flex-col rounded-2xl border bg-[#141a28] p-5 transition hover:bg-[#1a2233] ${c.accent}`}
              >
                <h3 className="text-[16px] font-semibold text-white">{c.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[#a1a1a6]">{c.body}</p>
                <p className="mt-4 text-[13px] font-semibold text-[#ff8c14]">{c.cta} →</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
