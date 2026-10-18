"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

type Item = {
  key: string;
  category: string;
  id: string;
  name: string;
  amountKobo: number | null;
  priceNgn: number | null;
  displayLabel?: string;
  note?: string;
  overridden?: boolean;
  defaultAmountKobo?: number | null;
};

const CATS = ["all", "service", "product", "student", "tool", "ebook", "component", "template", "package"] as const;

export default function AdminPricingPage() {
  const session = useAdminSession();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/pricing", { headers: { ...session.authHeaders() } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load pricing");
      setItems(json.catalog || []);
      const d: Record<string, string> = {};
      for (const it of json.catalog || []) {
        if (it.priceNgn != null) d[it.key] = String(it.priceNgn);
        else if (it.amountKobo != null) d[it.key] = String(Math.round(it.amountKobo / 100));
        else d[it.key] = "";
      }
      setDrafts(d);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session.isAdmin) void load();
  }, [session.isAdmin, load]);

  async function save(key: string) {
    setSaving(key);
    setErr("");
    setMsg("");
    try {
      const priceNgn = drafts[key];
      const res = await fetch("/api/admin/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...session.authHeaders() },
        body: JSON.stringify({ key, priceNgn }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.hint || "Save failed");
      setItems(json.catalog || []);
      setMsg(`Saved ${key}`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  }

  async function clearOverride(key: string) {
    setSaving(key);
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...session.authHeaders() },
        body: JSON.stringify({ key, clear: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Clear failed");
      setItems(json.catalog || []);
      setMsg(`Reset ${key} to code default`);
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Clear failed");
    } finally {
      setSaving(null);
    }
  }

  const filtered = useMemo(() => {
    let rows = items;
    if (cat !== "all") rows = rows.filter((i) => i.category === cat);
    const needle = q.trim().toLowerCase();
    if (needle) {
      rows = rows.filter(
        (i) =>
          i.name.toLowerCase().includes(needle) ||
          i.id.toLowerCase().includes(needle) ||
          i.key.toLowerCase().includes(needle)
      );
    }
    return rows;
  }, [items, cat, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Commerce</p>
          <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Pricing control</h1>
          <p className="mt-1 max-w-xl text-[13px] text-[#86868b]">
            Edit NGN prices for services, products, students, tools, ebooks, components, and templates. Overrides apply to Paystack charges immediately.
          </p>
        </div>
        <button type="button" onClick={() => load()} disabled={loading} className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white disabled:opacity-50">
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {err ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {err}
          <span className="mt-1 block text-[12px] text-red-100/80">If save fails, run docs/site-settings.sql in Supabase SQL Editor once.</span>
        </p>
      ) : null}
      {msg ? <p className="text-sm text-emerald-300">{msg}</p> : null}

      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or id…" className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]/50" />
        {CATS.map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${
            cat === c ? "bg-[#ff8c14]/15 text-[#ff8c14]" : "bg-white/[0.04] text-[#a1a1a6]"
          }`}>{c}</button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead className="bg-white/[0.04] text-[11px] uppercase text-[#86868b]">
            <tr>
              <th className="px-3 py-2.5">Item</th>
              <th className="px-3 py-2.5">Category</th>
              <th className="px-3 py-2.5">Price (₦)</th>
              <th className="px-3 py-2.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => (
              <tr key={it.key} className="border-t border-white/5">
                <td className="px-3 py-3">
                  <p className="font-medium text-white">
                    {it.name}
                    {it.overridden ? <span className="ml-2 rounded-full bg-[#ff8c14]/20 px-2 py-0.5 text-[10px] text-[#ff8c14]">custom</span> : null}
                  </p>
                  <p className="text-[11px] text-[#86868b]">{it.key}</p>
                  {it.note ? <p className="text-[11px] text-[#555]">{it.note}</p> : null}
                </td>
                <td className="px-3 py-3 text-[#a1a1a6]">{it.category}</td>
                <td className="px-3 py-3">
                  {it.amountKobo != null || it.priceNgn != null ? (
                    <input
                      value={drafts[it.key] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [it.key]: e.target.value.replace(/[^\d]/g, "") }))}
                      className="w-28 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-sm tabular-nums text-white outline-none focus:border-[#ff8c14]/50"
                    />
                  ) : (
                    <span className="text-[12px] text-[#86868b]">{it.displayLabel || "Display only"}</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {it.amountKobo != null || it.priceNgn != null ? (
                    <>
                      <button type="button" disabled={saving === it.key} onClick={() => save(it.key)} className="mr-2 text-[12px] font-medium text-[#ff8c14] hover:underline disabled:opacity-50">
                        {saving === it.key ? "…" : "Save"}
                      </button>
                      {it.overridden ? (
                        <button type="button" disabled={saving === it.key} onClick={() => clearOverride(it.key)} className="text-[12px] text-[#a1a1a6] hover:underline">Reset</button>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-[11px] text-[#555]">Quote-based</span>
                  )}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-[#86868b]">No items match.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-[#555]">{filtered.length} shown · store listings edit under Database / Store</p>
    </div>
  );
}
