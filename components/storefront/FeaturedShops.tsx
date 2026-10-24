import Image from "next/image";
import Link from "next/link";
import { listFeaturedShops } from "@/lib/storefront/directory";
import { formatKobo } from "@/lib/storefront/shared";

/** Sponsored shops strip. Renders nothing when no shop is currently featured. */
export default async function FeaturedShops({ title = "Featured shops" }: { title?: string }) {
  const shops = await listFeaturedShops(6).catch(() => []);
  if (!shops.length) return null;
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">Shop small</p>
          <h2 className="mt-1 text-[26px] font-semibold tracking-tight text-white">{title}</h2>
        </div>
        <div className="flex gap-4 text-[14px]">
          <Link href="/shops" className="text-[#ff8c14] hover:underline">
            Browse all shops
          </Link>
          <Link href="/get-featured" className="text-[#a1a1a6] hover:text-white">
            Feature your shop
          </Link>
        </div>
      </div>
      <ul className="-mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {shops.map((s) => (
          <li key={s.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
            <Link href={`/s/${s.slug}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#141a28] transition hover:border-white/25">
              <div className="relative aspect-[4/3] bg-black/40">
                {s.images[0] && <Image src={s.images[0]} alt="" fill sizes="(max-width: 640px) 72vw, 340px" className="object-cover transition duration-500 group-hover:scale-[1.03]" />}
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#ffb366]">Sponsored</span>
              </div>
              <div className="p-4">
                <p className="truncate text-[15px] font-semibold text-white">{s.name}</p>
                <p className="mt-0.5 truncate text-[12px] text-[#86868b]">
                  {[s.category, s.city].filter(Boolean).join(" · ") || `${s.productCount} products`}
                  {s.fromKobo !== null && <span className="text-[#c7cdd8]"> · from {formatKobo(s.fromKobo)}</span>}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
