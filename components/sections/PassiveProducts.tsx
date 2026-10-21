"use client";

import Link from "next/link";
import ScrollReveal from "../animations/ScrollReveal";
import { DIGITAL_PRODUCTS } from "@/lib/products";
import PaystackBuyButton from "@/components/ui/PaystackBuyButton";

/** Homepage shop teaser: three best kits (one buy button each) and the Pro membership. */
export default function PassiveProducts() {
  const featured = DIGITAL_PRODUCTS.slice(0, 3);

  return (
    <section id="products" className="apple-section apple-section-black">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
              Not ready for a website?
            </p>
            <h2 className="apple-headline mt-2">Start with a ready-made kit.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-2xl">
              Scripts, trackers and playbooks you can use today. Pay with Paystack, delivered to
              your email.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" delay={i * 0.04} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-b from-[#2c2c2e] to-[#1d1d1f] shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition hover:border-white/20">
                <div className="flex flex-1 flex-col p-6">
                  {p.badge && (
                    <span className="mb-3 w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#a1a1a6]">
                      {p.badge}
                    </span>
                  )}
                  <h3 className="text-[18px] font-semibold leading-snug tracking-tight text-[#f5f5f7]">
                    {p.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[#a1a1a6]">
                    {p.description}
                  </p>
                  <p className="mt-5 border-t border-white/10 pt-4 text-[28px] font-semibold tracking-tight text-white">
                    {p.priceNgn}
                  </p>
                  <p className="text-[12px] text-[#a1a1a6]">{p.priceUsd} · one-time</p>
                </div>
                <div className="border-t border-white/10 bg-black/25 px-6 py-4">
                  <PaystackBuyButton product={p} />
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/products" className="text-[15px] font-semibold text-[#ff8c14] hover:underline">
            See all kits and ebooks →
          </Link>
        </div>

        <ScrollReveal direction="up" delay={0.08}>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[28px] border border-[#ff8c14]/30 bg-[#1d1d1f] p-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#ff8c14]">
                Membership
              </p>
              <h3 className="mt-1 text-[22px] font-semibold text-[#f5f5f7]">DoyinTech Pro</h3>
              <p className="mt-2 max-w-xl text-[15px] text-[#a1a1a6]">
                Every premium tool — invoices, contracts, PDFs, CVs, proposals — on all your
                devices. ₦5,000/month, cancel any time.
              </p>
            </div>
            <Link
              href="/pro"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#ff8c14] px-6 py-3.5 text-[15px] font-semibold text-black"
            >
              See Pro
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
