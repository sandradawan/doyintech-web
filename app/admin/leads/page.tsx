"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

type Lead = {
  id: string;
  created_at: string;
  type: string;
  product: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  source?: string | null;
  message?: string | null;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

export default function AdminLeadsPage() {
  const session = useAdminSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", product: "General", type: "lead-magnet", status: "new", message: "",
  });

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/records?table=site_leads&limit=200", {
        headers: { ...session.authHeaders() },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load leads");
      setLeads(json.rows || []);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session.isAdmin) void load();
  }, [session.isAdmin, load]);

  async function setStatus(id: string, status: string) {
    try {
      const res = await fetch("/api/admin/records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...session.authHeaders() },
        body: JSON.stringify({ table: "site_leads", id, row: { status } }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Update failed");
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function createLead() {
    try {
      const res = await fetch("/api/admin/records", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...session.authHeaders() },
        body: JSON.stringify({ table: "site_leads", row: form }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Create failed");
      setShowNew(false);
      setForm({ name: "", email: "", phone: "", product: "General", type: "lead-magnet", status: "new", message: "" });
      await load();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Create failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    try {
      const res = await fetch("/api/admin/records", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...session.authHeaders() },
        body: JSON.stringify({ table: "site_leads", id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const filtered = useMemo(() => {
    let rows = leads;
    if (filter !== "all") rows = rows.filter((l) => l.status === filter);
    const needle = q.trim().toLowerCase();
    if (needle) {
      rows = rows.filter((l) =>
        [l.name, l.email, l.phone, l.product, l.type, l.message]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(needle))
      );
    }
    return rows;
  }, [leads, filter, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Inbox</p>
          <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Leads</h1>
          <p className="mt-1 text-[13px] text-[#86868b]">Read, update status, create, and delete</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowNew((v) => !v)} className="rounded-full bg-[#ff8c14] px-4 py-2 text-[13px] font-semibold text-black">+ New lead</button>
          <button type="button" onClick={() => load()} disabled={loading} className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white disabled:opacity-50">{loading ? "Loading…" : "Refresh"}</button>
        </div>
      </div>

      {err ? <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{err}</p> : null}

      {showNew ? (
        <div className="rounded-2xl border border-white/10 bg-[#121214] p-5">
          <h2 className="text-[14px] font-semibold text-white">Create lead</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(["name", "email", "phone", "product", "type", "message"] as const).map((f) => (
              <label key={f} className="block">
                <span className="text-[11px] text-[#86868b]">{f}</span>
                <input value={form[f]} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]/50" />
              </label>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => createLead()} className="rounded-full bg-[#ff8c14] px-4 py-2 text-[13px] font-semibold text-black">Save</button>
            <button type="button" onClick={() => setShowNew(false)} className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white">Cancel</button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]/50" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-wide text-[#86868b]">
            <tr>
              <th className="px-3 py-2.5 font-medium">Lead</th>
              <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Product</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-white/5">
                <td className="px-3 py-3">
                  <p className="font-medium text-white">{l.name}</p>
                  <p className="text-[12px] text-[#a1a1a6]">{l.email || l.phone || "—"}</p>
                </td>
                <td className="hidden px-3 py-3 text-[#a1a1a6] sm:table-cell">{l.product}<span className="block text-[11px] text-[#86868b]">{l.type}</span></td>
                <td className="px-3 py-3">
                  <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-[12px] text-white">
                    {STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <button type="button" onClick={() => remove(l.id)} className="text-[12px] text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-[#86868b]">No leads match.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
