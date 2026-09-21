"use client";

import ScrollReveal from "../animations/ScrollReveal";
import {
  DIGITAL_PRODUCTS,
  SAAS_PRODUCTS,
  productWhatsAppLink,
  waitlistWhatsAppLink,
} from "@/lib/products";
import { packageWhatsAppLink } from "@/lib/packages";
import PaystackBuyButton from "@/components/ui/PaystackBuyButton";
import ContactCta from "@/components/ui/ContactCta";

export default function PassiveProducts() {
  return (
    <section id="products" className="apple-section apple-section-black">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
              Digital store
            </p>
            <h2 className="apple-headline mt-2">Products clients pay for.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-2xl">
              New today: Ember Dispatch & Failed-Delivery Recovery Kit. Paystack for instant download — or WhatsApp if you prefer.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DIGITAL_PRODUCTS.map((p, i) => {
            const featured =
              p.badge === "Best seller" ||
              p.badge === "Most popular" ||
              p.badge === "New today" ||
              p.badge === "Bundle" ||
              p.badge === "Bundle · Best value";
            return (
              <ScrollReveal key={p.id} direction="up" delay={i * 0.04} className="h-full">
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-[22px] border bg-gradient-to-b from-[#2c2c2e] to-[#1d1d1f] p-0 shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition hover:border-white/20 ${
                    featured
                      ? "border-[#2997ff]/45 ring-1 ring-[#2997ff]/20"
                      : "border-white/10"
                  }`}
                >
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex min-h-[24px] items-center gap-2">
                      {p.badge ? (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            p.badge.startsWith("Bundle")
                              ? "bg-[#ff8c14] text-black"
                              : featured
                                ? "bg-[#0071e3] text-white"
                                : "bg-white/10 text-[#a1a1a6]"
                          }`}
                        >
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-[11px] text-transparent">.</span>
                      )}
                    </div>

                    <h3 className="text-[18px] font-semibold leading-snug tracking-tight text-[#f5f5f7]">
                      {p.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[#a1a1a6]">
                      {p.description}
                    </p>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="text-[28px] font-semibold tracking-tight text-white">
                        {p.priceNgn}
                      </p>
                      <p className="text-[12px] text-[#a1a1a6]">{p.priceUsd} · one-time</p>
                    </div>

                    <ul className="mt-4 flex-1 space-y-2">
                      {p.features.slice(0, 4).map((f) => (
                        <li
                          key={f}
                          className="flex gap-2 text-[13px] leading-snug text-[#f5f5f7]/90"
                        >
                          <span className="mt-0.5 shrink-0 text-[#2997ff]">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-4 text-[11px] leading-snug text-[#86868b]">{p.delivery}</p>
                  </div>

                  <div className="space-y-2 border-t border-white/10 bg-black/25 px-6 py-4">
                    <PaystackBuyButton product={p} />
                    <a
                      href={productWhatsAppLink(p.name, "digital product")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full border border-[#25D366]/50 bg-[#25D366]/10 py-3 text-[13px] font-semibold text-[#25D366] transition hover:bg-[#25D366]/20"
                    >
                      Order on WhatsApp
                    </a>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <h3 className="mt-20 text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">
          Coming next — monthly subscriptions
        </h3>
        <div className="mt-4 grid items-stretch gap-5 md:grid-cols-2">
          {SAAS_PRODUCTS.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" delay={i * 0.06} className="h-full">
              <article className="flex h-full flex-col rounded-[22px] border border-white/10 bg-[#1d1d1f] p-7">
                {p.badge && (
                  <span className="mb-2 w-fit rounded-full bg-[#0071e3]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#2997ff]">
                    {p.badge}
                  </span>
                )}
                <h4 className="text-[20px] font-semibold text-[#f5f5f7]">{p.name}</h4>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#a1a1a6]">
                  {p.description}
                </p>
                <p className="mt-3 text-[20px] font-semibold text-[#f5f5f7]">{p.priceNgn}</p>
                <div className="mt-5">
                  <ContactCta compact emailSubject={`Waitlist: ${p.name}`} />
                </div>
                <a
                  href={waitlistWhatsAppLink(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-center text-[13px] text-[#2997ff] hover:underline"
                >
                  Or WhatsApp waitlist ›
                </a>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.08}>
          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[28px] border border-white/10 bg-[#1d1d1f] p-8 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-[22px] font-semibold text-[#f5f5f7]">Monthly Care Plan</h3>
              <p className="mt-2 max-w-xl text-[15px] text-[#a1a1a6]">
                Backups, updates, small changes, priority support.
              </p>
              <p className="mt-2 text-[18px] font-semibold text-[#f5f5f7]">
                From ₦50,000 – ₦150,000/mo
              </p>
            </div>
            <a
              href={packageWhatsAppLink("Monthly Care Plan")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-semibold text-white"
            >
              Start on WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
