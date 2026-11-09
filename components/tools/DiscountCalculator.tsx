"use client";

import { useState } from "react";
import CurrencySelect, { useLocalCurrency } from "@/components/tools/CurrencySelect";
import { formatMoney } from "@/lib/global/currencies";
import { applyDiscounts, originalPrice } from "@/lib/global/money-tools";

const num = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;
const field = "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]";

/** Sale price and savings, extra discounts on top, and the original price from a sale price. */
export default function DiscountCalculator() {
  const [currency, setCurrency] = useLocalCurrency();
  const [mode, setMode] = useState<"sale" | "original">("sale");
  const [price, setPrice] = useState("120");
  const [discount, setDiscount] = useState("25");
  const [extra, setExtra] = useState("");

  const money = (n: number) => formatMoney(n, currency);
  const r = applyDiscounts(num(price), [num(discount), ...(extra ? [num(extra)] : [])]);
  const before = originalPrice(num(price), num(discount));

  const btn = (on: boolean) =>
    `min-h-10 rounded-full px-4 text-[13px] font-semibold transition ${on ? "bg-[#ff8c14] text-black" : "border border-white/15 text-brand-soft hover:border-white/35"}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-white/10 bg-brand-surface p-5">
        <div role="radiogroup" aria-label="Calculation" className="flex flex-wrap gap-2">
          <button type="button" role="radio" aria-checked={mode === "sale"} onClick={() => setMode("sale")} className={btn(mode === "sale")}>Find the sale price</button>
          <button type="button" role="radio" aria-checked={mode === "original"} onClick={() => setMode("original")} className={btn(mode === "original")}>Find the original price</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-[12px] font-medium text-brand-muted">
            {mode === "sale" ? "Original price" : "Price after discount"}
            <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={field + " py-3 text-[20px] font-semibold"} />
          </label>
          <CurrencySelect value={currency} onChange={setCurrency} />
          <label className="block text-[12px] font-medium text-brand-muted">
            Discount (%)
            <input inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value)} className={field} />
          </label>
          {mode === "sale" && (
            <label className="block text-[12px] font-medium text-brand-muted">
              Extra discount on top (%)
              <input inputMode="decimal" value={extra} placeholder="Optional" onChange={(e) => setExtra(e.target.value)} className={field} />
            </label>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        {mode === "sale" ? (
          <dl className="rounded-2xl border border-white/10 bg-brand-surface p-5 text-[15px]">
            <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Original price</dt><dd className="text-white">{money(num(price))}</dd></div>
            <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">You save</dt><dd className="text-white">{money(r.saved)}</dd></div>
            {extra && <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Total discount</dt><dd className="text-white">{r.effectivePercent.toFixed(1)}%</dd></div>}
            <div className="mt-2 flex justify-between gap-3 border-t border-white/10 pt-3"><dt className="text-brand-muted">Sale price</dt><dd className="text-[28px] font-semibold text-[#ff8c14]">{money(r.sale)}</dd></div>
          </dl>
        ) : (
          <dl className="rounded-2xl border border-white/10 bg-brand-surface p-5 text-[15px]">
            <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Price after {num(discount)}% off</dt><dd className="text-white">{money(num(price))}</dd></div>
            <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Discount amount</dt><dd className="text-white">{money(before - num(price))}</dd></div>
            <div className="mt-2 flex justify-between gap-3 border-t border-white/10 pt-3"><dt className="text-brand-muted">Original price</dt><dd className="text-[28px] font-semibold text-[#ff8c14]">{money(before)}</dd></div>
          </dl>
        )}
      </div>
    </div>
  );
}
