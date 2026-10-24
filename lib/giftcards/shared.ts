/** DoyinTech gift cards: constants and pure helpers shared by server and browser. */

export const GIFT_PRESETS_KOBO = [500_000, 1_000_000, 2_500_000, 5_000_000] as const;
export const GIFT_MIN_KOBO = 200_000; // ₦2,000
export const GIFT_MAX_KOBO = 50_000_000; // ₦500,000
export const GIFT_VALID_YEARS = 3;

export const GIFT_DESIGNS = [
  { id: "classic", label: "Classic", from: "#ff8c14", to: "#c2410c", ink: "#111111" },
  { id: "celebrate", label: "Celebrate", from: "#7c3aed", to: "#db2777", ink: "#ffffff" },
  { id: "thanks", label: "Thank you", from: "#059669", to: "#0f766e", ink: "#ffffff" },
  { id: "midnight", label: "Midnight", from: "#1f2937", to: "#0b0d13", ink: "#ffffff" },
] as const;
export type GiftDesignId = (typeof GIFT_DESIGNS)[number]["id"];

export function giftDesign(id: string | null | undefined) {
  return GIFT_DESIGNS.find((d) => d.id === id) || GIFT_DESIGNS[0];
}

/** 32 symbols with no 0/O/1/I so codes are easy to read aloud and type. 16 symbols = 80 bits. */
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_LENGTH = 16;

/** Uppercases and strips spaces/dashes. Returns "" if it can't be a valid code. */
export function normalizeGiftCode(input: string): string {
  const s = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (s.length !== CODE_LENGTH) return "";
  for (const ch of s) if (!CODE_ALPHABET.includes(ch)) return "";
  return s;
}

export function formatGiftCode(code: string): string {
  return code.replace(/(.{4})(?=.)/g, "$1-");
}

export function naira(kobo: number): string {
  return "₦" + Math.round(kobo / 100).toLocaleString("en-NG");
}

/** Browser storage key for a card the visitor has applied; every checkout sends it. */
export const GIFT_STORAGE_KEY = "dt_gift_code";
