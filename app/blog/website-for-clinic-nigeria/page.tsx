import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import BlogPostExtras from "@/components/blog/BlogPostExtras";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = { alternates: { canonical: "/blog/website-for-clinic-nigeria" },
  title: "Clinic Website in Nigeria: Appointments via WhatsApp",
  description:
    "What clinics need online: clear services, hours, location, and one-tap WhatsApp booking. Fixed-price websites from DoyinTech.",
};

export default function ClinicWebsitePost() {
  return (
    <>
      <main className="bg-brand-deep pb-24 pt-28">
        <article className="mx-auto max-w-[680px] px-6">
          <Link href="/blog" className="text-sm text-brand-link hover:underline">
            ← Blog
          </Link>
          <p className="mt-8 text-[12px] font-semibold uppercase tracking-wide text-brand-link">
            Healthcare · September 2026
          </p>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight text-brand-ink sm:text-[40px]">
            Website for a clinic in Nigeria
          </h1>
          <p className="mt-4 text-[17px] text-brand-muted">
            Patients search, then chat. Your site should answer what you treat, where you are, and
            how to book — in under ten seconds on a phone.
          </p>
          <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-brand-soft">
            <p>
              Skip heavy portals at the start. A strong Local Business Website with services,
              doctor/clinic intro, map link, and WhatsApp CTA converts better than a half-built
              patient portal.
            </p>
            <p>
              Fixed price from DoyinTech: Local Business Website ₦250,000 (deposit ₦125,000) or
              start with a single landing page at ₦100,000.{" "}
              <Link href="/hire" className="text-brand-link hover:underline">
                See packages
              </Link>
              .
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/hire" className="rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-black">
              Hire · fixed price
            </Link>
            <Link href="/free-audit" className="rounded-full border border-brand-ink/20 px-5 py-2.5 text-sm font-semibold text-brand-ink">
              Free audit
            </Link>
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="rounded-full px-5 py-2.5 text-sm font-semibold text-brand-link">
              WhatsApp
            </a>
          </div>
                  <p className="mt-8 text-[14px] text-brand-muted">
            Ready to build? See our <Link href="/websites/clinics" className="text-brand-link hover:underline">clinic website design and pricing</Link>.
          </p>
          <BlogPostExtras slug="website-for-clinic-nigeria" title={"Clinic Website in Nigeria: Appointments via WhatsApp"} description={"What clinics need online: clear services, hours, location, and one-tap WhatsApp booking. Fixed-price websites from DoyinTech."} published="2026-09-18" />
        </article>
      </main>
      <Footer />
    </>
  );
}
