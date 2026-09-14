import { EBOOKS, type Ebook } from "@/lib/ebooks";

export function findEbookByProductId(productId: string): Ebook | undefined {
  return EBOOKS.find((e) => e.id === productId || e.slug === productId);
}

/** Plain-text / markdown body of the full ebook for download or email. */
export function formatEbookDocument(book: Ebook): string {
  const lines: string[] = [
    book.title.toUpperCase(),
    book.subtitle,
    `By ${book.author}`,
    `Category: ${book.category}`,
    "",
    "— DoyinTech Press —",
    "https://doyintech.vercel.app/ebooks",
    "",
    book.blurb,
    "",
    "WHAT YOU GET",
    ...book.benefits.map((b) => `• ${b}`),
    "",
    "========================================",
    "",
  ];

  for (const ch of book.chapters) {
    lines.push(ch.title, "", ch.body, "", "----------------------------------------", "");
  }

  lines.push(
    "",
    "Thank you for your purchase.",
    "Support: doyintechnology@outlook.com | WhatsApp +234 808 534 3926",
    "© DoyinTech — for personal use of the purchaser."
  );

  return lines.join("\n");
}

export function ebookFilename(book: Ebook): string {
  return `${book.slug}-doyintech.txt`;
}
