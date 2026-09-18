import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "WhatsApp Booking System for Nigerian SMEs — Clinics, Lounges, Salons",
  description:
    "How to combine a simple website with WhatsApp so customers book stations, appointments, and services without friction. Fixed-price options from DoyinTech.",
};

export default function WhatsAppBookingPost() {
  return (
    <>
      <main className="bg-black pb-24 pt-28">
        <article className="mx-auto max-w-[680px] px-6">
          <Link href="/blog" className="text-sm text-[#2997ff] hover:underline">
            ← Blog
          </Link>
          <p className="mt-8 text-[12px] font-semibold uppercase tracking-wide text-[#ff8c14]">
            Systems · September 2026
          </p>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-white sm:text-[40px]">
            WhatsApp booking system for Nigerian SMEs
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">
            Your customers already live on WhatsApp. The job of your website is not to replace it —
            it is to hand them into a clear booking chat in one tap.
          </p>

          <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-[#c7cdd8]">
            <section>
              <h2 className="mb-3 text-[22px] font-semibold text-white">Why WhatsApp beats "book online" forms</h2>
              <p>
                Forms get abandoned on slow data. WhatsApp feels familiar, works offline in the
                app, and lets staff confirm time, price, and location in the same thread. Clinics,
                gaming lounges, salons, and coaches all win when the path is short.
              </p>
            </section>
            <section>
              <h2 className="mb-3 text-[22px] font-semibold text-white">What a good setup includes</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Website with pricing or packages and a fixed WhatsApp CTA</li>
                <li>Prefill text: service + preferred day (fewer back-and-forth messages)</li>
                <li>Optional admin view or simple sheet for slots (start simple)</li>
                <li>Status replies for after-hours so leads do not go cold</li>
              </ul>
            </section>
            <section>
              <h2 className="mb-3 text-[22px] font-semibold text-white">Real example</h2>
              <p>
                For LegacyPlay (PlayStation lounge), we built a bold site with clear station
                pricing and WhatsApp reservation — so walk-ins and online visitors use the same
                path.{" "}
                <Link href="/case-studies/legacyplay" className="text-[#2997ff] hover:underline">
                  Read the case study
                </Link>
                .
              </p>
            </section>
            <section>
              <h2 className="mb-3 text-[22px] font-semibold text-white">What it costs (fixed)</h2>
              <p>
                Landing page from ₦100,000 · Local business site ₦250,000 · WhatsApp + booking
                system packages also available. 50% deposit via Paystack. See{" "}
                <Link href="/hire" className="text-[#2997ff] hover:underline">
                  hire packages
                </Link>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 rounded-2xl border border-[#ff8c14]/25 bg-[#ff8c14]/5 p-6">
            <p className="text-[15px] font-semibold text-white">
              Want a booking path that staff can run?
            </p>
            <p className="mt-2 text-[14px] text-[#a1a1a6]">
              Free audit of your current site, or book a 15-minute discovery call.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/hire"
                className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black"
              >
                See fixed-price packages
              </Link>
              <Link
                href="/free-audit"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Free website audit
              </Link>
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#2997ff]"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
