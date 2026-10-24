"use client";

import { GIFT_STORAGE_KEY } from "@/lib/giftcards/shared";

/** Fired when the applied gift card changes, so the pill and checkouts stay in sync. */
export const GIFT_EVENT = "dt:gift-changed";

export function readGiftCode(): string {
  try {
    return localStorage.getItem(GIFT_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function applyGiftCode(code: string | null) {
  try {
    if (code) localStorage.setItem(GIFT_STORAGE_KEY, code);
    else localStorage.removeItem(GIFT_STORAGE_KEY);
  } catch {
    /* storage blocked */
  }
  window.dispatchEvent(new Event(GIFT_EVENT));
}

/** Adds the applied gift card (if any) to a checkout request body. */
export function withGiftCode<T extends Record<string, unknown>>(body: T): T & { giftCode?: string } {
  const giftCode = readGiftCode();
  return giftCode ? { ...body, giftCode } : body;
}
