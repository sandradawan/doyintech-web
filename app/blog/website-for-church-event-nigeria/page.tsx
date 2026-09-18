import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Website for a Church or Event Centre in Nigeria",
  description:
    "Service times, location, giving links, event bookings via WhatsApp. Fixed-price websites for churches and event centres.",
};

export default function ChurchEventWebsitePage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <article className="mx-auto max-w-[720px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Community · Events
          </p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[40px]">
            Website for a church or event centre
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">
            Visitors and members need service times, location, and a clear way to ask about
            programmes or hall bookings — not a dead Facebook page.
          </p>
          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[#c7cdd8]">
            <section>
              <h2 className="text-[22px] font-semibold text-white">What to put online</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Service / opening times</li>
                <li>Address + Maps</li>
                <li>Upcoming programmes or hall packages</li>
                <li>WhatsApp for enquiries and bookings</li>
                <li>Optional giving or payment link (you control)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[22px] font-semibold text-white">Packages</h2>
              <p className="mt-3">
                Landing page from ₦100,000 or multi-page local site from ₦250,000 — fixed scope, 50%
                deposit. See <Link href="/hire" className="text-[#2997ff]">/hire</Link>.
              </p>
            </section>
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <a href="/hire" className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black">Hire us</a>
            <a href="/free-audit" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">Free audit</a>
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#25D366]">WhatsApp</a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
