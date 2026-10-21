import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Packages from "@/components/sections/Packages";
import PricingClarity from "@/components/sections/PricingClarity";
import BookCall from "@/components/sections/BookCall";
import FAQ from "@/components/sections/FAQ";
import { discoveryCallLink } from "@/lib/packages";
import { PRIMARY_CTA } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Pricing & Packages",
  description:
    "Clear DoyinTech packages: starter websites, growth sites, WhatsApp booking systems, web apps/CRM, and monthly care plans. USD and NGN pricing. What's included and deposit rules.",
};

export default function PricingPage() {
  return (
    <>
      <main className="bg-black pt-20">
        <div className="mx-auto max-w-[980px] px-6 pb-8 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
            Pricing
          </p>
          <h1 className="apple-headline mt-3 text-[#f5f5f7]">Simple packages.</h1>
          <p className="apple-subhead mx-auto mt-4 max-w-2xl">
            Know what you&apos;re buying. Pay a fixed-price deposit online, or book a free call to
            confirm scope first.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={PRIMARY_CTA.href} className="apple-btn apple-btn-primary">
              {PRIMARY_CTA.label}
            </a>
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-btn apple-btn-secondary"
            >
              Book a free 15-min call
            </a>
          </div>
        </div>

        <Packages />
        <PricingClarity />
        <BookCall />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
