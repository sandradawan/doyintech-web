import { EBOOKS } from "./ebooks";
import { MORE_EBOOKS } from "./ebooks-more";
import type { Ebook } from "./ebooks";

export const ALL_EBOOKS: Ebook[] = [...EBOOKS, ...MORE_EBOOKS];

export function findAnyEbook(idOrSlug: string): Ebook | undefined {
  return ALL_EBOOKS.find((e) => e.slug === idOrSlug || e.id === idOrSlug);
}
