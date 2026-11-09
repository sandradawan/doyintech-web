import type { Ebook } from "./ebooks";
import { EBOOKS } from "./ebooks";
import { MORE_EBOOKS } from "./ebooks-more";
import { WAVE3_EBOOKS } from "./ebooks-wave3";
import { LIFE_EBOOKS } from "./ebooks-life";
import { WAVE4_EBOOKS } from "./ebooks-wave4";
import { getFullChapters } from "./ebooks/full";

/** A book shorter than this is not sold: the buy button goes away and checkout refuses it. */
export const MIN_WORDS_TO_SELL = 1000;

export function ebookWords(book: Pick<Ebook, "chapters">): number {
  return book.chapters.reduce((n, ch) => n + ch.body.trim().split(/\s+/).filter(Boolean).length, 0);
}

export function ebookOnSale(book: Pick<Ebook, "chapters">): boolean {
  return ebookWords(book) >= MIN_WORDS_TO_SELL;
}

/** The label always comes from the real text, so a book can never claim more than it holds. */
function withFullBook(book: Ebook): Ebook {
  const chapters = getFullChapters(book.id) ?? book.chapters;
  const words = ebookWords({ chapters });
  const size = words >= 1000 ? `about ${(Math.round(words / 100) * 100).toLocaleString("en-NG")} words` : "being finished";
  return { ...book, chapters, pagesLabel: `${chapters.length} chapters · ${size}` };
}

export const ALL_EBOOKS: Ebook[] = [
  ...WAVE4_EBOOKS,
  ...EBOOKS,
  ...MORE_EBOOKS,
  ...WAVE3_EBOOKS,
  ...LIFE_EBOOKS,
].map(withFullBook);

export function findAnyEbook(idOrSlug: string): Ebook | undefined {
  const key = idOrSlug.trim().toLowerCase();
  return ALL_EBOOKS.find(
    (e) => e.slug.toLowerCase() === key || e.id.toLowerCase() === key
  );
}

export const EBOOK_CATEGORIES = Array.from(
  new Set(ALL_EBOOKS.map((e) => e.category))
).sort();

export function filterEbooks(opts: {
  category?: string;
  query?: string;
}): Ebook[] {
  const q = (opts.query || "").trim().toLowerCase();
  return ALL_EBOOKS.filter((b) => {
    if (opts.category && opts.category !== "All" && b.category !== opts.category) {
      return false;
    }
    if (!q) return true;
    const hay =
      `${b.title} ${b.subtitle} ${b.blurb} ${b.category} ${b.benefits.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}
