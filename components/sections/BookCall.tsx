"use client";

import Link from "next/link";
import ScrollReveal from "../animations/ScrollReveal";
import { PRIMARY_CTA } from "@/lib/cta";
import { bookCallLink, hasCalendarBooking, whatsappDiscoveryLink } from "@/lib/booking";

const bullets = [
  "15-minute call — no pressure",
  "Clear scope, timeline & budget range",
  "Reply on WhatsApp within hours",
];

export default function BookCall() {
  const calendar = hasCalendarBooking();
  const primary = bookCallLink("Website book-call section");

  return (
    <section className="apple-section apple-section-black py-16">
      <div className="mx-auto max-w-[980px] px-6">
        <ScrollReveal direction="up">
          <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#ff8c14]/25 via-brand-surface to-black p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-link">
                  Ready when you are
                </p>
                <h2 className="mt-2 text-[32px] font-semibold tracking-tight text-brand-ink sm:text-[40px]">
                  Get a website that brings you clients.
                </h2>
                <p className="mt-3 max-w-lg text-[17px] leading-relaxed text-brand-muted">
                  Tell us what you&apos;re building. We&apos;ll map the right offer, timeline,
                  and investment — in a short call or on WhatsApp.
                </p>
                <ul className="mt-5 space-y-2">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-[15px] text-brand-ink">
                      <span className="text-brand-link">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
                <Link
                  href={PRIMARY_CTA.href}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#ff8c14] px-6 py-4 text-[16px] font-semibold text-black transition hover:brightness-110 sm:w-auto sm:min-w-[260px]"
                >
                  {PRIMARY_CTA.label}
                </Link>
                <a
                  href={calendar ? primary : whatsappDiscoveryLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-[15px] text-brand-ink transition hover:bg-white/5 sm:w-auto sm:min-w-[260px]"
                >
                  {calendar ? "Book a free 15-min call" : "Ask on WhatsApp first"}
                </a>
                <p className="text-center text-[12px] text-brand-muted lg:text-right">
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
