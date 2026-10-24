import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShopClient from "@/components/storefront/ShopClient";
import { canTakePayments, hasActiveDiscounts, isPaidStore, publicStore } from "@/lib/storefront/server";
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
    title: { absolute: `${store.name} | Shop online` },
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

  const [paid, hasCodes] = await Promise.all([isPaidStore(store.owner_email), hasActiveDiscounts(store.id)]);
  const canPay = canTakePayments(store);

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
    <main className="min-h-screen bg-[#f7f7f4] pb-28 text-[#111]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ShopClient
        slug={store.slug}
        storeName={store.name}
        tagline={store.tagline}
        whatsapp={store.whatsapp}
        canPay={canPay}
        zones={store.delivery_zones || []}
        hasCodes={hasCodes}
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price_kobo: p.price_kobo,
          image_url: p.image_url,
          in_stock: p.in_stock,
        }))}
      />

      <footer className="mx-auto mt-20 max-w-[1200px] border-t border-black/[0.06] px-4 pt-8 text-[13px] text-[#777] sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {store.name} ·{" "}
            <Link href="/shops" className="hover:underline">
              More shops
            </Link>
          </p>
          {!paid && (
            <p>
              Powered by{" "}
              <Link href="/stores" className="font-semibold text-[#111] hover:underline">
                DoyinTech Store
              </Link>{" "}
              · Create your own free shop
            </p>
          )}
        </div>
      </footer>
    </main>
  );
}
