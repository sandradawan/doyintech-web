"use client";

import ScrollReveal from "../animations/ScrollReveal";
import { discoveryCallLink } from "@/lib/packages";

const bullets = [
  "15-minute call — no pressure",
  "Clear scope, timeline & budget range",
  "Reply on WhatsApp within hours",
];

export default function BookCall() {
  return (
    <section className="apple-section apple-section-black py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0071e3]/25 via-[#1d1d1f] to-black p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2997ff]">
                  Free discovery call
                </p>
                <h2 className="mt-2 text-[32px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[40px]">
                  Not sure which package fits?
                </h2>
                <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-[#a1a1a6]">
                  Tell us what you’re building. We’ll map the right offer, timeline,
                  and investment — on WhatsApp in minutes.
                </p>
                <ul className="mt-5 space-y-2">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-[15px] text-[#f5f5f7]">
                      <span className="text-[#2997ff]">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
                <a
                  href={discoveryCallLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-4 text-[16px] font-semibold text-white transition hover:brightness-110 sm:w-auto sm:min-w-[260px]"
                >
                  Book on WhatsApp
                </a>
                <a
                  href="/pricing"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-[15px] text-[#f5f5f7] transition hover:bg-white/5 sm:w-auto sm:min-w-[260px]"
                >
                  Compare packages
                </a>
                <p className="text-center text-[12px] text-[#a1a1a6] lg:text-right">
                  Or email{" "}
                  <a href="mailto:doyintechnology@outlook.com" className="apple-link">
                    doyintechnology@outlook.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
