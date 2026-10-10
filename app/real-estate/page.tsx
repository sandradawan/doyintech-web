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
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-eyebrow">Real estate · Rent & buy</p>
              <h1 className="mt-3 font-display text-[34px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[42px]">
                Search homes by location & type
              </h1>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
                Filter by city or area, property type, and rent or buy. Each listing
                shows photos, walkthrough video when available, price, and agent WhatsApp.
              </p>
            </div>
            <Link
              href="/real-estate/list"
              className="shrink-0 rounded-full bg-[#25D366] px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              List your property
            </Link>
          </div>

          <PropertySearch />

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-[13px] leading-relaxed text-[#a1a1a6]">
            <p className="font-semibold text-white">Listing sources</p>
            <p className="mt-2">
              Demo catalog plus agent submissions approved in the DoyinTech CRM
              (Admin → Properties). We do not scrape Google Maps.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
