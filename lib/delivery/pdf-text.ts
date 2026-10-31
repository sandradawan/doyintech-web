/**
 * The no-dependency PDF writers use the built-in Helvetica font, which only covers basic Latin.
 * Map common typographic characters to ASCII and drop anything else so PDFs never show garbled bytes.
 */
const MAP: Record<string, string> = {
  "₦": "NGN ",
  "—": " - ",
  "–": "-",
  "‘": "'",
  "’": "'",
  "“": '"',
  "”": '"',
  "…": "...",
  "×": "x",
  "÷": "/",
  "≥": ">=",
  "≤": "<=",
  "•": "-",
  "·": "-",
  "→": "->",
  "☐": "[ ]",
  "✓": "v",
  "€": "EUR ",
  "£": "GBP ",
  " ": " ",
};

export function pdfSafe(s: string): string {
  return s
    .replace(/[₦—–‘’“”…×÷≥≤•·→☐✓€£ ]/g, (c) => MAP[c] ?? "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7e\n\t]/g, "");
}
