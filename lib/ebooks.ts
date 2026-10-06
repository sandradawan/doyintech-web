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

export { EBOOKS } from "./ebooks-data";
import { EBOOKS as _EBOOKS } from "./ebooks-data";

export function getEbook(slug: string): Ebook | undefined {
  return _EBOOKS.find((e) => e.slug === slug);
}

/** Public display: USD (Paystack still charges NGN via amountKobo). */
export function formatEbookPrice(n: number): string {
  return formatUsdFromNgn(Number(n) || 0);
}
