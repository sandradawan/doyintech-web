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
  "−": "-",
  "½": "1/2",
  "¼": "1/4",
  "¾": "3/4",
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

const MAPPED = new RegExp(`[${Object.keys(MAP).join("")}]`, "g");

export function pdfSafe(s: string): string {
  return s
    .replace(MAPPED, (c) => MAP[c] ?? "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7e\n\t]/g, "");
}
