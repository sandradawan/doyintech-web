"use client";

import { useEffect, useState } from "react";
import { INVOICE_CURRENCIES, currencyForLocale } from "@/lib/global/currencies";

/** Currency for a global tool: the visitor's local currency once known, else `fallback`. */
export function useLocalCurrency(fallback = "USD") {
  const [currency, setCurrency] = useState(fallback);
  useEffect(() => {
    const guess = currencyForLocale(navigator.language);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser locale is only known after hydration
    if (guess) setCurrency(guess);
  }, []);
  return [currency, setCurrency] as const;
}

export default function CurrencySelect({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  return (
    <label className="block text-[12px] font-medium text-brand-muted">
      Currency
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link"
      >
        {INVOICE_CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} · {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
