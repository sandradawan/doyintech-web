/**
 * International pricing layer.
 * Source of truth for settlement: NGN (Paystack Nigeria).
 * Display currency: USD for global visitors.
 *
 * At checkout we always charge NGN via Paystack (international cards
 * convert at the cardholder bank). Optional: enable Paystack USD if approved.
 */

/** NGN per 1 USD — override with USD_NGN_RATE on Vercel. */
export function usdNgnRate(): number {
  const raw = process.env.USD_NGN_RATE || process.env.NEXT_PUBLIC_USD_NGN_RATE || "1550";
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 1550;
}

export function ngnToUsd(ngn: number, rate = usdNgnRate()): number {
  return ngn / rate;
}

export function usdToNgn(usd: number, rate = usdNgnRate()): number {
  return Math.round(usd * rate);
}

export function formatUsd(
  amountUsd: number,
  opts?: { compact?: boolean; from?: number }
): string {
  const n = Number.isFinite(amountUsd) ? amountUsd : 0;
  if (opts?.compact && n >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatUsdFromNgn(ngn: number, rate = usdNgnRate()): string {
  return formatUsd(ngnToUsd(ngn, rate));
}

export function formatNgn(ngn: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(ngn);
}

/** Primary public price label: USD, with optional NGN hint. */
export function priceLabelFromNgn(
  ngn: number,
  opts?: { showNgnHint?: boolean }
): string {
  const usd = formatUsdFromNgn(ngn);
  if (opts?.showNgnHint) return `${usd} (≈ ${formatNgn(ngn)})`;
  return usd;
}

/** Paystack amount in kobo from NGN major units. */
export function ngnToKobo(ngn: number): number {
  return Math.round(ngn) * 100;
}

export const CURRENCY_NOTE =
  "Prices shown in USD. Checkout is processed securely in NGN via Paystack — your bank converts automatically. International cards accepted once enabled on our Paystack account.";
