/**
 * UNIQUE title-aligned chapters for each ebook title.
 */
import type { EbookChapter } from "@/lib/ebooks";
import { PART0 } from "./teaching-p0";
import { PART1 } from "./teaching-p1";
import { PART2 } from "./teaching-p2";
import { PART3 } from "./teaching-p3";

const TEACHING: Record<string, EbookChapter[]> = {
  ...PART0,
  ...PART1,
  ...PART2,
  ...PART3,
};

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
