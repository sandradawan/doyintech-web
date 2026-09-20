/**
 * Unique, title-aligned chapters for every ebook (not a shared template).
 */
import type { EbookChapter } from "@/lib/ebooks";
import a0 from "./teaching-unique-a-0.json";
import a1 from "./teaching-unique-a-1.json";
import b0 from "./teaching-unique-b-0.json";
import b1 from "./teaching-unique-b-1.json";

const teaching: Record<string, EbookChapter[]> = {
  ...(a0 as Record<string, EbookChapter[]>),
  ...(a1 as Record<string, EbookChapter[]>),
  ...(b0 as Record<string, EbookChapter[]>),
  ...(b1 as Record<string, EbookChapter[]>),
};

const cache = new Map<string, EbookChapter[]>();

export function getFullChapters(id: string): EbookChapter[] | undefined {
  if (cache.has(id)) return cache.get(id);
  const rows = teaching[id];
  if (!rows?.length) return undefined;
  cache.set(id, rows);
  return rows;
}

export function wordCountForBook(id: string): number {
  const ch = getFullChapters(id);
  if (!ch) return 0;
  return ch.reduce((n, c) => n + c.body.split(/\s+/).length, 0);
}
