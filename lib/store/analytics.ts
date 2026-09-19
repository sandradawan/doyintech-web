/**
 * Lightweight analytics events for the store.
 * Works with console (dev), Vercel Analytics, or a custom endpoint.
 */

export type StoreEvent =
  | "store_view"
  | "listing_view"
  | "download_start"
  | "purchase_start"
  | "purchase_success"
  | "search"
  | "review_submit"
  | "developer_register"
  | "developer_login";

export function trackStoreEvent(
  name: StoreEvent,
  props?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  try {
    // Vercel Analytics (if injected)
    const va = (window as unknown as { va?: (e: string, n: string, p?: object) => void }).va;
    if (typeof va === "function") {
      va("event", name, props);
    }
    // dataLayer (GTM)
    const w = window as unknown as { dataLayer?: object[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: name, ...props });
  } catch {
    /* ignore */
  }
}
