/**
 * The full text of each ebook, by book id. A book with no entry here uses the chapters in its
 * catalogue record, and lib/ebooks-catalog.ts refuses to sell anything without enough words.
 */
import type { EbookChapter } from "@/lib/ebooks";
import { WRITTEN_1 } from "./written-1";
import { WRITTEN_2 } from "./written-2";
import { WRITTEN_3 } from "./written-3";
import { WRITTEN_4 } from "./written-4";
import { WRITTEN_5 } from "./written-5";
import { WRITTEN_6 } from "./written-6";

const BOOKS: Record<string, EbookChapter[]> = {
  ...WRITTEN_1,
  ...WRITTEN_2,
  ...WRITTEN_3,
  ...WRITTEN_4,
  ...WRITTEN_5,
  ...WRITTEN_6,
};

export function getFullChapters(bookId: string): EbookChapter[] | undefined {
  return BOOKS[bookId];
}

export function wordCountForBook(bookId: string): number {
  return (BOOKS[bookId] ?? []).reduce((n, ch) => n + ch.body.trim().split(/\s+/).length, 0);
}
