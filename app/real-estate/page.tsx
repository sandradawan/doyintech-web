import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import PropertySearch from "@/components/real-estate/PropertySearch";

export const metadata: Metadata = {
  title: "Find homes to rent or buy",
  description:
    "Search houses and apartments by location and type. View photos, walkthrough videos, prices, and contact agents on WhatsApp.",
};

export default function RealEstatePage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/" className="text-[#2997ff] hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/ai" className="text-[#2997ff] hover:underline">
              AI Tools
            </Link>{" "}
            / Real estate
          </p>
          <p className="section-eyebrow mt-4">Real estate · Rent & buy</p>
          <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[42px]">
            Search homes by location & type
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Filter by city or area, property type, and rent or buy. Each listing
            shows photos, walkthrough video when available, price, and the agent&apos;s
            WhatsApp number.
          </p>

          <PropertySearch />

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] leading-relaxed text-[#a1a1a6]">
            <p className="font-semibold text-white">About listing sources</p>
            <p className="mt-2">
              Properties come from the DoyinTech curated catalog (demo + partner
              inventory). We do <strong className="text-white">not</strong> scrape
              Google Maps or Google Search listings — that violates Google&apos;s terms
              and is unreliable. To grow inventory, agents can list with us, or we can
              connect a property CRM / portal feed. Optional Google Places can only
              enrich nearby amenities, not full sale/rent ads.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
