import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import BlogPostExtras from "@/components/blog/BlogPostExtras";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = { alternates: { canonical: "/blog/website-for-salon-nigeria" },
  title: "Salon Website in Nigeria: What Actually Gets Bookings",
  description:
    "How Nigerian salons and makeup artists turn Instagram followers into WhatsApp bookings with a simple, fixed-price website. Jos and nationwide.",
};

export default function SalonWebsitePost() {
  return (
    <>
      <main className="bg-brand-deep pb-24 pt-28">
        <article className="mx-auto max-w-[680px] px-6">
          <Link href="/blog" className="text-sm text-brand-link hover:underline">
            ← Blog
          </Link>
          <p className="mt-8 text-[12px] font-semibold uppercase tracking-wide text-brand-link">
            Local business · September 2026
          </p>
          <h1 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-brand-ink sm:text-[40px]">
            Website for a salon in Nigeria — what actually gets bookings
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-brand-muted">
            Instagram is great for discovery. A website is where serious clients decide to book.
            Here is what works for salons, makeup artists, and beauty brands in Nigeria — without
            spending months or millions.
          </p>

          <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-brand-soft">
            <section>
              <h2 className="mb-3 text-[22px] font-semibold text-brand-ink">1. One clear offer above the fold</h2>
              <p>
                When someone lands on your page, they should know in three seconds: who you are,
                what you do (bridal, soft glam, nails, hair), and how to book. Fancy animations do
                not replace a WhatsApp button.
              </p>
            </section>
            <section>
              <h2 className="mb-3 text-[22px] font-semibold text-brand-ink">2. WhatsApp-first booking</h2>
              <p>
                Most Nigerian clients will not fill a long form. Put a big &quot;Book on WhatsApp&quot; CTA
                on every page. Prefill the message with service type so the chat starts warm.
              </p>
            </section>
            <section>
              <h2 className="mb-3 text-[22px] font-semibold text-brand-ink">3. Show the work, not stock photos</h2>
              <p>
                Real portfolio photos (bridal, soft glam, editorial) convert better than generic
                beauty stock. Mobile-first layout matters — most traffic is phone.
              </p>
            </section>
            <section>
              <h2 className="mb-3 text-[22px] font-semibold text-brand-ink">4. Fixed price beats &quot;contact for quote&quot;</h2>
              <p>
                At DoyinTech we productised this: a Landing Page Starter at ₦100,000 (₦50,000
                deposit) or a Local Business Website at ₦250,000. Live in days, not months. See{" "}
                <Link href="/case-studies/jennyglams" className="text-brand-link hover:underline">
                  how we did it for JennyGlams in Jos
                </Link>
                .
              </p>
            </section>
            <section>
              <h2 className="mb-3 text-[22px] font-semibold text-brand-ink">Quick checklist</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Loads fast on mobile data</li>
                <li>Services + starting prices (or &quot;from&quot;) visible</li>
                <li>One-tap WhatsApp on every screen</li>
                <li>Location / city clear for local search</li>
                <li>HTTPS and a simple Google Business link</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 rounded-2xl border border-brand-link/25 bg-brand-link/5 p-6">
            <p className="text-[15px] font-semibold text-brand-ink">
              Ready for a site that gets enquiries?
            </p>
            <p className="mt-2 text-[14px] text-brand-muted">
              Fixed price. 50% deposit. Paystack. Or start with a free 3-minute audit.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/hire"
                className="rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-black"
              >
                Hire · fixed price
              </Link>
              <Link
                href="/free-audit"
                className="rounded-full border border-brand-ink/20 px-5 py-2.5 text-sm font-semibold text-brand-ink"
              >
                Free audit
              </Link>
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-brand-link"
              >
                WhatsApp us
              </a>
            </div>
          </div>
          <BlogPostExtras slug="website-for-salon-nigeria" title={"Salon Website in Nigeria: What Actually Gets Bookings"} description={"How Nigerian salons and makeup artists turn Instagram followers into WhatsApp bookings with a simple, fixed-price website. Jos and nationwide."} published="2026-09-18" />
        </article>
      </main>
      <Footer />
    </>
  );
}
