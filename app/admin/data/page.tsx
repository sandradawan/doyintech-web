"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

type TableMeta = {
  id: string;
  label: string;
  group: string;
  createFields: string[];
  previewCols: string[];
  pk?: string;
};

const TABLES: TableMeta[] = [
  {
    // Approve online payments: set payments_status from pending_review to active (or rejected).
    id: "storefronts",
    label: "Seller shops (approve payments)",
    group: "DoyinTech Store",
    createFields: [],
    previewCols: ["name", "slug", "owner_email", "payments_status", "account_name", "created_at"],
  },
  {
    id: "storefront_orders",
    label: "Shop orders",
    group: "DoyinTech Store",
    createFields: [],
    previewCols: ["reference", "customer_name", "amount_kobo", "status", "created_at"],
  },
  {
    id: "storefront_payment_requests",
    label: "Seller payment links",
    group: "DoyinTech Store",
    createFields: [],
    previewCols: ["title", "amount_kobo", "customer_email", "status", "due_date", "created_at"],
  },
  {
    id: "site_leads",
    label: "Leads",
    group: "Website",
    createFields: ["name", "email", "phone", "product", "type", "status", "message", "source"],
    previewCols: ["name", "email", "product", "status", "created_at"],
  },
  {
    id: "site_orders",
    label: "Site orders (Paystack)",
    group: "Website",
    createFields: ["product_id", "product_name", "buyer_email", "buyer_name", "amount_kobo", "status", "paystack_reference"],
    previewCols: ["product_name", "buyer_email", "status", "amount_kobo", "created_at"],
  },
  {
    id: "site_chat_messages",
    label: "Chat messages",
    group: "Website",
    createFields: ["role", "content", "name", "email", "session_id"],
    previewCols: ["role", "name", "content", "created_at"],
  },
  {
    id: "site_settings",
    label: "Site settings / pricing JSON",
    group: "Website",
    createFields: ["key", "value"],
    previewCols: ["key", "updated_at"],
    pk: "key",
  },
  {
    id: "student_projects",
    label: "Student projects",
    group: "Students",
    createFields: ["name", "email", "phone", "package_name", "stage", "status", "topic", "amount_ngn", "admin_notes"],
    previewCols: ["name", "package_name", "stage", "status", "amount_ngn"],
  },
  {
    id: "student_project_events",
    label: "Student events",
    group: "Students",
    createFields: ["project_id", "event_type", "note"],
    previewCols: ["event_type", "project_id", "note", "created_at"],
  },
  {
    id: "store_listings",
    label: "Store listings",
    group: "Store",
    createFields: [
      "title",
      "slug",
      "kind",
      "price_ngn",
      "category",
      "platform",
      "review_status",
      "developer_name",
      "developer_email",
      "short_description",
      "description",
      "launch_url",
    ],
    previewCols: ["title", "price_ngn", "review_status", "category", "developer_name"],
  },
  {
    id: "store_orders",
    label: "Store orders",
    group: "Store",
    createFields: ["product_name", "buyer_email", "status", "amount_ngn"],
    previewCols: ["product_name", "buyer_email", "status", "amount_ngn"],
  },
  {
    id: "store_developers",
    label: "Developers",
    group: "Store",
    createFields: ["display_name", "email", "phone", "membership_status", "membership_tier", "website", "bio"],
    previewCols: ["display_name", "email", "membership_status"],
  },
  {
    id: "store_reviews",
    label: "Reviews",
    group: "Store",
    createFields: ["listing_id", "reviewer_email", "reviewer_name", "rating", "body", "status"],
    previewCols: ["reviewer_name", "rating", "status", "body"],
  },
  {
    id: "store_members",
    label: "Store members",
    group: "Store",
    createFields: ["email", "display_name", "phone", "status"],
    previewCols: ["email", "display_name", "status"],
  },
  {
    id: "ops_workspaces",
    label: "Ops workspaces",
    group: "Ops",
    createFields: ["user_id", "payload"],
    previewCols: ["user_id", "updated_at"],
    pk: "user_id",
  },
  {
    id: "ops_payment_events",
    label: "Ops payment events",
    group: "Ops",
    createFields: ["invoice_number", "reference", "amount_kobo", "email"],
    previewCols: ["invoice_number", "email", "amount_kobo", "paid_at"],
  },
];

type TableId = (typeof TABLES)[number]["id"];

