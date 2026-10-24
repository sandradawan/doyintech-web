/**
 * DoyinTech gift cards (server only). Closed-loop: spendable only on DoyinTech's own products,
 * tools and services, never cashed out or used in seller shops.
 *
 * Security: codes are 80-bit random; only an HMAC of the code is searchable; the code itself is
 * stored AES-GCM encrypted so the buyer can see it after paying. Balances move only through the
 * locked SQL functions in migration 009.
 */
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomInt } from "crypto";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ctaButton, emailLayout } from "@/lib/email/templates";
import type { PaystackTx } from "@/lib/payments/purchase";
import { absoluteUrl } from "@/lib/site";
import {
  CODE_ALPHABET,
  CODE_LENGTH,
  GIFT_VALID_YEARS,
  formatGiftCode,
  giftDesign,
  naira,
  normalizeGiftCode,
} from "@/lib/giftcards/shared";

export const GIFT_PURCHASE_REF_RE = /^GFT_[a-z0-9]{6,12}_[a-f0-9]{8}$/;
export const GIFT_ONLY_REF_RE = /^GC_[a-z0-9]{6,12}_[a-f0-9]{8}$/;
const HOLD_MINUTES = 60;

function secret(): string {
  const s = process.env.GIFT_CARD_SECRET || process.env.DELIVERY_TOKEN_SECRET || process.env.PAYSTACK_SECRET_KEY || "";
  if (!s) throw new Error("Gift cards need GIFT_CARD_SECRET (or DELIVERY_TOKEN_SECRET) to be set.");
  return s;
}

export function hashCode(code: string): string {
  return createHmac("sha256", secret()).update(`gift:${code}`).digest("hex");
}

function encKey() {
  return createHash("sha256").update(`${secret()}:gift-enc`).digest();
}

function encrypt(text: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", encKey(), iv);
  const ct = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), ct]).toString("base64");
}

function decrypt(blob: string): string {
  const b = Buffer.from(blob, "base64");
  const d = createDecipheriv("aes-256-gcm", encKey(), b.subarray(0, 12));
  d.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString("utf8");
}

