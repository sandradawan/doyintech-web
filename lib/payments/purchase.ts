/**
 * Server-side purchase verification. Every paid unlock/delivery goes through here.
 *
 * A Paystack "success" alone is not proof of purchase: anyone can pay ₦50 for airtime,
 * or start a transaction with the public key and arbitrary metadata. A purchase only
 * counts when the transaction succeeded, was charged in NGN, names the product in
 * metadata, and paid at least the catalog price for it.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { getPayItem } from "@/lib/paystack-catalog";
import { findAnyEbook } from "@/lib/ebooks-catalog";
import { UI_COMPONENTS } from "@/lib/ui-components";
import { PAGE_TEMPLATES } from "@/lib/page-templates";
import { getPaidToolByProductId } from "@/lib/tools/paid";
import { getDigitalProduct } from "@/lib/products";
import { getServiceAddon, getServiceOffer } from "@/lib/service-offers";

export type PaystackTx = {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  paid_at?: string;
  customer?: { email?: string };
  metadata?: Record<string, unknown> | null;
};

const COMPONENT_BUNDLE_SLUG = "agency-ui-kit";
const TEMPLATE_BUNDLE_SLUG = "all-templates-bundle";

// Successful verifications rarely change; cache briefly to spare the Paystack API.
const txCache = new Map<string, { tx: PaystackTx; at: number }>();
const TX_CACHE_MS = 10 * 60 * 1000;

export async function fetchPaystackTransaction(reference: string): Promise<PaystackTx | null> {
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  const ref = reference.trim();
  if (!secret || !ref || ref.length > 100) return null;

  const cached = txCache.get(ref);
  if (cached && Date.now() - cached.at < TX_CACHE_MS) return cached.tx;

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
    { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" }
  );
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.status || !data.data) return null;

  const tx = data.data as PaystackTx;
  if (tx.status === "success") {
    if (txCache.size > 2000) txCache.clear();
    txCache.set(ref, { tx, at: Date.now() });
  }
  return tx;
}

export function txProductId(tx: PaystackTx): string {
  return String(tx.metadata?.product_id || "").trim();
}

export function txEmail(tx: PaystackTx): string {
  return String(tx.customer?.email || "").trim().toLowerCase();
}

/**
 * Signs the price our server quoted at checkout. Stored in Paystack metadata so a later
 * price change does not lock out earlier buyers; attackers cannot forge it without the secret.
 */
export function signQuote(productId: string, amountKobo: number): string {
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  return createHmac("sha256", secret).update(`quote:${productId}:${amountKobo}`).digest("hex");
}

function quotedAmount(tx: PaystackTx, productId: string): number | null {
  const kobo = Number(tx.metadata?.quoted_kobo);
  const sig = String(tx.metadata?.quote_sig || "");
  if (!Number.isFinite(kobo) || kobo <= 0 || sig.length !== 64) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(signQuote(productId, kobo));
  return timingSafeEqual(a, b) ? kobo : null;
}

export type PurchaseCheck =
  | { ok: true; productId: string; email: string; amountKobo: number; tx: PaystackTx }
  | { ok: false; error: string; status: number };

/** Confirms `tx` is a full, successful NGN payment for the product it names. */
export async function checkTransactionPaysForItsProduct(tx: PaystackTx): Promise<PurchaseCheck> {
  if (tx.status !== "success") {
    return { ok: false, error: "Payment not completed.", status: 402 };
  }
  const productId = txProductId(tx);
  if (!productId) {
    return { ok: false, error: "Payment is not linked to a product.", status: 400 };
  }
  const item = await getPayItem(productId);
  if (!item) {
    return { ok: false, error: "Unknown product on this payment.", status: 400 };
  }
  const expectedKobo = quotedAmount(tx, productId) ?? item.amountKobo;
  if ((tx.currency || "NGN").toUpperCase() !== "NGN" || tx.amount < expectedKobo) {
    return { ok: false, error: "Payment amount does not match the product price.", status: 402 };
  }
  return { ok: true, productId: item.id, email: txEmail(tx), amountKobo: tx.amount, tx };
}

/** Verifies a reference with Paystack and checks it fully paid for its product. */
export async function verifyPurchase(reference: string): Promise<PurchaseCheck> {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return { ok: false, error: "Payments are not configured.", status: 503 };
  }
  const tx = await fetchPaystackTransaction(reference);
  if (!tx) return { ok: false, error: "Payment not found.", status: 404 };
  return checkTransactionPaysForItsProduct(tx);
}

function componentFor(id: string) {
  return UI_COMPONENTS.find((c) => c.id === id || c.slug === id);
}

function templateFor(id: string) {
  return PAGE_TEMPLATES.find((t) => t.id === id || t.slug === id);
}

/** Does buying `paidProductId` grant access to `requestedId`? Handles bundles. */
export function purchaseCovers(paidProductId: string, requestedId: string): boolean {
  if (!paidProductId || !requestedId) return false;
  if (paidProductId === requestedId) return true;

  const paidComp = componentFor(paidProductId);
  const reqComp = componentFor(requestedId);
  if (paidComp && reqComp) {
    return paidComp.id === reqComp.id || paidComp.slug === COMPONENT_BUNDLE_SLUG;
  }

  const paidTpl = templateFor(paidProductId);
  const reqTpl = templateFor(requestedId);
  if (paidTpl && reqTpl) {
    return paidTpl.id === reqTpl.id || paidTpl.slug === TEMPLATE_BUNDLE_SLUG;
  }

  const paidBook = findAnyEbook(paidProductId);
  const reqBook = findAnyEbook(requestedId);
  if (paidBook && reqBook) return paidBook.id === reqBook.id;

  return false;
}

export type ProductKind = "ebook" | "component" | "template" | "tool" | "digital" | "service" | "other";

export type ProductSummary = {
  id: string;
  kind: ProductKind;
  title: string;
  slug?: string;
  toolSlug?: string;
  unlockKey?: string;
  isBundle?: boolean;
};

/** Small, content-free description of a product for client UIs. */
export function describeProduct(productId: string): ProductSummary {
  const tool = getPaidToolByProductId(productId);
  if (tool) {
    return {
      id: productId,
      kind: "tool",
      title: tool.title,
      toolSlug: tool.toolSlug,
      unlockKey: tool.unlockKey,
    };
  }
  const book = findAnyEbook(productId);
  if (book) return { id: book.id, kind: "ebook", title: book.title, slug: book.slug };
  const comp = componentFor(productId);
  if (comp) {
    return {
      id: comp.id,
      kind: "component",
      title: comp.name,
      slug: comp.slug,
      isBundle: comp.slug === COMPONENT_BUNDLE_SLUG,
    };
  }
  const tpl = templateFor(productId);
  if (tpl) {
    return {
      id: tpl.id,
      kind: "template",
      title: tpl.name,
      slug: tpl.slug,
      isBundle: tpl.slug === TEMPLATE_BUNDLE_SLUG,
    };
  }
  const service = getServiceOffer(productId) || getServiceAddon(productId);
  if (service) return { id: service.id, kind: "service", title: service.name };
  const digital = getDigitalProduct(productId);
  if (digital) return { id: digital.id, kind: "digital", title: digital.name };
  return { id: productId, kind: "other", title: productId };
}
