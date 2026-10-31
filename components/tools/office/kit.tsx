"use client";

import { useEffect, useRef, useState } from "react";

/** Shared form styling and helpers for the office, business and student document tools. */

export const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none placeholder:text-[#6e7380] focus:border-[#ff8c14] focus-visible:ring-2 focus-visible:ring-[#ff8c14]/30";
export const label = "block text-[12px] font-medium text-[#a1a1a6]";
export const panel = "space-y-5 rounded-2xl border border-white/10 bg-[#141a28] p-5";
export const primaryBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff8c14] px-6 text-[14px] font-semibold text-black transition hover:bg-[#ffa040] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8c14]";
export const ghostBtn =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 text-[13px] font-semibold text-[#e8eaed] transition hover:border-white/35";

export function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const ngn = (n: number) =>
  "₦" + (Number.isFinite(n) ? n : 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const num = (v: string) => {
  const n = parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function longDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** useState that restores from and saves to localStorage on this device only. */
export function useSavedState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per key
  }, [key]);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
  label: groupLabel,
}: {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={groupLabel} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`min-h-10 rounded-full px-4 text-[13px] font-semibold transition ${
            value === o.id ? "bg-[#ff8c14] text-black" : "border border-white/15 text-[#c7cdd8] hover:border-white/35"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Field({
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`${label} ${className || ""}`}>
      {name}
      <input
        className={field}
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function Area({
  name,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className={label}>
      {name}
      <textarea className={field} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
