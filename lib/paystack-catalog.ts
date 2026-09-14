import { DIGITAL_PRODUCTS } from "@/lib/products";
import { PAID_TOOLS } from "@/lib/tools/paid";
import { getAllPublishedListings } from "@/lib/store/published";
import { EBOOKS } from "@/lib/ebooks";
import { UI_COMPONENTS } from "@/lib/ui-components";

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

  const ebook = EBOOKS.find((e) => e.id === id || e.slug === id);
  if (ebook) {
    return {
      id: ebook.id,
      name: ebook.title + " (Ebook)",
      amountKobo: ebook.amountKobo,
      delivery: "Full ebook unlock on site + PDF on request",
    };
  }

  const comp = UI_COMPONENTS.find((c) => c.id === id || c.slug === id);
  if (comp) {
    return {
      id: comp.id,
      name: comp.name + " (Component)",
      amountKobo: comp.amountKobo,
      delivery: "Full source code unlock on site after payment",
    };
  }

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
