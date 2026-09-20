/**
 * Build-safe expand loader.
 * Full unique packs are being restored; catalog still works with base chapters.
 */
import type { EbookChapter } from "@/lib/ebooks";

const TEACHING: Record<string, EbookChapter[]> = {};

const cache = new Map<string, EbookChapter[]>();

export function getFullChapters(id: string): EbookChapter[] | undefined {
  if (cache.has(id)) return cache.get(id);
  const rows = TEACHING[id];
  if (!rows?.length) return undefined;
  cache.set(id, rows);
  return rows;
}

export function wordCountForBook(id: string): number {
  const ch = getFullChapters(id);
  if (!ch) return 0;
  return ch.reduce((n, c) => n + c.body.split(/\s+/).length, 0);
}
