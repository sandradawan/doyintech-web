"use client";

import ScrollReveal from "../animations/ScrollReveal";

export default function LeadMagnet() {
  return (
    <section className="apple-section apple-section-black py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="grid items-center gap-8 rounded-[28px] border border-white/10 bg-[#1d1d1f] p-8 md:grid-cols-2 md:p-10">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2997ff]">
                Free · grows your list
              </p>
              <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[34px]">
                Free audit + WhatsApp scripts
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-[#a1a1a6]">
                Two ways to start: send your site URL for a 3-minute audit, or generate 5 ready
                reply scripts for your business line — then upgrade to a fixed-price site when
                ready.
              </p>
              <ul className="mt-4 space-y-1 text-[14px] text-[#f5f5f7]">
                <li>✓ Free site audit → concrete fixes</li>
                <li>✓ Free WA scripts → price, booking, close</li>
                <li>✓ Clear path to hire (₦100k–₦250k packages)</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="/free-audit"
                className="inline-flex items-center justify-center rounded-full bg-[#ff8c14] px-6 py-3.5 text-[15px] font-semibold text-black"
              >
                Free website audit
              </a>
              <a
                href="/tools/whatsapp-scripts"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-semibold text-white"
              >
                Free WhatsApp scripts
              </a>
              <a href="/hire" className="text-center text-[14px] text-[#2997ff] hover:underline">
                Or pay deposit on a fixed package ›
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
