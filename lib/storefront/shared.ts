/** DoyinTech Store: types and pure helpers shared by server routes and client UI. */

export const FREE_PRODUCT_LIMIT = 5;
/** Free shops pay this on each online order (taken by Paystack split); the Store plan pays none. */
export const FREE_PLAN_FEE_PERCENT = 1.5;
export const MAX_DELIVERY_ZONES = 20;

/** Directory categories sellers pick from. */
export const STORE_CATEGORIES = [
  "Fashion & clothing",
  "Beauty & skincare",
  "Food & drinks",
  "Cakes & pastries",
  "Phones & gadgets",
  "Home & kitchen",
  "Health & wellness",
  "Kids & baby",
  "Hair & wigs",
  "Shoes & bags",
  "Jewellery & accessories",
  "Books & stationery",
  "Art & crafts",
  "Services",
  "Other",
] as const;

/** Paid "Sponsored" placement at the top of /shops. */
export const BOOST_PLANS = [
  { days: 7, amountKobo: 200_000, label: "7 days" },
  { days: 30, amountKobo: 600_000, label: "30 days" },
] as const;

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export const RESERVED_SLUGS = new Set(["admin", "api", "dashboard", "doyintech", "new", "store", "stores", "www"]);

export type PaymentsStatus = "off" | "pending_review" | "active" | "rejected";

export type Storefront = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  whatsapp: string;
  is_published: boolean;
  payments_status: PaymentsStatus;
  bank_name: string | null;
  account_name: string | null;
  account_last4: string | null;
  delivery_zones: DeliveryZone[];
  category?: string | null;
  city?: string | null;
  featured_until?: string | null;
};

export type DeliveryZone = { name: string; fee_kobo: number };

export type Discount = {
  code: string;
  percent_off: number | null;
  amount_off_kobo: number | null;
  min_subtotal_kobo: number;
};

export type StoreProduct = {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price_kobo: number;
  image_url: string | null;
  in_stock: boolean;
  sort: number;
};

export type OrderItem = { product_id: string; name: string; qty: number; price_kobo: number };

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$/.test(slug) && !RESERVED_SLUGS.has(slug);
}

/** Nigerian numbers like 0803… become 234803…; returns null when not a plausible number. */
export function normalizeWhatsapp(input: string): string | null {
  let d = input.replace(/\D/g, "");
  if (d.startsWith("0") && d.length === 11) d = "234" + d.slice(1);
  return d.length >= 10 && d.length <= 15 ? d : null;
}

export function formatKobo(kobo: number): string {
  return "₦" + Math.round(kobo / 100).toLocaleString("en-NG");
}

/** WhatsApp click-to-chat link carrying the order summary. */
export function whatsappOrderLink(
  whatsapp: string,
  storeName: string,
  items: { name: string; qty: number; price_kobo: number }[],
  customer?: {
    name?: string;
    phone?: string;
    note?: string;
    reference?: string;
    zone?: DeliveryZone | null;
    discount?: { code: string; kobo: number } | null;
  }
): string {
  const lines = items.map((i) => `• ${i.qty} × ${i.name} — ${formatKobo(i.qty * i.price_kobo)}`);
  const subtotal = items.reduce((n, i) => n + i.qty * i.price_kobo, 0);
  const off = customer?.discount?.kobo || 0;
  const delivery = customer?.zone?.fee_kobo || 0;
  const text = [
    `Hi ${storeName}, I'd like to order:`,
    ...lines,
    off ? `Discount (${customer!.discount!.code}): −${formatKobo(off)}` : "",
    customer?.zone ? `Delivery to ${customer.zone.name}: ${delivery ? formatKobo(delivery) : "free"}` : "",
    `Total: ${formatKobo(subtotal - off + delivery)}`,
    customer?.reference ? `Paid online — ref ${customer.reference}` : "",
    customer?.name ? `Name: ${customer.name}` : "",
    customer?.phone ? `Phone: ${customer.phone}` : "",
    customer?.note ? `Address / note: ${customer.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}

/** DoyinTech's cut of an online order: 1.5% on the free plan, nothing on the Store plan. */
export function platformFeeKobo(amountKobo: number, paidPlan: boolean): number {
  return paidPlan ? 0 : Math.round((amountKobo * FREE_PLAN_FEE_PERCENT) / 100);
}

/** Discount in kobo for a subtotal; 0 when the code doesn't apply. Never more than the subtotal. */
export function discountKobo(subtotalKobo: number, d: Discount | null | undefined): number {
  if (!d || subtotalKobo < d.min_subtotal_kobo) return 0;
  const off = d.percent_off ? Math.round((subtotalKobo * d.percent_off) / 100) : d.amount_off_kobo || 0;
  return Math.min(off, subtotalKobo);
}

/** Cleans seller-entered delivery areas: names trimmed, fees in kobo, duplicates and junk dropped. */
export function cleanZones(input: unknown): DeliveryZone[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: DeliveryZone[] = [];
  for (const z of input) {
    const name = String((z as DeliveryZone)?.name || "").trim().slice(0, 60);
    const fee = Math.round(Number((z as DeliveryZone)?.fee_kobo));
    if (!name || !Number.isFinite(fee) || fee < 0 || fee > 100_000_000 || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    out.push({ name, fee_kobo: fee });
    if (out.length >= MAX_DELIVERY_ZONES) break;
  }
  return out;
}

export function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
}
