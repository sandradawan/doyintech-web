/** Lightweight analytics — swap body for GA4/PostHog later */
export function trackToolEvent(
  event: string,
  props?: Record<string, string | number | boolean | undefined>,
) {
  try {
    if (typeof window === "undefined") return;
    // Console in dev; wire to gtag/dataLayer when ready
    const payload = { event, ...props, ts: Date.now() };
    // @ts-expect-error optional global
    if (typeof window.gtag === "function") {
      // @ts-expect-error gtag
      window.gtag("event", event, props || {});
    }
    // @ts-expect-error dataLayer
    window.dataLayer = window.dataLayer || [];
    // @ts-expect-error dataLayer
    window.dataLayer.push(payload);
    if (process.env.NODE_ENV === "development") {
      console.info("[tools-analytics]", payload);
    }
  } catch {
    /* no-op */
  }
}
