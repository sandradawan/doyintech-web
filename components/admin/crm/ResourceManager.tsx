"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { adminApi, adminDownload } from "@/lib/admin/client";
import { visibleFields, type Resource } from "@/lib/admin/resources";
import RecordDrawer from "@/components/admin/crm/RecordDrawer";
import { CellValue, ErrorNote, PageHeader, Spinner, btn, inputCls, panel } from "@/components/admin/crm/ui";

type Row = Record<string, unknown>;

/** List, search, filter, sort, page, create, edit, bulk-edit, delete and export one resource. */
export default function ResourceManager({ resource }: { resource: Resource }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const fields = useMemo(() => visibleFields(resource), [resource]);
  const columns = fields.filter((f) => f.list);
  const filterFields = (resource.filters || []).map((k) => fields.find((f) => f.key === k)!).filter(Boolean);

  // URL is the source of truth for list state so views can be bookmarked and shared.
  const q = params.get("q") || "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Number(params.get("pageSize")) || 25;
  const sort = params.get("sort") || resource.orderBy;
  const dir = params.get("dir") === "asc" ? "asc" : "desc";
  const activeFilters = Object.fromEntries([...params.entries()].filter(([k]) => k.startsWith("f_")));
  const openId = params.get("open");

  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(q);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [drawer, setDrawer] = useState<{ record: Row | null } | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);

  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  const queryString = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(pageSize), sort, dir });
    if (q) p.set("q", q);
    for (const [k, v] of Object.entries(activeFilters)) p.set(k, v);
    return p.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- activeFilters is derived from params
  }, [page, pageSize, sort, dir, q, params]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi<{ rows: Row[]; total: number }>(`/api/admin/crud/${resource.id}?${queryString}`);
      setRows(data.rows);
      setTotal(data.total);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load");
    } finally {
      setLoading(false);
    }
  }, [resource.id, queryString]);

  useEffect(() => {
     
    void load();
    setSelected(new Set());
  }, [load]);

  // Debounced search box → URL.
  useEffect(() => {
    if (search === q) return;
    const t = setTimeout(() => setParams({ q: search, page: null }), 350);
    return () => clearTimeout(t);
  }, [search, q, setParams]);

  // Deep link: ?open=<id> opens that record.
  useEffect(() => {
    if (!openId) return;
    let cancelled = false;
    adminApi<{ row: Row }>(`/api/admin/crud/${resource.id}?id=${encodeURIComponent(openId)}`)
      .then((d) => !cancelled && setDrawer({ record: d.row }))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [openId, resource.id]);

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pk = resource.pk;
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(String(r[pk])));

  function toggleSort(key: string) {
    setParams({ sort: key, dir: sort === key && dir === "desc" ? "asc" : "desc", page: null });
  }

  function closeDrawer() {
    setDrawer(null);
    if (openId) setParams({ open: null });
  }

  async function bulkUpdate(key: string, value: unknown) {
    setBulkBusy(true);
    try {
      await adminApi(`/api/admin/crud/${resource.id}`, { method: "PATCH", body: JSON.stringify({ ids: [...selected], row: { [key]: value } }) });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk update failed");
    } finally {
      setBulkBusy(false);
    }
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selected.size} ${resource.label.toLowerCase()}? This can't be undone.`)) return;
    setBulkBusy(true);
    try {
      await adminApi(`/api/admin/crud/${resource.id}`, { method: "DELETE", body: JSON.stringify({ ids: [...selected] }) });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBulkBusy(false);
    }
  }

  async function exportCsv() {
    const p = new URLSearchParams(queryString);
    p.set("format", "csv");
    try {
      await adminDownload(`/api/admin/crud/${resource.id}?${p.toString()}`, `${resource.id}.csv`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    }
  }

  const bulkEditable = filterFields.filter((f) => !f.readOnly && resource.canUpdate);

  return (
    <div>
      <PageHeader
        eyebrow={resource.group}
        title={resource.label}
        description={resource.description}
        actions={
          <>
            <button type="button" onClick={exportCsv} className={btn.ghost}>
              Export CSV
            </button>
            {resource.canCreate && (
              <button type="button" onClick={() => setDrawer({ record: null })} className={btn.primary}>
                + New {resource.singular.toLowerCase()}
              </button>
            )}
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${resource.label.toLowerCase()}…`}
            aria-label="Search"
            className={inputCls}
          />
        </div>
        {filterFields.map((f) => (
          <select
            key={f.key}
            aria-label={`Filter by ${f.label}`}
            value={activeFilters[`f_${f.key}`] || ""}
            onChange={(e) => setParams({ [`f_${f.key}`]: e.target.value, page: null })}
            className={`${inputCls} !w-auto`}
          >
            <option value="">All {f.label.toLowerCase()}</option>
            {(f.type === "boolean" ? ["true", "false"] : f.options || []).map((o) => (
              <option key={o} value={o}>
                {f.type === "boolean" ? (o === "true" ? `${f.label}: yes` : `${f.label}: no`) : o.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        ))}
        {(q || Object.keys(activeFilters).length > 0) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setParams({ q: null, page: null, ...Object.fromEntries(Object.keys(activeFilters).map((k) => [k, null])) });
            }}
            className="text-[12px] text-[#8ab4ff] hover:underline"
          >
            Clear
          </button>
        )}
        <span className="ml-auto flex items-center gap-2 text-[12px] text-[#86868b]">
          {loading && <Spinner />}
          {total.toLocaleString()} {total === 1 ? "record" : "records"}
        </span>
      </div>

      {selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#ff8c14]/30 bg-[#ff8c14]/[0.07] px-3 py-2 text-[13px]">
          <span className="font-semibold text-white">{selected.size} selected</span>
          {bulkEditable.map((f) => (
            <select
              key={f.key}
              disabled={bulkBusy}
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return;
                void bulkUpdate(f.key, f.type === "boolean" ? e.target.value === "true" : e.target.value);
                e.target.value = "";
              }}
              className={`${inputCls} !w-auto !py-1.5`}
              aria-label={`Set ${f.label}`}
            >
              <option value="">Set {f.label.toLowerCase()}…</option>
              {(f.type === "boolean" ? ["true", "false"] : f.options || []).map((o) => (
                <option key={o} value={o}>
                  {f.type === "boolean" ? (o === "true" ? "Yes" : "No") : o.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          ))}
          {resource.canDelete && (
            <button type="button" disabled={bulkBusy} onClick={bulkDelete} className={`${btn.danger} !py-1.5`}>
              Delete selected
            </button>
          )}
          <button type="button" onClick={() => setSelected(new Set())} className="ml-auto text-[12px] text-[#a1a1a6] hover:text-white">
            Clear selection
          </button>
        </div>
      )}

      {error && <div className="mb-3"><ErrorNote message={error} /></div>}

      <div className={`${panel} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="border-b border-white/[0.07] bg-white/[0.02] text-[11px] uppercase tracking-wide text-[#86868b]">
              <tr>
                <th className="w-10 px-3 py-2.5">
                  <input
                    type="checkbox"
                    aria-label="Select all on this page"
                    checked={allChecked}
                    onChange={() => setSelected(allChecked ? new Set() : new Set(rows.map((r) => String(r[pk]))))}
                    className="h-4 w-4 accent-[#ff8c14]"
                  />
                </th>
                {columns.map((c) => (
                  <th key={c.key} className="px-3 py-2.5 font-medium">
                    <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 hover:text-white">
                      {c.label}
                      {sort === c.key && <span aria-hidden>{dir === "asc" ? "↑" : "↓"}</span>}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-3 py-14 text-center text-[13px] text-[#86868b]">
                    {q || Object.keys(activeFilters).length ? "Nothing matches these filters." : `No ${resource.label.toLowerCase()} yet.`}
                  </td>
                </tr>
              )}
              {rows.map((row) => {
                const id = String(row[pk]);
                return (
                  <tr key={id} className={`cursor-pointer transition hover:bg-white/[0.03] ${selected.has(id) ? "bg-[#ff8c14]/[0.05]" : ""}`} onClick={() => setDrawer({ record: row })}>
                    <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label="Select row"
                        checked={selected.has(id)}
                        onChange={() =>
                          setSelected((s) => {
                            const n = new Set(s);
                            if (n.has(id)) n.delete(id);
                            else n.add(id);
                            return n;
                          })
                        }
                        className="h-4 w-4 accent-[#ff8c14]"
                      />
                    </td>
                    {columns.map((c, i) => (
                      <td key={c.key} className={`max-w-[260px] px-3 py-2.5 align-top ${i === 0 ? "font-medium text-white" : "text-[#c7c7cc]"}`}>
                        <CellValue field={c} value={row[c.key]} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] px-3 py-2.5 text-[12px] text-[#86868b]">
          <label className="flex items-center gap-2">
            Rows
            <select value={pageSize} onChange={(e) => setParams({ pageSize: e.target.value, page: null })} className={`${inputCls} !w-auto !py-1`}>
              {[25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setParams({ page: String(page - 1) })} className={`${btn.ghost} !px-2.5 !py-1`}>
              ←
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button type="button" disabled={page >= pages} onClick={() => setParams({ page: String(page + 1) })} className={`${btn.ghost} !px-2.5 !py-1`}>
              →
            </button>
          </div>
        </div>
      </div>

      {drawer && (
        <RecordDrawer
          open
          resource={resource}
          record={drawer.record}
          onClose={closeDrawer}
          onSaved={(row) => {
            setDrawer({ record: row });
            void load();
          }}
          onDeleted={() => {
            closeDrawer();
            void load();
          }}
        />
      )}
    </div>
  );
}
