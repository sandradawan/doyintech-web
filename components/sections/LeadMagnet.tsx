"use client";

import ScrollReveal from "../animations/ScrollReveal";

export default function LeadMagnet() {
  const wa =
    "https://wa.me/2348085343926?text=" +
    encodeURIComponent(
      "Hi DoyinTech, send me the SME Digital Ops Checklist and/or audit my site.\nURL:"
    );

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
                Free website audit + SME checklist
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-[#a1a1a6]">
                No long forms. Message on WhatsApp with your URL — get 2–3 concrete fixes and the
                ops checklist PDF.
              </p>
              <ul className="mt-4 space-y-1 text-[14px] text-[#f5f5f7]">
                <li>✓ Mobile + contact path check</li>
                <li>✓ WhatsApp / offer clarity</li>
                <li>✓ Honest next step (DIY vs hire us)</li>
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-semibold text-white"
              >
                Get audit on WhatsApp
              </a>
              <a
                href="/free-audit"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-semibold text-white"
              >
                Read how the audit works
              </a>
              <a href="/products" className="text-center text-[14px] text-[#2997ff] hover:underline">
                Or buy a pack now ›
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
