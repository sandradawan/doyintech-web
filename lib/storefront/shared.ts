/** DoyinTech Store: types and pure helpers shared by server routes and client UI. */

export const FREE_PRODUCT_LIMIT = 5;
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
  customer?: { name?: string; reference?: string }
): string {
  const lines = items.map((i) => `• ${i.qty} × ${i.name} — ${formatKobo(i.qty * i.price_kobo)}`);
  const total = items.reduce((n, i) => n + i.qty * i.price_kobo, 0);
  const text = [
    `Hi ${storeName}, I'd like to order:`,
    ...lines,
    `Total: ${formatKobo(total)}`,
    customer?.reference ? `Paid online — ref ${customer.reference}` : "",
    customer?.name ? `Name: ${customer.name}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}
