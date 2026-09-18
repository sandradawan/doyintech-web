import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Website for a Restaurant in Nigeria — Menu, Location & WhatsApp",
  description:
    "What restaurants and cafes need online: menu highlights, hours, Maps, and one-tap WhatsApp orders or reservations. Fixed-price sites from ₦100k.",
};

export default function RestaurantWebsitePage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <article className="mx-auto max-w-[720px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Local business · Food
          </p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[40px]">
            Website for a restaurant in Nigeria
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">
            Hungry customers search "restaurant near me" and check Instagram. A simple site with
            menu, hours, location, and WhatsApp closes the gap between discovery and a table or
            order.
          </p>
          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-[#c7cdd8]">
            <section>
              <h2 className="text-[22px] font-semibold text-white">Must-have pages</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Hero with cuisine + area (e.g. "Grills · Jos")</li>
                <li>Menu highlights or full menu PDF link</li>
                <li>Hours, address, Google Maps embed</li>
                <li>WhatsApp for reservations / bulk orders</li>
                <li>Photos of food and the space — real, not stock</li>
              </ul>
            </section>
            <section>
              <h2 className="text-[22px] font-semibold text-white">Fixed-price options</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Landing page ₦100,000 — one location, one clear CTA</li>
                <li>Local business site ₦250,000 — menu, about, contact</li>
                <li>50% deposit · balance before handoff</li>
              </ul>
            </section>
          </div>
          <div className="mt-12 rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-6">
            <h2 className="text-[20px] font-semibold text-white">Fill more tables</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/hire" className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black">Packages</a>
              <a href="/free-audit" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">Free audit</a>
              <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#25D366]">WhatsApp</a>
            </div>
            <p className="mt-4 text-[13px] text-[#86868b]">Also see <Link href="/local-seo" className="text-[#2997ff]">Google Business + local SEO</Link>.</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
