import type { Ebook } from "./ebooks";
import { EBOOKS } from "./ebooks";
import { MORE_EBOOKS } from "./ebooks-more";
import { WAVE3_EBOOKS } from "./ebooks-wave3";
import { LIFE_EBOOKS } from "./ebooks-life";
import { getFullChapters } from "./ebooks/full";

/**
 * Catalog merges base metadata with full ~12k-word chapter packs.
 * No Node fs — safe for Vercel.
 */
function withFullBook(book: Ebook): Ebook {
  const chapters = getFullChapters(book.id);
  if (!chapters?.length) return book;
  const words = chapters.reduce((n, ch) => n + ch.body.split(/\s+/).length, 0);
  return {
    ...book,
    pagesLabel: `Full book · ~${Math.round(words / 1000)}k words · ${chapters.length} chapters`,
    chapters,
  };
}

export const ALL_EBOOKS: Ebook[] = [
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
