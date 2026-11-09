/**
 * Strip paid content before catalog items cross into client components.
 * Anything passed as a prop to a "use client" component is shipped to every visitor,
 * so pages must pass these public shapes; full content comes from /api/unlock.
 */
import type { Ebook } from "@/lib/ebooks";
import { ebookOnSale } from "@/lib/ebooks-catalog";
import type { UiComponentPack } from "@/lib/ui-components";
import type { PageTemplate } from "@/lib/page-templates";

const FREE_EBOOK_CHAPTERS = 1;

export type PublicEbook = Ebook & { totalChapters: number; onSale: boolean };

export function publicEbook(book: Ebook): PublicEbook {
  return {
    ...book,
    chapters: book.chapters.slice(0, FREE_EBOOK_CHAPTERS),
    totalChapters: book.chapters.length,
    onSale: ebookOnSale(book),
  };
}

export function publicComponent(item: UiComponentPack): UiComponentPack {
  return { ...item, fullCode: "" };
}

export function publicTemplate(item: PageTemplate): PageTemplate {
  return { ...item, fullCode: "", fullGuide: "" };
}
