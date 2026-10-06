import type { Ebook } from "./ebooks-data-a";
import { EBOOKS_PART1 } from "./ebooks-data-a";
import { EBOOKS_PART2 } from "./ebooks-data-b";

export type { Ebook, EbookChapter } from "./ebooks-data-a";
export const EBOOKS: Ebook[] = [...EBOOKS_PART1, ...EBOOKS_PART2];
