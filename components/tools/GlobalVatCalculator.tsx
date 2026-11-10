"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { vatSplit } from "@/lib/global/vat-rates";

type Props = {
  tax: string;
  currency: string;
  locale: string;
  presets: { label: string; rate: number }[];
  defaultRate: number;
};

/** Add or remove VAT/GST at a country's rates, with a link to invoice in that currency. */
export default function GlobalVatCalculator({ tax, currency, locale, presets, defaultRate }: Props) {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState(String(defaultRate));
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [copied, setCopied] = useState(false);

  const fmt = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, { style: "currency", currency });
    } catch {
      return new Intl.NumberFormat("en", { style: "currency", currency });
    }
  }, [locale, currency]);

  const r = vatSplit(parseFloat(amount.replace(/,/g, "")) || 0, parseFloat(rate) || 0, mode);
  const summary = `Net ${fmt.format(r.net)} + ${tax} ${rate}% ${fmt.format(r.tax)} = ${fmt.format(r.gross)}`;
  const invoiceHref = `/tools/invoice-generator?currency=${currency}&tax=${encodeURIComponent(rate)}`;

  const btn = (on: boolean) =>
    `min-h-10 rounded-full px-4 text-[13px] font-semibold transition ${on ? "bg-brand-accent text-black" : "border border-brand-ink/15 text-brand-soft hover:border-brand-ink/35"}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-5 rounded-2xl border border-brand-ink/10 bg-brand-surface p-5">
        <div role="radiogroup" aria-label="Calculation" className="flex flex-wrap gap-2">
          <button type="button" role="radio" aria-checked={mode === "add"} onClick={() => setMode("add")} className={btn(mode === "add")}>Add {tax} to a price</button>
          <button type="button" role="radio" aria-checked={mode === "remove"} onClick={() => setMode("remove")} className={btn(mode === "remove")}>Remove {tax} from a price</button>
        </div>
        <label className="block text-[12px] font-medium text-brand-muted">
          {mode === "add" ? `Price before ${tax} (${currency})` : `Price including ${tax} (${currency})`}
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-3 text-[20px] font-semibold text-brand-ink outline-none focus:border-brand-link" />
        </label>
        <div>
          <p className="mb-2 text-[12px] font-medium text-brand-muted">{tax} rate</p>
          <div role="radiogroup" aria-label={`${tax} rate`} className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button key={p.label} type="button" role="radio" aria-checked={rate === String(p.rate)} onClick={() => setRate(String(p.rate))} className={btn(rate === String(p.rate))}>{p.label}</button>
            ))}
          </div>
          <label className="mt-3 block max-w-[200px] text-[12px] font-medium text-brand-muted">
            Or any rate (%)
            <input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link" />
          </label>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start" aria-live="polite">
        <dl className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-5 text-[15px]">
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">Net (excl. {tax})</dt><dd className="text-brand-ink">{fmt.format(r.net)}</dd></div>
          <div className="flex justify-between gap-3 py-1.5"><dt className="text-brand-muted">{tax} at {rate || 0}%</dt><dd className="text-brand-ink">{fmt.format(r.tax)}</dd></div>
          <div className="mt-2 flex justify-between gap-3 border-t border-brand-ink/10 pt-3"><dt className="text-brand-muted">Gross (incl. {tax})</dt><dd className="text-[26px] font-semibold text-brand-link">{fmt.format(r.gross)}</dd></div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summary);
                setCopied(true);
              } catch {
                /* clipboard blocked */
              }
            }}
            className="inline-flex min-h-11 items-center rounded-full border border-brand-ink/15 px-5 text-[14px] font-semibold text-brand-ink"
          >
            {copied ? "Copied" : "Copy result"}
          </button>
          <Link href={invoiceHref} className="inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">
            Make a {currency} invoice with {tax}
          </Link>
        </div>
      </div>
    </div>
  );
}
