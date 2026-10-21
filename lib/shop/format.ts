/**
 * Price formatters for shop UI. Kept apart from the catalog modules so client
 * components can import them without bundling paid content (chapters, fullCode).
 */
import { formatUsdFromNgn } from "@/lib/currency";

/** Public display: USD (Paystack still charges NGN via amountKobo). */
export function formatEbookPrice(n: number): string {
  return formatUsdFromNgn(Number(n) || 0);
}

export function formatCompPrice(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}

export function formatTplPrice(n: number): string {
  return "₦" + n.toLocaleString("en-NG");
}
