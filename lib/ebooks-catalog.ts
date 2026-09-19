import { EBOOKS, type Ebook } from "./ebooks";
import { MORE_EBOOKS } from "./ebooks-more";
import { WAVE3_EBOOKS } from "./ebooks-wave3";
import { LIFE_EBOOKS } from "./ebooks-life";
import fs from "fs";
import path from "path";

type Ch = { title: string; body: string; imageCaption?: string };

function loadChapterMap(): Record<string, Ch[]> {
  const map: Record<string, Ch[]> = {};
  const dir = path.join(process.cwd(), "public");
  for (const name of [
    "ebook-chapters.json",
    "ebook-chapters-a.json",
    "ebook-chapters-b.json",
    "ebook-chapters-c.json",
  ]) {
    try {
      const p = path.join(dir, name);
      if (!fs.existsSync(p)) continue;
      const data = JSON.parse(fs.readFileSync(p, "utf8")) as Record<string, Ch[]>;
      Object.assign(map, data);
    } catch {
      /* ignore */
    }
  }
  return map;
}

const CHAPTER_MAP = loadChapterMap();

function withFullChapters(book: Ebook): Ebook {
  const full = CHAPTER_MAP[book.id];
  if (!full || !full.length) return book;
  return {
    ...book,
    pagesLabel: `Full guide · ${full.length} chapters`,
    chapters: full.map((ch) => ({
      title: ch.title,
      body: ch.body,
      imageCaption: ch.imageCaption,
    })),
  };
}

export const ALL_EBOOKS: Ebook[] = [
  ...EBOOKS,
  ...MORE_EBOOKS,
  ...WAVE3_EBOOKS,
  ...LIFE_EBOOKS,
].map(withFullChapters);

export function findAnyEbook(idOrSlug: string): Ebook | undefined {
  return ALL_EBOOKS.find((e) => e.slug === idOrSlug || e.id === idOrSlug);
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
    if (opts.category && opts.category !== "All" && b.category !== opts.category)
      return false;
    if (!q) return true;
    const hay = `${b.title} ${b.subtitle} ${b.blurb} ${b.category} ${b.benefits.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}
