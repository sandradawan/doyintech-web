import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { StoreBrowse, StoreNav } from "@/components/store/StoreShell";
import { STORE_CATEGORIES } from "@/lib/store/catalog";
import { getAllPublishedListings } from "@/lib/store/published";

export const metadata: Metadata = {
  title: "DoyinStore — Apps & Digital Products",
  description:
    "Discover reviewed Android, desktop apps and digital products. Pay, auto-download, install with your permission.",
};

export const dynamic = "force-dynamic";

export default function StorePage() {
  const listings = getAllPublishedListings();

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pt-24 pb-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
                DoyinStore
              </p>
              <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[42px]">
                Apps & digital products
              </h1>
              <p className="mt-2 max-w-xl text-[15px] text-[#a1a1a6]">
                Reviewed listings for developers and buyers — security pipeline before publish.
              </p>
            </div>
            <StoreNav />
          </div>

          <div className="mt-12">
            <StoreBrowse listings={listings} categories={STORE_CATEGORIES} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
