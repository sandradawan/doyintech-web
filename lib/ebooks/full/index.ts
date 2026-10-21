/**
 * Full-book chapter expansions.
 * Lightweight stub so catalog/pricing imports resolve and production builds succeed.
 * Heavy teaching packs can replace this later without changing call sites.
 */
import type { EbookChapter } from "@/lib/ebooks";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub keeps the call-site signature
export function getFullChapters(_bookId: string): EbookChapter[] | undefined {
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub keeps the call-site signature
export function wordCountForBook(_bookId: string): number {
  return 0;
}
