/** Conversion events: names, labels for the admin view, and the first-party attribution cookie. */

/** Events the browser may send to /api/track. */
export const CLIENT_EVENTS = [
  "whatsapp_click",
  "phone_click",
  "email_click",
  "cta_click",
  "tool_download",
  "shop_view",
] as const;

/** Events recorded by server routes (never accepted from the browser). */
export const SERVER_EVENTS = [
  "lead",
  "newsletter_signup",
  "checkout_start",
  "payment",
  "subscription_payment",
  "shop_created",
  "shop_order_paid",
] as const;

export type ClientEvent = (typeof CLIENT_EVENTS)[number];
export type ServerEvent = (typeof SERVER_EVENTS)[number];
export type EventName = ClientEvent | ServerEvent;

export const EVENT_LABELS: Record<EventName, string> = {
  whatsapp_click: "WhatsApp clicks",
  phone_click: "Phone clicks",
  email_click: "Email clicks",
  cta_click: "Clicks to money pages",
  tool_download: "Tool PDFs saved",
  shop_view: "Seller shop views",
  lead: "Leads (forms)",
  newsletter_signup: "Email sign-ups",
  checkout_start: "Checkouts started",
  payment: "Payments",
  subscription_payment: "Subscription payments",
  shop_created: "Shops created",
  shop_order_paid: "Shop orders paid (sellers)",
};

/** Pages a click towards counts as a "cta_click". */
export const MONEY_PATHS = ["/hire", "/free-audit", "/care-plans", "/pro", "/stores", "/products", "/website-cost-nigeria"];

/** First-party cookie, set only with analytics consent: random session id + first-touch source. */
export const ATTR_COOKIE = "dt_attr";

export type Attribution = {
  sid?: string;
  src?: string;
  med?: string;
  cmp?: string;
  ref?: string;
};

export function parseAttribution(raw: string | undefined | null): Attribution {
  if (!raw) return {};
  try {
    const a = JSON.parse(decodeURIComponent(raw)) as Attribution;
    const clip = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : undefined);
    return { sid: clip(a.sid, 40), src: clip(a.src, 80), med: clip(a.med, 80), cmp: clip(a.cmp, 120), ref: clip(a.ref, 120) };
  } catch {
    return {};
  }
}
