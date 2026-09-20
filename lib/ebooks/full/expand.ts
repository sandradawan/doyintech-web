/**
 * Unique, title-aligned chapters for every ebook (not a shared template).
 */
import type { EbookChapter } from "@/lib/ebooks";
import teachingA from "./teaching-unique-a.json";
import teachingB from "./teaching-unique-b.json";

const teaching: Record<string, EbookChapter[]> = {
  ...(teachingA as Record<string, EbookChapter[]>),
  ...(teachingB as Record<string, EbookChapter[]>),
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
