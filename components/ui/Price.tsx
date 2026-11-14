"use client";

import { Fragment, useSyncExternalStore } from "react";
import { usdNgnRate } from "@/lib/currency";

/**
 * Prices are set in naira (what Paystack charges). Visitors outside Nigeria see US dollars first,
 * with naira beside it, so the site reads as international without changing what anyone pays.
 * The server renders naira; the browser switches after it loads.
 */

const NG_TIMEZONES = new Set(["Africa/Lagos"]);
const NG_LANGS = /^(en-NG|ha|yo|ig|pcm)\b/i;

function detectNigeria(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (NG_TIMEZONES.has(tz)) return true;
    return (navigator.languages || [navigator.language]).some((l) => NG_LANGS.test(l));
  } catch {
    return true;
  }
}

/** "ngn" on the server and for Nigerian visitors, "usd" for everyone else. */
export function useDisplayCurrency(): "ngn" | "usd" {
  return useSyncExternalStore(
    () => () => {},
    () => (detectNigeria() ? "ngn" : "usd"),
    () => "ngn"
  );
}

export function formatNgn(ngn: number): string {
  return `₦${Math.round(ngn).toLocaleString("en-NG")}`;
}

/** Whole dollars below $100, nearest $5 above, so prices look set rather than converted. */
export function formatUsdFromNaira(ngn: number): string {
  const usd = ngn / usdNgnRate();
  const rounded = usd < 100 ? Math.max(1, Math.round(usd)) : Math.round(usd / 5) * 5;
  return `$${rounded.toLocaleString("en-US")}`;
}

/** One price. Nigerians see ₦; others see $ with ₦ in brackets when `both` is set. */
export function Money({ ngn, both = false }: { ngn: number; both?: boolean }) {
  const cur = useDisplayCurrency();
  if (cur === "ngn") return <>{formatNgn(ngn)}</>;
  return (
    <>
      {formatUsdFromNaira(ngn)}
      {both && <span className="whitespace-nowrap font-normal opacity-70"> ({formatNgn(ngn)})</span>}
    </>
  );
}

/** Text with prices written as {₦75000}; each one shows in the visitor's currency. */
export function PriceText({ text }: { text: string }) {
  const parts = text.split(/\{₦(\d+)\}/);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <Money key={i} ngn={Number(p)} /> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}
