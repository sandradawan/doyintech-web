import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Website for a Gaming Lounge in Nigeria — Bookings & Tournaments",
  description:
    "What a gaming lounge website needs to fill stations: clear pricing, tournament calendar, WhatsApp booking, and a mobile-first design. Fixed-price builds from ₦100k.",
};

export default function GamingLoungeWebsitePage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <article className="mx-auto max-w-[720px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Local business · Gaming
          </p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[40px]">
            Website for a gaming lounge in Nigeria
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">
            Instagram posts fill the feed — not always the stations. A simple site with prices,
            hours, location, and one-tap WhatsApp booking turns browsers into reserved seats.
          </p>

          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[#c7cdd8]">
            <section>
              <h2 className="text-[22px] font-semibold text-white">What gamers look for</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Station types and hourly / package prices</li>
                <li>Tournament schedule and entry fees</li>
                <li>Location + Google Maps pin</li>
                <li>One-tap WhatsApp to reserve or ask about a free PC</li>
                <li>Photos of the floor — not stock images</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[22px] font-semibold text-white">What we ship</h2>
              <p className="mt-3">
                Fixed-price pages that match how lounges actually sell seats — bold design, mobile
                first, WhatsApp CTA on every screen. See our{" "}
                <Link href="/case-studies/legacyplay" className="text-[#2997ff] hover:underline">
                  LegacyPlay case study
                </Link>
                .
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Landing page from ₦100,000 (one offer / one location)</li>
                <li>Local business site from ₦250,000 (pages + booking path)</li>
                <li>50% deposit online · balance before handoff</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[22px] font-semibold text-white">Pair with Google Business</h2>
              <p className="mt-3">
                "Gaming lounge near me" and city searches reward a complete Google Business Profile
                plus a matching website. Guide:{" "}
                <Link href="/local-seo" className="text-[#2997ff] hover:underline">
                  Local SEO for Nigerian SMEs
                </Link>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-6">
            <h2 className="text-[20px] font-semibold text-white">Ready to fill more stations?</h2>
            <p className="mt-2 text-[14px] text-[#a1a1a6]">
              Free 3-minute audit of your current link, or pay a fixed deposit and go live in days.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/hire"
                className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black"
              >
                Fixed-price packages
              </a>
              <a
                href="/free-audit"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Free audit
              </a>
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#25D366]"
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
