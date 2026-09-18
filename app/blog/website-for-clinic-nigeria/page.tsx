import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Website for a Clinic in Nigeria — Appointments via WhatsApp",
  description:
    "What clinics need online: clear services, hours, location, and one-tap WhatsApp booking. Fixed-price websites from DoyinTech.",
};

export default function ClinicWebsitePost() {
  return (
    <>
      <main className="bg-black pb-24 pt-28">
        <article className="mx-auto max-w-[680px] px-6">
          <Link href="/blog" className="text-sm text-[#2997ff] hover:underline">
            ← Blog
          </Link>
          <p className="mt-8 text-[12px] font-semibold uppercase tracking-wide text-[#ff8c14]">
            Healthcare · September 2026
          </p>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight text-white sm:text-[40px]">
            Website for a clinic in Nigeria
          </h1>
          <p className="mt-4 text-[17px] text-[#a1a1a6]">
            Patients search, then chat. Your site should answer what you treat, where you are, and
            how to book — in under ten seconds on a phone.
          </p>
          <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-[#c7cdd8]">
            <p>
              Skip heavy portals at the start. A strong Local Business Website with services,
              doctor/clinic intro, map link, and WhatsApp CTA converts better than a half-built
              patient portal.
            </p>
            <p>
              Fixed price from DoyinTech: Local Business Website ₦250,000 (deposit ₦125,000) or
              start with a single landing page at ₦100,000.{" "}
              <Link href="/hire" className="text-[#2997ff] hover:underline">
                See packages
              </Link>
              .
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/hire" className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black">
              Hire · fixed price
            </Link>
            <Link href="/free-audit" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">
              Free audit
            </Link>
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#2997ff]">
              WhatsApp
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
