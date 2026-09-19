import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { HeroCarousel, StoreBrowse, StoreNav } from "@/components/store/StoreShell";
import { STORE_CATEGORIES } from "@/lib/store/catalog";
import { getAllPublishedListings } from "@/lib/store/published";

export const metadata: Metadata = {
  title: "DoyinStore — Apps & Digital Products",
  description:
    "Discover security-reviewed apps and digital products. Free developer registration.",
};

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const listings = await getAllPublishedListings();
  const approved = listings.filter((l) => l.reviewStatus === "approved");

  return (
    <>
      <main className="min-h-screen bg-[#070b12] pt-20 pb-20">
        {/* Top bar */}
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 pb-6">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">
              DoyinStore
            </p>
            <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-white sm:text-[26px]">
              Apps for real work
            </h1>
          </div>
          <StoreNav />
        </div>

        {/* Hero carousel */}
        <section className="mx-auto max-w-[1100px] px-6">
          <HeroCarousel listings={approved} />
        </section>

        {/* Catalog */}
        <section className="mx-auto max-w-[1100px] px-6 pt-14">
          <div className="mb-6">
            <h2 className="text-[18px] font-semibold text-white">All apps</h2>
            <p className="mt-0.5 text-[13px] text-[#64748b]">
              Security-reviewed · Only approved listings
            </p>
          </div>
          <StoreBrowse listings={approved} categories={STORE_CATEGORIES} />
        </section>

        {/* Minimal footer CTA */}
        <section className="mx-auto max-w-[1100px] px-6 pt-16">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0c1220] px-6 py-8 text-center">
            <p className="text-[15px] text-[#94a3b8]">
              Independent developer? List your app free after a short review.
            </p>
            <Link
              href="/store/auth"
              className="mt-4 inline-block text-[14px] font-semibold text-[#ff8c14] hover:underline"
            >
              Register as developer →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
