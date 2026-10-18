import { DIGITAL_PRODUCTS } from "@/lib/products";
import { PAID_TOOLS } from "@/lib/tools/paid";
import { getAllPublishedListings } from "@/lib/store/published";
import { findAnyEbook } from "@/lib/ebooks-catalog";
import { UI_COMPONENTS } from "@/lib/ui-components";
import { PAGE_TEMPLATES } from "@/lib/page-templates";
import { getServiceOffer } from "@/lib/service-offers";
import { getStudentPackage } from "@/lib/students/packages";
import { resolveAmountKobo } from "@/lib/pricing/overrides";

export type PayItem = {
  id: string;
  name: string;
  amountKobo: number;
  delivery?: string;
};

function basePayItem(id: string): PayItem | undefined {
  const service = getServiceOffer(id);
  if (service) {
    return {
      id: service.id,
      name: `${service.name} — ${service.depositNgn} deposit`,
      amountKobo: service.amountKobo,
      delivery: service.delivery,
    };
  }

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

  const ebook = findAnyEbook(id);
  if (ebook) {
    return {
      id: ebook.id,
      name: ebook.title + " (Ebook)",
      amountKobo: ebook.amountKobo,
      delivery: "Full ebook unlock on site + illustrated PDF",
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

  const tpl = PAGE_TEMPLATES.find((t) => t.id === id || t.slug === id);
  if (tpl) {
    return {
      id: tpl.id,
      name: tpl.name + " (Template)",
      amountKobo: tpl.amountKobo,
      delivery: "Full template source unlock on site after payment",
    };
  }

  const student = getStudentPackage(id);
  if (student) {
    return {
      id: student.id,
      name: student.name,
      amountKobo: student.amountKobo,
      delivery: "Student project payment",
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

/** Resolve Paystack item; applies admin pricing overrides when configured. */
export async function getPayItem(id: string): Promise<PayItem | undefined> {
  const item = basePayItem(id);
  if (!item) return undefined;
  try {
    const overrideKobo = await resolveAmountKobo(id);
    if (overrideKobo != null && overrideKobo >= 0) {
      return { ...item, amountKobo: overrideKobo };
    }
  } catch {
    /* fall through to default */
  }
  return item;
}

/** Sync fallback for non-async call sites (uses code defaults only). */
export function getPayItemSync(id: string): PayItem | undefined {
  return basePayItem(id);
}
