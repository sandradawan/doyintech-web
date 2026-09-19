import type { Ebook } from "./ebooks";
import { EBOOKS } from "./ebooks";
import { MORE_EBOOKS } from "./ebooks-more";
import { WAVE3_EBOOKS } from "./ebooks-wave3";
import { LIFE_EBOOKS } from "./ebooks-life";

/**
 * Catalog is pure data — no Node fs/path.
 * Full chapter expansions live in each source file / LIFE_EBOOKS.
 * Avoids Vercel client-bundle failures from fs imports.
 */
export const ALL_EBOOKS: Ebook[] = [
  ...EBOOKS,
  ...MORE_EBOOKS,
  ...WAVE3_EBOOKS,
  ...LIFE_EBOOKS,
];

export function findAnyEbook(idOrSlug: string): Ebook | undefined {
  const key = idOrSlug.trim().toLowerCase();
  return ALL_EBOOKS.find(
    (e) =>
      e.slug.toLowerCase() === key ||
      e.id.toLowerCase() === key
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
