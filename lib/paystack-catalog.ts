import { DIGITAL_PRODUCTS } from "@/lib/products";
import { PAID_TOOLS } from "@/lib/tools/paid";
import { getAllPublishedListings } from "@/lib/store/published";

export type PayItem = {
  id: string;
  name: string;
  amountKobo: number;
  delivery?: string;
};

export function getPayItem(id: string): PayItem | undefined {
  const product = DIGITAL_PRODUCTS.find((p) => p.id === id);
  if (product) {
    return {
      id: product.id,
      name: product.name,
      amountKobo: product.amountKobo,
      delivery: product.delivery,
    };
  }
  const tool = PAID_TOOLS.find((t) => t.productId === id);
  if (tool) {
    return {
      id: tool.productId,
      name: tool.title + " Unlock",
      amountKobo: tool.amountKobo,
      delivery: "Instant unlock on this browser after payment",
    };
  }

  // DoyinStore listings (slug or id)
  try {
    const listing = getAllPublishedListings().find(
      (l) => l.id === id || l.slug === id
    );
    if (listing && listing.priceNgn > 0) {
      return {
        id: listing.slug,
        name: listing.title,
        amountKobo: listing.amountKobo || listing.priceNgn * 100,
        delivery: "DoyinStore secure download after payment",
      };
    }
  } catch {
    /* ignore */
  }

  return undefined;
}
