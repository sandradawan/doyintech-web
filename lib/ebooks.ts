import { formatUsdFromNgn } from "@/lib/currency";

export type EbookChapter = {
  title: string;
  body: string;
  image?: string;
  imageCaption?: string;
};

export type Ebook = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  priceNgn: number;
  amountKobo: number;
  pagesLabel: string;
  category: string;
  coverFrom: string;
  coverTo: string;
  accent: string;
  icon: string;
  coverImage: string;
  blurb: string;
  benefits: string[];
  chapters: EbookChapter[];
  badge?: string;
};

/** Re-export catalog helpers — full chapter content lives in ebooks + wave files via catalog */
export { EBOOKS } from "./ebooks-data";

export function getEbook(slug: string): Ebook | undefined {
  // Lazy: catalog owns full list; keep type-only path for imports
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ALL_EBOOKS } = require("./ebooks-catalog") as {
      ALL_EBOOKS: Ebook[];
    };
    return ALL_EBOOKS.find((e) => e.slug === slug);
  } catch {
    return undefined;
  }
}

/** Public display: USD (Paystack still charges NGN via amountKobo). */
export function formatEbookPrice(n: number): string {
  return formatUsdFromNgn(Number(n) || 0);
}
