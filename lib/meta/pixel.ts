/**
 * Meta Pixel helpers — client-safe.
 * Pixel ID is public by design (NEXT_PUBLIC_META_PIXEL_ID).
 * No PII in event params.
 */

export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Contact"
  | "CompleteRegistration"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase";

export type MetaEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    fbq?: (
      action: string,
      eventOrId?: string,
      params?: MetaEventParams | string,
      options?: { eventID?: string }
    ) => void;
    _fbq?: unknown;
    __doyinMetaPixelInit?: boolean;
    __doyinMetaLastPageView?: string;
  }
}

export function getMetaPixelId(): string {
  const id = (process.env.NEXT_PUBLIC_META_PIXEL_ID || "").trim();
  if (!id || id === "undefined" || id === "null") return "";
  if (!/^\d{5,20}$/.test(id)) return "";
  return id;
}

export function isMetaPixelConfigured(): boolean {
  const enabled = (process.env.NEXT_PUBLIC_META_PIXEL_ENABLED || "true").toLowerCase();
  if (enabled === "false" || enabled === "0" || enabled === "off") return false;
  return Boolean(getMetaPixelId());
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const v = localStorage.getItem("cookie-consent");
    return v === "all" || v === "true";
  } catch {
    return false;
  }
}

export function trackMetaEvent(event: MetaStandardEvent, params?: MetaEventParams): void {
  if (typeof window === "undefined") return;
  if (!isMetaPixelConfigured()) return;
  if (!hasAnalyticsConsent()) return;
  if (typeof window.fbq !== "function") return;

  try {
    const safe: MetaEventParams = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        const key = k.toLowerCase();
        if (
          key.includes("email") ||
          key.includes("phone") ||
          key.includes("password") ||
          key.includes("name") ||
          key.includes("address")
        ) {
          continue;
        }
        if (v !== undefined) safe[k] = v;
      }
    }
    if (Object.keys(safe).length) {
      window.fbq("track", event, safe);
    } else {
      window.fbq("track", event);
    }
  } catch {
    /* never break the site */
  }
}

export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;
  if (!isMetaPixelConfigured() || !hasAnalyticsConsent()) return;
  if (typeof window.fbq !== "function") return;

  const key = path || "/";
  if (window.__doyinMetaLastPageView === key) return;
  window.__doyinMetaLastPageView = key;

  try {
    window.fbq("track", "PageView");
  } catch {
    /* ignore */
  }
}
