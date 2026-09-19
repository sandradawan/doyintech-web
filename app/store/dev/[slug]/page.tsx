import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { ListingCard, StoreNav } from "@/components/store/StoreShell";
import { getAllPublishedListings } from "@/lib/store/published";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function decodeDevKey(raw: string): string {
  try {
    return decodeURIComponent(raw).replace(/-/g, " ").trim();
  } catch {
    return raw.replace(/-/g, " ").trim();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = decodeDevKey(slug);
  return { title: `${name} · Developer · DoyinStore` };
}

export default async function DeveloperProfilePage({ params }: Props) {
  const { slug } = await params;
  const nameKey = decodeDevKey(slug).toLowerCase();
  const all = await getAllPublishedListings();
  const listings = all.filter(
    (l) =>
      l.developerName.toLowerCase() === nameKey ||
      l.developerName.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );
  const displayName = listings[0]?.developerName || decodeDevKey(slug);

  return (
    <>
      <main className="min-h-screen bg-[#070b12] pt-24 pb-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link href="/store" className="text-[14px] text-[#94a3b8] hover:text-white">
              ← Store
            </Link>
            <StoreNav />
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#0c1220] p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-[#ff8c14]">
              Developer
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{displayName}</h1>
            <p className="mt-2 text-sm text-[#94a3b8]">
              {listings.length} published app{listings.length === 1 ? "" : "s"} on DoyinStore
            </p>
          </div>

          {listings.length === 0 ? (
            <p className="mt-12 text-center text-sm text-[#64748b]">
              No published apps for this developer yet.
            </p>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
