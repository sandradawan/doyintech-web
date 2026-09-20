/**
 * Title-aligned ebook chapters from teaching-*.json (unique per book).
 */
import type { EbookChapter } from "@/lib/ebooks";
import teachingA from "./teaching-a.json";
import teachingB from "./teaching-b.json";
import teachingC from "./teaching-c.json";

type TeachingBook = { title: string; body: string }[];

const teaching: Record<string, TeachingBook> = {
  ...(teachingA as Record<string, TeachingBook>),
  ...(teachingB as Record<string, TeachingBook>),
  ...(teachingC as Record<string, TeachingBook>),
};

const cache = new Map<string, EbookChapter[]>();

export function getFullChapters(id: string): EbookChapter[] | undefined {
  if (cache.has(id)) return cache.get(id);
  const rows = teaching[id];
  if (!rows?.length) return undefined;
  const chapters: EbookChapter[] = rows.map((row) => ({
    title: row.title,
    body: row.body,
  }));
  cache.set(id, chapters);
  return chapters;
}

export function wordCountForBook(id: string): number {
  const ch = getFullChapters(id);
  if (!ch) return 0;
  return ch.reduce((n, c) => n + c.body.split(/\s+/).length, 0);
}
