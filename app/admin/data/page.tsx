"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

const TABLES = [
  { id: "site_leads", label: "Leads", createFields: ["name", "email", "phone", "product", "type", "status", "message", "source"] },
  { id: "student_projects", label: "Student projects", createFields: ["name", "email", "package_name", "stage", "status", "topic", "amount_ngn"] },
  { id: "store_listings", label: "Store listings", createFields: ["title", "price_ngn", "category", "review_status", "developer_name", "developer_email", "kind", "platform"] },
  { id: "store_orders", label: "Store orders", createFields: ["product_name", "buyer_email", "status", "amount_ngn"] },
  { id: "store_developers", label: "Developers", createFields: ["display_name", "email", "phone", "membership_status", "membership_tier"] },
  { id: "ops_workspaces", label: "Ops workspaces", createFields: ["name"] },
] as const;

type TableId = (typeof TABLES)[number]["id"];

export default function AdminDataPage() {
  const session = useAdminSession();
  const [table, setTable] = useState<TableId>("site_leads");
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const meta = useMemo(() => TABLES.find((t) => t.id === table)!, [table]);

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/records?table=${table}&limit=150`, {
        headers: { ...session.authHeaders() },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load");
      setRows(json.rows || []);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [session, table]);

  useEffect(() => {
    if (session.isAdmin) void load();
  }, [session.isAdmin, load]);

  function openCreate() {
    setCreating(true);
    setEditing(null);
    const blank: Record<string, string> = {};
    meta.createFields.forEach((f) => {
      blank[f] = f === "status" ? "new" : f === "review_status" ? "draft" : "";
    });
    setForm(blank);
  }

  function openEdit(row: Record<string, unknown>) {
    setCreating(false);
    setEditing(row);
    const next: Record<string, string> = {};
    meta.createFields.forEach((f) => {
      next[f] = row[f] != null ? String(row[f]) : "";
    });
    setForm(next);
  }

  async function save() {
    setErr("");
    setMsg("");
    const row: Record<string, unknown> = { ...form };
    if (row.amount_ngn != null && row.amount_ngn !== "") row.amount_ngn = Number(row.amount_ngn);
    if (row.price_ngn != null && row.price_ngn !== "") row.price_ngn = Number(row.price_ngn);
    try {
      if (creating) {
        const res = await fetch("/api/admin/records", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...session.authHeaders() },
          body: JSON.stringify({ table, row }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Create failed");
        setMsg("Created");
      } else if (editing?.id) {
        const res = await fetch("/api/admin/records", {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...session.authHeaders() },
          body: JSON.stringify({ table, id: editing.id, row }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Update failed");
        setMsg("Updated");
      }
      setCreating(false);
      setEditing(null);
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this record permanently?")) return;
    setErr("");
    try {
      const res = await fetch("/api/admin/records", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...session.authHeaders() },
        body: JSON.stringify({ table, id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      setMsg("Deleted");
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const previewCols = useMemo(() => {
    if (!rows[0]) return ["id"];
    const keys = Object.keys(rows[0]).filter((k) => !["meta", "features", "screenshots"].includes(k));
    return keys.slice(0, 6);
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Database</p>
          <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Data manager</h1>
          <p className="mt-1 text-[13px] text-[#86868b]">Full read / write / delete for core site tables</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={openCreate} className="rounded-full bg-[#ff8c14] px-4 py-2 text-[13px] font-semibold text-black">+ New record</button>
          <button type="button" onClick={() => load()} disabled={loading} className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white disabled:opacity-50">{loading ? "Loading…" : "Refresh"}</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABLES.map((t) => (
          <button key={t.id} type="button" onClick={() => { setTable(t.id); setCreating(false); setEditing(null); }} className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium ${
            table === t.id ? "bg-[#ff8c14]/15 text-[#ff8c14] ring-1 ring-[#ff8c14]/30" : "bg-white/[0.04] text-[#a1a1a6]"
          }`}>{t.label}</button>
        ))}
      </div>

      {err ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{err}</p> : null}
      {msg ? <p className="text-sm text-emerald-300">{msg}</p> : null}

      {(creating || editing) && (
        <div className="rounded-2xl border border-white/10 bg-[#121214] p-5">
          <h2 className="text-[15px] font-semibold text-white">{creating ? "Create" : "Edit"} · {meta.label}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {meta.createFields.map((f) => (
              <label key={f} className="block">
                <span className="text-[11px] uppercase tracking-wide text-[#86868b]">{f}</span>
                <input value={form[f] || ""} onChange={(e) => setForm((prev) => ({ ...prev, [f]: e.target.value }))} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]/50" />
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => save()} className="rounded-full bg-[#ff8c14] px-5 py-2 text-[13px] font-semibold text-black">Save</button>
            <button type="button" onClick={() => { setCreating(false); setEditing(null); }} className="rounded-full border border-white/15 px-5 py-2 text-[13px] text-white">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="bg-white/[0.04] text-[11px] uppercase text-[#86868b]">
            <tr>
              {previewCols.map((c) => (<th key={c} className="px-3 py-2.5 font-medium">{c}</th>))}
              <th className="px-3 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={String(r.id)} className="border-t border-white/5">
                {previewCols.map((c) => (
                  <td key={c} className="max-w-[180px] truncate px-3 py-2.5 text-[#e8e8ed]">{r[c] != null ? String(r[c]) : "—"}</td>
                ))}
                <td className="whitespace-nowrap px-3 py-2.5">
                  <button type="button" onClick={() => openEdit(r)} className="mr-2 text-[12px] text-[#2997ff] hover:underline">Edit</button>
                  <button type="button" onClick={() => remove(String(r.id))} className="text-[12px] text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 ? (
              <tr><td colSpan={previewCols.length + 1} className="px-3 py-8 text-center text-[#86868b]">No rows in {meta.label}</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-[#555]">{rows.length} row(s) · table <code className="text-[#a1a1a6]">{table}</code></p>
    </div>
  );
}
