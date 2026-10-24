import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { listShops } from "@/lib/storefront/directory";
import { STORE_CATEGORIES, categorySlug, formatKobo } from "@/lib/storefront/shared";
import { absoluteUrl } from "@/lib/site";

type Props = { searchParams: Promise<{ q?: string; category?: string; city?: string }> };

// Directory changes as sellers add products or buy placement; refresh every few minutes.
export const revalidate = 300;

const TITLE = "Shop from Nigerian small businesses online";
const DESCRIPTION =
  "Browse shops selling fashion, food, beauty, gadgets and more. Order on WhatsApp or pay securely online, straight from the seller.";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, q, city } = await searchParams;
  const cat = STORE_CATEGORIES.find((c) => categorySlug(c) === category);
  const title = cat ? `${cat} shops in Nigeria` : TITLE;
  return {
    title,
    description: DESCRIPTION,
    alternates: { canonical: cat ? `/shops?category=${categorySlug(cat)}` : "/shops" },
    // Search and city results are endless combinations; keep them out of the index.
    robots: q || city ? { index: false, follow: true } : undefined,
    openGraph: { title, description: DESCRIPTION, url: "/shops" },
  };
}

export default async function ShopsPage({ searchParams }: Props) {
  const { q = "", category = "", city = "" } = await searchParams;
  const cat = STORE_CATEGORIES.find((c) => categorySlug(c) === category);
  const shops = await listShops({ q, category: cat, city });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: cat ? `${cat} shops` : "DoyinTech shops",
    itemListElement: shops.slice(0, 50).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/s/${s.slug}`),
      name: s.name,
    })),
  };

  const href = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ ...(q && { q }), ...(category && { category }), ...(city && { city }), ...patch });
    for (const [k, v] of [...p.entries()]) if (!v) p.delete(k);
    const s = p.toString();
    return s ? `/shops?${s}` : "/shops";
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">DoyinTech Shops</p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">
            {cat ? `${cat} shops` : "Shop from small businesses"}
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] text-[#a1a1a6]">{DESCRIPTION}</p>

          <form action="/shops" className="mt-8 flex flex-col gap-2 sm:flex-row">
            {category && <input type="hidden" name="category" value={category} />}
            <input
              name="q"
              defaultValue={q}
              placeholder="What are you looking for?"
              aria-label="Search shops"
              className="min-w-0 flex-1 rounded-full border border-white/15 bg-black/40 px-5 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]"
            />
            <input
              name="city"
              defaultValue={city}
              placeholder="City"
              aria-label="City"
              className="rounded-full border border-white/15 bg-black/40 px-5 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14] sm:w-44"
            />
            <button type="submit" className="rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black">
              Search
            </button>
          </form>

          <nav aria-label="Categories" className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <Link
              href={href({ category: "" })}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] ${!cat ? "bg-white text-black" : "border border-white/15 text-[#c7cdd8] hover:border-white/30"}`}
            >
              All
            </Link>
            {STORE_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={href({ category: categorySlug(c) })}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] ${cat === c ? "bg-white text-black" : "border border-white/15 text-[#c7cdd8] hover:border-white/30"}`}
              >
                {c}
              </Link>
            ))}
          </nav>

          {shops.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
              <p className="text-[17px] font-semibold text-white">No shops match yet</p>
              <p className="mt-2 text-[14px] text-[#a1a1a6]">
                {q || city || cat ? "Try another search or category." : "Shops appear here once they add products."}
              </p>
              <Link href="/stores" className="mt-5 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
                Open your own shop free
              </Link>
            </div>
          ) : (
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/s/${s.slug}`}
                    className={`group block overflow-hidden rounded-2xl border bg-[#141a28] transition hover:-translate-y-0.5 hover:border-white/25 ${
                      s.sponsored ? "border-[#ff8c14]/40" : "border-white/10"
                    }`}
                  >
                    <div className="grid aspect-[3/2] grid-cols-3 grid-rows-2 gap-0.5 bg-black/40">
                      {[0, 1, 2].map((i) =>
                        s.images[i] ? (
                          <div key={i} className={`relative ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                            <Image src={s.images[i]} alt="" fill sizes="(max-width: 640px) 66vw, 240px" className="object-cover" />
                          </div>
                        ) : (
                          <div key={i} className={`bg-white/[0.03] ${i === 0 ? "col-span-2 row-span-2" : ""}`} />
                        )
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="truncate text-[16px] font-semibold text-white">{s.name}</h2>
                        {s.sponsored && (
                          <span className="shrink-0 rounded-full bg-[#ff8c14]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#ffb366]">
                            Sponsored
                          </span>
                        )}
                      </div>
                      {s.tagline && <p className="mt-1 line-clamp-2 text-[13px] text-[#a1a1a6]">{s.tagline}</p>}
                      <p className="mt-3 text-[12px] text-[#86868b]">
                        {[s.category, s.city, `${s.productCount} product${s.productCount === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}
                        {s.fromKobo !== null && <span className="text-white"> · from {formatKobo(s.fromKobo)}</span>}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <section className="mt-16 grid gap-4 rounded-2xl border border-white/10 bg-[#141a28] p-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="text-[18px] font-semibold text-white">Sell here</h2>
              <p className="mt-1 text-[14px] text-[#a1a1a6]">
                Open a free shop in two minutes and get listed. Want more buyers? Feature your shop at the top from ₦2,000 a week.
              </p>
            </div>
            <Link href="/stores" className="inline-flex justify-center rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
              Open a free shop
            </Link>
          </section>
          <p className="mt-6 text-[12px] text-[#6e6e73]">
            Shops are run by independent sellers. Sponsored shops paid to be shown first. Payments go directly to each seller.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