function newCode(): string {
  let s = "";
  for (let i = 0; i < CODE_LENGTH; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return s;
}

export const newRef = (prefix: "GFT" | "GC" | "DT") => `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;

function db() {
  const sb = getSupabaseAdmin();
  if (!sb) throw new Error("Database not configured");
  return sb;
}

/** Creates a card awaiting payment. Returns the Paystack reference to charge. */
export async function createPendingCard(input: {
  amountKobo: number;
  design: string;
  purchaserEmail: string;
  purchaserName: string | null;
  recipientName: string | null;
  recipientEmail: string | null;
  message: string | null;
}): Promise<{ reference: string }> {
  const code = newCode();
  const reference = newRef("GFT");
  const { error } = await db()
    .from("gift_cards")
    .insert({
      code_hash: hashCode(code),
      code_enc: encrypt(code),
      code_last4: code.slice(-4),
      initial_kobo: input.amountKobo,
      design: giftDesign(input.design).id,
      purchaser_email: input.purchaserEmail,
      purchaser_name: input.purchaserName,
      recipient_name: input.recipientName,
      recipient_email: input.recipientEmail,
      message: input.message,
      paystack_reference: reference,
    });
  if (error) throw new Error(error.message);
  return { reference };
}

type CardRow = {
  id: string;
  code_enc: string;
  code_last4: string;
  initial_kobo: number;
  status: string;
  design: string;
  purchaser_email: string;
  purchaser_name: string | null;
  recipient_name: string | null;
  recipient_email: string | null;
  message: string | null;
  expires_at: string | null;
  delivered_at: string | null;
};

/** Webhook / return page: activates a paid card and emails it. Idempotent. */
export async function activateGiftCard(tx: PaystackTx): Promise<boolean> {
  if (!GIFT_PURCHASE_REF_RE.test(tx.reference) || tx.status !== "success" || (tx.currency || "NGN").toUpperCase() !== "NGN") return false;
  const sb = db();
  const { data: card } = await sb.from("gift_cards").select("*").eq("paystack_reference", tx.reference).maybeSingle();
  if (!card || tx.amount < card.initial_kobo) return false;
  if (card.status !== "pending") return card.status === "active";

  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + GIFT_VALID_YEARS);
  const { data: updated } = await sb
    .from("gift_cards")
    .update({ status: "active", activated_at: new Date().toISOString(), expires_at: expires.toISOString() })
    .eq("id", card.id)
    .eq("status", "pending")
    .select("*");
  if (!updated?.length) return true;

  if (await sendGiftEmails(updated[0] as CardRow)) {
    await sb.from("gift_cards").update({ delivered_at: new Date().toISOString() }).eq("id", card.id);
  }
  return true;
}

async function sendGiftEmails(card: CardRow): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const code = formatGiftCode(decrypt(card.code_enc));
  const amount = naira(card.initial_kobo);
  const design = giftDesign(card.design);
  const from = process.env.DELIVERY_FROM_EMAIL || process.env.RESEND_FROM || "DoyinTech <onboarding@resend.dev>";
  const spend = absoluteUrl(`/gift-cards/redeem?code=${encodeURIComponent(code)}`);
  const expiry = card.expires_at ? new Date(card.expires_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" }) : "";
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const cardHtml = `<div style="margin:18px 0;border-radius:18px;padding:24px;background:linear-gradient(135deg,${design.from},${design.to});color:${design.ink};">
    <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.8;">DoyinTech gift card</div>
    <div style="margin-top:8px;font-size:34px;font-weight:700;">${amount}</div>
    ${card.message ? `<div style="margin-top:10px;font-size:15px;">“${esc(card.message)}”</div>` : ""}
    <div style="margin-top:18px;display:inline-block;background:rgba(255,255,255,.92);color:#111;border-radius:10px;padding:10px 14px;font-family:monospace;font-size:18px;letter-spacing:.08em;">${code}</div>
  </div>`;
  const howTo = `<p style="margin:0 0 14px;">Spend it on anything at doyintech.com: business tools, templates, ebooks, website packages and add-ons. Any balance left stays on the card${expiry ? ` until ${expiry}` : ""}.</p>`;

  const send = async (to: string, subject: string, intro: string) => {
    const { error } = await new Resend(key).emails.send({
      from,
      to,
      subject,
      html: emailLayout({
        title: subject,
        preheader: `${amount} DoyinTech gift card`,
        bodyHtml: `<p style="margin:0 0 14px;">${intro}</p>${cardHtml}${howTo}${ctaButton(spend, "Use my gift card")}`,
      }),
      text: `${intro}\n\nGift card: ${amount}\nCode: ${code}\n${card.message ? `Message: ${card.message}\n` : ""}\nSpend it: ${spend}`,
    });
    if (error) console.error("gift email", error.message);
    return !error;
  };

  const buyer = card.purchaser_name?.split(" ")[0] || "";
  const toRecipient = card.recipient_email && card.recipient_email !== card.purchaser_email;
  let ok = await send(
    card.purchaser_email,
    `Your ${amount} DoyinTech gift card`,
    toRecipient
      ? `Thanks${buyer ? `, ${esc(buyer)}` : ""}! We've emailed this gift card to ${esc(card.recipient_name || card.recipient_email!)}. Here's a copy for your records.`
      : `Thanks${buyer ? `, ${esc(buyer)}` : ""}! Here's your gift card. Forward this email or share the code to give it.`
  );
  if (toRecipient) {
    ok =
      (await send(
        card.recipient_email!,
        `${card.purchaser_name || "Someone"} sent you a ${amount} DoyinTech gift card`,
        `Hi${card.recipient_name ? ` ${esc(card.recipient_name.split(" ")[0])}` : ""}, ${esc(card.purchaser_name || "someone")} sent you a DoyinTech gift card.`
      )) && ok;
  }
  return ok;
}

