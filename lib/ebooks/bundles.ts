import { ALL_EBOOKS } from "@/lib/ebooks-catalog";
import type { Ebook } from "@/lib/ebooks";

/**
 * Ebook bundles: one payment unlocks every book in the pack (online reading and PDF downloads).
 * Books are picked by category, so new ebooks join their pack automatically.
 */
export type EbookBundle = {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  /** null means every ebook. */
  categories: string[] | null;
  priceNgn: number;
  badge?: string;
};

export const EBOOK_BUNDLES: EbookBundle[] = [
  {
    id: "ebook-bundle-complete",
    slug: "complete-library",
    name: "The Complete DoyinTech Library",
    blurb: "Every ebook we publish, now and as new ones are added to the store.",
    categories: null,
    priceNgn: 49_000,
    badge: "Best value",
  },
  {
    id: "ebook-bundle-business",
    slug: "business-owner-pack",
    name: "Business Owner Pack",
    blurb: "Run the business, manage money, sell more and build income that lasts.",
    categories: ["Business", "Finance", "Sales", "Wealth", "Income"],
    priceNgn: 29_000,
  },
  {
    id: "ebook-bundle-marketing",
    slug: "marketing-pack",
    name: "Marketing Pack",
    blurb: "Get found online, write content that sells and turn followers into buyers.",
    categories: ["Marketing"],
    priceNgn: 19_000,
  },
  {
    id: "ebook-bundle-career",
    slug: "career-freelance-pack",
    name: "Career and Freelance Pack",
    blurb: "Get hired, win clients, price your work and get more done with AI.",
    categories: ["Career", "Freelancing", "AI & Productivity", "Productivity"],
    priceNgn: 24_000,
  },
];

export function bundleBooks(bundle: EbookBundle): Ebook[] {
  return bundle.categories ? ALL_EBOOKS.filter((b) => bundle.categories!.includes(b.category)) : ALL_EBOOKS;
}

/** What the books would cost bought one by one. */
export function bundleListPrice(bundle: EbookBundle): number {
  return bundleBooks(bundle).reduce((sum, b) => sum + b.amountKobo / 100, 0);
}

export function findEbookBundle(idOrSlug: string): EbookBundle | undefined {
  return EBOOK_BUNDLES.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
}

/** Smallest bundle containing this ebook other than the complete library, for upsells. */
export function bundleForEbook(ebookId: string): EbookBundle | undefined {
  const book = ALL_EBOOKS.find((b) => b.id === ebookId || b.slug === ebookId);
  if (!book) return undefined;
  return EBOOK_BUNDLES.find((b) => b.categories?.includes(book.category));
}

export function bundleCovers(bundleId: string, ebookId: string): boolean {
  const bundle = findEbookBundle(bundleId);
  if (!bundle) return false;
  return bundleBooks(bundle).some((b) => b.id === ebookId || b.slug === ebookId);
}
