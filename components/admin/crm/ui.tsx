"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Field } from "@/lib/admin/resources";

export const inputCls =
  "w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-[14px] text-white outline-none transition placeholder:text-white/25 focus:border-[#ff8c14]/70 focus:ring-2 focus:ring-[#ff8c14]/15 disabled:opacity-60";
export const btn = {
  primary:
    "inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#ff8c14] px-3.5 py-2 text-[13px] font-semibold text-black transition hover:brightness-110 disabled:opacity-50",
  ghost:
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-[13px] font-medium text-[#e5e5ea] transition hover:border-white/25 hover:bg-white/[0.04] disabled:opacity-50",
  danger:
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 px-3.5 py-2 text-[13px] font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50",
};
export const panel = "rounded-2xl border border-white/[0.07] bg-[#0b0d13]";

const TONES: Record<string, string> = {
  green: "bg-emerald-500/12 text-emerald-300 ring-emerald-500/20",
  orange: "bg-[#ff8c14]/12 text-[#ffb366] ring-[#ff8c14]/25",
  blue: "bg-sky-500/12 text-sky-300 ring-sky-500/20",
  violet: "bg-violet-500/12 text-violet-300 ring-violet-500/20",
  red: "bg-red-500/12 text-red-300 ring-red-500/20",
  gray: "bg-white/[0.06] text-[#a1a1a6] ring-white/10",
};

const STATUS_TONE: Record<string, keyof typeof TONES> = {
  new: "blue",
  contacted: "violet",
  qualified: "orange",
  proposal: "orange",
  won: "green",
  lost: "red",
  active: "green",
  paid: "green",
  completed: "green",
  delivered: "green",
  fully_paid: "green",
  open: "orange",
  pending: "orange",
  pending_review: "orange",
  pending_payment: "orange",
  processing: "blue",
  in_progress: "blue",
  deposit_paid: "blue",
  awaiting_balance: "orange",
  "non-renewing": "orange",
  attention: "red",
  failed: "red",
  rejected: "red",
  cancelled: "gray",
  off: "gray",
  create: "green",
  update: "blue",
  delete: "red",
};

export function Badge({ value, tone }: { value: string; tone?: keyof typeof TONES }) {
  const t = tone || STATUS_TONE[value] || "gray";
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${TONES[t]}`}>
      {value.replace(/_/g, " ")}
    </span>
  );
}

export const naira = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");

export function formatDate(v: unknown, withTime = false): string {
  if (!v) return "";
  const d = new Date(String(v).length === 10 ? `${v}T12:00:00` : String(v));
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function relativeTime(v: unknown): string {
  if (!v) return "";
  const diff = Date.now() - new Date(String(v)).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d}d ago` : formatDate(v);
}

/** Read-only display of a value according to its field type. */
export function CellValue({ field, value }: { field: Field; value: unknown }) {
  if (value === null || value === undefined || value === "") return <span className="text-white/20">—</span>;
  switch (field.type) {
    case "select":
      return <Badge value={String(value)} />;
    case "boolean":
      return value ? <Badge value="yes" tone="green" /> : <Badge value="no" tone="gray" />;
    case "kobo":
      return <span className="tabular-nums">{naira(Number(value) / 100)}</span>;
    case "naira":
      return <span className="tabular-nums">{naira(Number(value))}</span>;
    case "date":
      return <span className="whitespace-nowrap">{formatDate(value)}</span>;
    case "datetime":
      return (
        <span className="whitespace-nowrap" title={new Date(String(value)).toLocaleString("en-NG")}>
          {field.key === "created_at" ? relativeTime(value) : formatDate(value, true)}
        </span>
      );
    case "json":
      return <span className="font-mono text-[11px] text-white/50">{JSON.stringify(value).slice(0, 60)}</span>;
    case "email":
      return <span className="text-[#8ab4ff]">{String(value)}</span>;
    default:
      return <span className="line-clamp-2 break-words">{String(value)}</span>;
  }
}

/** Slide-over panel (full screen on phones). Closes on Escape and backdrop click. */
export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  wide,
}: {
  open: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      <div
        ref={ref}
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex w-full flex-col border-l border-white/10 bg-[#0b0d13] shadow-2xl outline-none ${
          wide ? "sm:max-w-3xl" : "sm:max-w-xl"
        }`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
          <div className="min-w-0">
            <div className="truncate text-[17px] font-semibold text-white">{title}</div>
            {subtitle && <div className="mt-0.5 text-[12px] text-[#86868b]">{subtitle}</div>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-[18px] leading-none text-[#a1a1a6] hover:bg-white/5 hover:text-white" aria-label="Close">
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t border-white/[0.07] px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

export function Spinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-[#ff8c14]" aria-hidden />;
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">{eyebrow}</p>}
        <h1 className="mt-1 text-[24px] font-semibold tracking-tight text-white">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[13px] text-[#86868b]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[13px] text-amber-100">{message}</p>;
}
