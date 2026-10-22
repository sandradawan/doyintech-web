import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShopClient from "@/components/storefront/ShopClient";
import { canTakePayments, isPaidStore, publicStore } from "@/lib/storefront/server";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Seller edits show up within half a minute without rebuilding the site.
export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await publicStore(slug);
  if (!data) return { title: "Shop not found", robots: { index: false } };
  const { store, products } = data;
  const description =
    store.tagline || `Shop ${products.length} products from ${store.name}. Order on WhatsApp or pay online.`;
  return {
    title: `${store.name} — Shop online`,
    description,
    alternates: { canonical: `/s/${store.slug}` },
    openGraph: {
      title: store.name,
      description,
      url: `/s/${store.slug}`,
      images: products.find((p) => p.image_url)?.image_url ? [products.find((p) => p.image_url)!.image_url!] : undefined,
    },
  };
}

export default async function ShopPage({ params }: Props) {
  const { slug } = await params;
  const data = await publicStore(slug);
  if (!data) notFound();
  const { store, products } = data;

  const [paid, canPay] = await Promise.all([isPaidStore(store.owner_email), canTakePayments(store)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store.name,
    description: store.tagline || undefined,
    url: absoluteUrl(`/s/${store.slug}`),
    makesOffer: products.map((p) => ({
      "@type": "Offer",
      price: (p.price_kobo / 100).toFixed(2),
      priceCurrency: "NGN",
      availability: p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemOffered: {
        "@type": "Product",
        name: p.name,
        description: p.description || undefined,
        image: p.image_url || undefined,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#0a0e17] pb-32 pt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-[1000px] px-5">
        <header className="text-center">
          <h1 className="text-[30px] font-semibold tracking-tight text-white sm:text-[38px]">{store.name}</h1>
          {store.tagline && <p className="mx-auto mt-2 max-w-xl text-[16px] text-[#a1a1a6]">{store.tagline}</p>}
          <a
            href={`https://wa.me/${store.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full border border-[#25D366]/50 bg-[#25D366]/10 px-4 py-2 text-[13px] font-semibold text-[#25D366]"
          >
            Chat on WhatsApp
          </a>
        </header>

        <ShopClient
          slug={store.slug}
          storeName={store.name}
          whatsapp={store.whatsapp}
          canPay={canPay}
          products={products.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price_kobo: p.price_kobo,
            image_url: p.image_url,
            in_stock: p.in_stock,
          }))}
        />

        {!paid && (
          <p className="mt-16 text-center text-[12px] text-[#86868b]">
            Powered by{" "}
            <Link href="/stores" className="text-[#ff8c14] hover:underline">
              DoyinTech Store
            </Link>{" "}
            — create your own free shop
          </p>
        )}
      </div>
    </main>
  );
}
