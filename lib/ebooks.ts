import { formatUsdFromNgn } from "@/lib/currency";
import { EBOOKS, type Ebook } from "./ebooks-data";

export type { Ebook, EbookChapter } from "./ebooks-data";
export { EBOOKS } from "./ebooks-data";

export function getEbook(slug: string): Ebook | undefined {
  return EBOOKS.find((e) => e.slug === slug);
}

/** Public display: USD (Paystack still charges NGN via amountKobo). */
export function formatEbookPrice(n: number): string {
  return formatUsdFromNgn(Number(n) || 0);
}
