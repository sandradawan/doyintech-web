import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Property Website in Nigeria — Estates, Leads & Equity Mortgage",
  description:
    "How property developers and facilitators get serious enquiries online. Lessons from platforms like Imperial Villa. Fixed-price and custom builds.",
};

export default function PropertyWebsitePost() {
  return (
    <>
      <main className="bg-black pb-24 pt-28">
        <article className="mx-auto max-w-[680px] px-6">
          <Link href="/blog" className="text-sm text-[#2997ff] hover:underline">
            ← Blog
          </Link>
          <p className="mt-8 text-[12px] font-semibold uppercase tracking-wide text-[#ff8c14]">
            Property · September 2026
          </p>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight text-white sm:text-[40px]">
            Property website in Nigeria that gets leads
          </h1>
          <p className="mt-4 text-[17px] text-[#a1a1a6]">
            Estates, 25% equity mortgage messaging, and trust signals matter more than stock skyline
            photos. Serious buyers want clarity and a human path.
          </p>
          <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-[#c7cdd8]">
            <p>
              Show estates, process, and proof. Put WhatsApp and forms where the offer is. For
              multi-product operators, a marketing site plus portal is a phased build — start with
              the public face.
            </p>
            <p>
              See how we approached a full property platform:{" "}
              <Link href="/case-studies/imperial-villa" className="text-[#2997ff] hover:underline">
                Imperial Villa case study
              </Link>
              .
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/hire" className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black">
              Start with fixed-price site
            </Link>
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">
              Scope a portal
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
