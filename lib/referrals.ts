/** Client + server helpers for referral codes */

export const REFERRAL_STORAGE_KEY = "doyintech_ref";

export function normalizeReferralCode(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

export function saveReferralCode(code: string) {
  if (typeof window === "undefined") return;
  const n = normalizeReferralCode(code);
  if (!n) return;
  try {
    localStorage.setItem(REFERRAL_STORAGE_KEY, n);
  } catch {
    /* ignore */
  }
}

export function readReferralCode(): string {
  if (typeof window === "undefined") return "";
  try {
    return normalizeReferralCode(localStorage.getItem(REFERRAL_STORAGE_KEY));
  } catch {
    return "";
  }
}

/** Build share link for a referrer code */
export function referralShareUrl(code: string, origin = "https://www.doyintech.com"): string {
  const n = normalizeReferralCode(code);
  return `${origin.replace(/\/$/, "")}/refer?ref=${encodeURIComponent(n)}`;
}