/** Buyer's view after paying: shows the code once the card is active. */
export async function cardByPurchaseRef(reference: string) {
  if (!GIFT_PURCHASE_REF_RE.test(reference)) return null;
  const { data } = await db().from("gift_cards").select("*").eq("paystack_reference", reference).maybeSingle();
  if (!data) return null;
  const card = data as CardRow;
  return {
    status: card.status,
    amountKobo: card.initial_kobo,
    design: card.design,
    message: card.message,
    recipientName: card.recipient_name,
    expiresAt: card.expires_at,
    code: card.status === "active" ? formatGiftCode(decrypt(card.code_enc)) : null,
  };
}

/** Balance check. Never reveals anything for codes that don't exist. */
export async function checkGiftCode(raw: string) {
  const code = normalizeGiftCode(raw);
  if (!code) return null;
  const sb = db();
  const { data: card } = await sb
    .from("gift_cards")
    .select("id, status, initial_kobo, expires_at, code_last4, design")
    .eq("code_hash", hashCode(code))
    .maybeSingle();
  if (!card || card.status === "pending") return null;
  const { data: available } = await sb.rpc("gift_card_available", { p_card: card.id });
  const expired = Boolean(card.expires_at && new Date(card.expires_at) < new Date());
  return {
    last4: card.code_last4,
    design: card.design,
    initialKobo: card.initial_kobo,
    balanceKobo: Math.max(0, Number(available) || 0),
    usable: card.status === "active" && !expired,
    status: expired ? "expired" : card.status,
    expiresAt: card.expires_at,
  };
}

/** Reserves up to `maxKobo` of the card for a checkout. Returns kobo held (0 if the card can't pay). */
export async function holdGiftCredit(rawCode: string, reference: string, maxKobo: number, productId: string, email: string): Promise<number> {
  const code = normalizeGiftCode(rawCode);
  if (!code || maxKobo <= 0) return 0;
  const { data, error } = await db().rpc("gift_card_hold", {
    p_code_hash: hashCode(code),
    p_reference: reference,
    p_max: maxKobo,
    p_product: productId,
    p_email: email,
    p_minutes: HOLD_MINUTES,
  });
  if (error) {
    console.error("gift hold", error.message);
    return 0;
  }
  return Number(data) || 0;
}

/** Converts a hold into a spend. Purchases that rely on a hold are refused if this returns false. */
export async function captureGiftHold(reference: string): Promise<boolean> {
  const { data, error } = await db().rpc("gift_card_capture", { p_reference: reference });
  if (error) {
    console.error("gift capture", error.message);
    return false;
  }
  return data === true;
}

/**
 * Card-only purchases (GC_ references) have no Paystack transaction. This returns an equivalent
 * transaction so the normal verification, unlock and delivery code works unchanged.
 */
export async function giftOnlyTransaction(reference: string, sign: (productId: string, kobo: number) => string): Promise<PaystackTx | null> {
  if (!GIFT_ONLY_REF_RE.test(reference)) return null;
  const { data: hold } = await db()
    .from("gift_card_holds")
    .select("amount_kobo, product_id, email, status, captured_at")
    .eq("reference", reference)
    .maybeSingle();
  if (!hold) return null;
  return {
    reference,
    status: hold.status === "captured" ? "success" : "failed",
    amount: hold.amount_kobo,
    currency: "NGN",
    paid_at: hold.captured_at || undefined,
    customer: { email: hold.email || undefined },
    metadata: {
      product_id: hold.product_id,
      kind: hold.product_id.startsWith("service-") ? "service_deposit" : "digital",
      paid_with: "gift_card",
      quoted_kobo: hold.amount_kobo,
      quote_sig: sign(hold.product_id, hold.amount_kobo),
    },
  };
}
