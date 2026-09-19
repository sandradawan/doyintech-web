import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { StoreBrowse, StoreNav } from "@/components/store/StoreShell";
import { STORE_CATEGORIES } from "@/lib/store/catalog";
import { getAllPublishedListings } from "@/lib/store/published";

export const metadata: Metadata = {
  title: "DoyinStore — Apps & Digital Products",
  description:
    "Discover security-reviewed apps and digital products. Free developer registration. Global marketplace by DoyinTech.",
};

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const listings = await getAllPublishedListings();
  const approved = listings.filter((l) => l.reviewStatus === "approved");

  return (
    <>
      <main className="min-h-screen bg-[#070b12] pt-20 pb-24">
        <section className="relative overflow-hidden border-b border-white/[0.06]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,140,20,0.12),_transparent_55%)]" />
          <div className="relative mx-auto max-w-[1100px] px-6 pb-14 pt-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-2xl">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">
                  DoyinStore
                </p>
                <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[44px] sm:leading-[1.1]">
                  Apps built for real work.
                  <span className="block text-[#94a3b8]">Reviewed before they ship.</span>
                </h1>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#94a3b8]">
                  A professional marketplace for independent developers and digital products.
                  Every listing passes security review. Publish free after admin approval.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/store/auth"
                    className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#ffa03a]"
                  >
                    Developer login / register
                  </Link>
                  <Link
                    href="/store/security"
                    className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-[#cbd5e1] transition hover:border-white/30 hover:text-white"
                  >
                    Security pipeline
                  </Link>
                </div>
              </div>
              <StoreNav />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { n: String(approved.length), l: "Published apps" },
                { n: "Review", l: "Before every publish" },
                { n: "Free", l: "Developer registration" },
                { n: "Global", l: "NGN + international" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3"
                >
                  <p className="text-lg font-semibold text-white">{s.n}</p>
                  <p className="text-[12px] text-[#64748b]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1100px] px-6 pt-14">
          <div className="mb-8">
            <h2 className="text-[22px] font-semibold text-white">Catalog</h2>
            <p className="mt-1 text-[14px] text-[#64748b]">Only approved listings appear here.</p>
          </div>
          <StoreBrowse listings={approved} categories={STORE_CATEGORIES} />
        </section>
      </main>
      <Footer />
    </>
  );
}
