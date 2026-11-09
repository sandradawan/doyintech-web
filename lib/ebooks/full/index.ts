/**
 * The full text of each ebook, by book id. A book with no entry here uses the chapters in its
 * catalogue record, and lib/ebooks-catalog.ts refuses to sell anything without enough words.
 */
import type { EbookChapter } from "@/lib/ebooks";
import { EXTRA_CHAPTERS } from "./extras";
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

/** Puts a book's extra chapters before its closing plan and renumbers every chapter title. */
export function withExtraChapters(bookId: string, chapters: EbookChapter[]): EbookChapter[] {
  const extras = EXTRA_CHAPTERS[bookId];
  if (!extras?.length || !chapters.length) return chapters;
  const merged = [...chapters.slice(0, -1), ...extras, chapters[chapters.length - 1]];
  return merged.map((ch, i) => ({ ...ch, title: `${i + 1}. ${ch.title.replace(/^\d+\.\s*/, "")}` }));
}

export function wordCountForBook(bookId: string): number {
  return (BOOKS[bookId] ?? []).reduce((n, ch) => n + ch.body.trim().split(/\s+/).length, 0);
}