export default function AdminDataPage() {
  const session = useAdminSession();
  const [table, setTable] = useState<TableId>("site_leads");
  const [rows, setRows] = useState<Array<Record<string, unknown>>>([]);
  const [pk, setPk] = useState("id");
  const [writable, setWritable] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const meta = useMemo(() => TABLES.find((t) => t.id === table)!, [table]);
  const groups = useMemo(() => {
    const g = new Map<string, TableMeta[]>();
    for (const t of TABLES) {
      if (!g.has(t.group)) g.set(t.group, []);
      g.get(t.group)!.push(t);
    }
    return [...g.entries()];
  }, []);

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    setErr("");
    try {
      const params = new URLSearchParams({ table, limit: "200" });
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/records?${params}`, {
        headers: { ...session.authHeaders() },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.hint || "Failed to load");
      setRows(json.rows || []);
      setPk(json.pk || meta.pk || "id");
      setWritable(json.writable || meta.createFields);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [session, table, q, meta.pk, meta.createFields]);

  useEffect(() => {
    if (session.isAdmin) void load();
  }, [session.isAdmin, table]); // eslint-disable-line react-hooks/exhaustive-deps

  function openCreate() {
    setCreating(true);
    setEditing(null);
    const blank: Record<string, string> = {};
    meta.createFields.forEach((f) => {
      blank[f] =
        f === "status"
          ? "new"
          : f === "review_status"
            ? "draft"
            : f === "role"
              ? "user"
              : f === "kind"
                ? "digital_product"
                : f === "value" || f === "payload"
                  ? "{}"
                  : "";
    });
    setForm(blank);
  }

  function openEdit(row: Record<string, unknown>) {
    setCreating(false);
    setEditing(row);
    const fields = writable.length ? writable : meta.createFields;
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      const v = row[f];
      if (v != null && typeof v === "object") next[f] = JSON.stringify(v);
      else next[f] = v != null ? String(v) : "";
    });
    setForm(next);
  }

  function rowId(row: Record<string, unknown>) {
    return String(row[pk] ?? row.id ?? row.key ?? row.user_id ?? "");
  }

  async function save() {
    setErr("");
    setMsg("");
    const row: Record<string, unknown> = { ...form };
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
      } else if (editing) {
        const id = rowId(editing);
        const res = await fetch("/api/admin/records", {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...session.authHeaders() },
          body: JSON.stringify({ table, id, row }),
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
    if (!id || !confirm(`Delete this row (${id})? This cannot be undone.`)) return;
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

  const formFields = editing || creating ? (writable.length ? writable : meta.createFields) : meta.createFields;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Control plane</p>
        <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Database · full CRUD</h1>
        <p className="mt-1 text-[13px] text-[#86868b]">
          Create, read, update, and delete every operational table. Catalog prices use{" "}
          <a href="/admin/pricing" className="text-[#2997ff] hover:underline">
            Pricing
          </a>
          ; page copy still ships from code unless stored in site_settings.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <aside className="w-full shrink-0 space-y-4 lg:w-56">
          {groups.map(([group, items]) => (
            <div key={group}>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#555]">{group}</p>
              <div className="flex flex-col gap-1">
                {items.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTable(t.id);
                      setCreating(false);
                      setEditing(null);
                      setQ("");
                    }}
                    className={`rounded-xl px-3 py-2 text-left text-[13px] ${
                      table === t.id
                        ? "bg-[#ff8c14]/15 font-medium text-[#ff8c14]"
                        : "text-[#a1a1a6] hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Filter loaded rows…"
              className="min-w-[160px] flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]/50"
            />
            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white disabled:opacity-50"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-full bg-[#ff8c14] px-4 py-2 text-[13px] font-semibold text-black"
            >
              + Create
            </button>
          </div>

          {err ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{err}</p>
          ) : null}
          {msg ? <p className="text-sm text-emerald-300">{msg}</p> : null}

          {(creating || editing) && (
            <div className="rounded-2xl border border-white/10 bg-[#121214] p-5">
              <h2 className="text-[15px] font-semibold text-white">
                {creating ? "Create" : "Edit"} · {meta.label}
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {formFields.map((f) => (
                  <label
                    key={f}
                    className={`block ${
                      ["message", "description", "body", "content", "value", "payload"].includes(f)
                        ? "sm:col-span-2"
                        : ""
                    }`}
                  >
                    <span className="text-[11px] uppercase tracking-wide text-[#86868b]">{f}</span>
                    {["message", "description", "body", "content", "value", "payload", "admin_notes", "bio"].includes(
                      f
                    ) ? (
                      <textarea
                        value={form[f] || ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f]: e.target.value }))}
                        rows={3}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]/50"
                      />
                    ) : (
                      <input
                        value={form[f] || ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, [f]: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]/50"
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => save()}
                  className="rounded-full bg-[#ff8c14] px-5 py-2 text-[13px] font-semibold text-black"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false);
                    setEditing(null);
                  }}
                  className="rounded-full border border-white/15 px-5 py-2 text-[13px] text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[640px] text-left text-[13px]">
              <thead className="bg-white/[0.04] text-[11px] uppercase text-[#86868b]">
                <tr>
                  {meta.previewCols.map((c) => (
                    <th key={c} className="px-3 py-2.5 font-medium">
                      {c}
                    </th>
                  ))}
                  <th className="px-3 py-2.5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const id = rowId(r);
                  return (
                    <tr key={id || JSON.stringify(r).slice(0, 40)} className="border-t border-white/5">
                      {meta.previewCols.map((c) => (
                        <td key={c} className="max-w-[180px] truncate px-3 py-2.5 text-[#e8e8ed]">
                          {r[c] != null && typeof r[c] === "object"
                            ? JSON.stringify(r[c]).slice(0, 80)
                            : r[c] != null
                              ? String(r[c])
                              : "—"}
                        </td>
                      ))}
                      <td className="whitespace-nowrap px-3 py-2.5">
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="mr-2 text-[12px] text-[#2997ff] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(id)}
                          className="text-[12px] text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {!loading && rows.length === 0 ? (
                  <tr>
                    <td colSpan={meta.previewCols.length + 1} className="px-3 py-8 text-center text-[#86868b]">
                      No rows in {meta.label}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="text-[12px] text-[#555]">
            {rows.length} row(s) · <code className="text-[#a1a1a6]">{table}</code> · pk{" "}
            <code className="text-[#a1a1a6]">{pk}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
