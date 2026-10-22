"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi } from "@/lib/admin/client";
import { LEAD_STAGES, getResource } from "@/lib/admin/resources";
import RecordDrawer from "@/components/admin/crm/RecordDrawer";
import { ErrorNote, PageHeader, Spinner, btn, formatDate, inputCls, naira } from "@/components/admin/crm/ui";

type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  product: string | null;
  status: string;
  value_ngn: number | null;
  next_follow_up: string | null;
  created_at: string;
  [k: string]: unknown;
};
type Column = { rows: Lead[]; total: number };

const STAGE_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal sent",
  won: "Won",
  lost: "Lost",
};
const STAGE_ACCENT: Record<string, string> = {
  new: "bg-sky-400",
  contacted: "bg-violet-400",
  qualified: "bg-amber-400",
  proposal: "bg-[#ff8c14]",
  won: "bg-emerald-400",
  lost: "bg-red-400",
};

const leadsResource = getResource("site_leads")!;
const PER_STAGE = 50;

/** Kanban of leads by stage: drag a card (or use "Move to") to change stage; click to open. */
export default function PipelineBoard() {
  const [cols, setCols] = useState<Record<string, Column>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState<{ record: Lead | null } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        LEAD_STAGES.map((s) =>
          adminApi<{ rows: Lead[]; total: number }>(
            `/api/admin/crud/site_leads?f_status=${s}&pageSize=${PER_STAGE}&sort=created_at&dir=desc${query ? `&q=${encodeURIComponent(query)}` : ""}`
          )
        )
      );
      setCols(Object.fromEntries(LEAD_STAGES.map((s, i) => [s, { rows: results[i].rows, total: results[i].total }])));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the pipeline");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
     
    void load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  async function move(lead: Lead, to: string) {
    if (lead.status === to) return;
    const from = lead.status;
    // Optimistic move, rolled back on error.
    setCols((c) => {
      const next = { ...c };
      next[from] = { rows: next[from].rows.filter((l) => l.id !== lead.id), total: next[from].total - 1 };
      next[to] = { rows: [{ ...lead, status: to }, ...next[to].rows], total: next[to].total + 1 };
      return next;
    });
    try {
      await adminApi("/api/admin/crud/site_leads", { method: "PATCH", body: JSON.stringify({ id: lead.id, row: { status: to } }) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not move the lead");
      void load();
    }
  }

  const openValue = LEAD_STAGES.filter((s) => s !== "won" && s !== "lost").reduce(
    (n, s) => n + (cols[s]?.rows.reduce((m, l) => m + (Number(l.value_ngn) || 0), 0) || 0),
    0
  );
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <PageHeader
        eyebrow="CRM"
        title="Pipeline"
        description="Drag leads between stages. Stage changes are logged on the lead's timeline."
        actions={
          <button type="button" onClick={() => setDrawer({ record: null })} className={btn.primary}>
            + New lead
          </button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads…" aria-label="Search leads" className={`${inputCls} max-w-sm`} />
        <span className="text-[13px] text-[#86868b]">
          Open pipeline <strong className="text-white">{naira(openValue)}</strong>
        </span>
        {loading && <Spinner />}
      </div>
      {error && <div className="mb-3"><ErrorNote message={error} /></div>}

      <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
        <div className="grid min-w-[1100px] grid-cols-6 gap-3">
          {LEAD_STAGES.map((stage) => {
            const col = cols[stage] || { rows: [], total: 0 };
            const value = col.rows.reduce((n, l) => n + (Number(l.value_ngn) || 0), 0);
            return (
              <section
                key={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(stage);
                }}
                onDragLeave={() => setDragOver((s) => (s === stage ? null : s))}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  const id = e.dataTransfer.getData("text/lead");
                  const lead = LEAD_STAGES.flatMap((s) => cols[s]?.rows || []).find((l) => l.id === id);
                  if (lead) void move(lead, stage);
                }}
                className={`flex min-h-[420px] flex-col rounded-2xl border bg-[#0b0d13] transition ${
                  dragOver === stage ? "border-[#ff8c14]/60 bg-[#ff8c14]/[0.04]" : "border-white/[0.07]"
                }`}
              >
                <header className="border-b border-white/[0.06] px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${STAGE_ACCENT[stage]}`} />
                    <h2 className="text-[13px] font-semibold text-white">{STAGE_LABEL[stage]}</h2>
                    <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-[#a1a1a6]">{col.total}</span>
                  </div>
                  {value > 0 && <p className="mt-1 text-[11px] text-[#86868b]">{naira(value)}</p>}
                </header>
                <div className="flex-1 space-y-2 p-2">
                  {col.rows.map((l) => {
                    const overdue = l.next_follow_up && l.next_follow_up <= today && stage !== "won" && stage !== "lost";
                    return (
                      <article
                        key={l.id}
                        draggable
                        onDragStart={(e) => e.dataTransfer.setData("text/lead", l.id)}
                        onClick={() => setDrawer({ record: l })}
                        className="cursor-pointer rounded-xl border border-white/[0.07] bg-[#11141c] p-3 transition hover:border-white/20"
                      >
                        <p className="truncate text-[13px] font-semibold text-white">{l.name}</p>
                        {(l.company || l.product) && <p className="truncate text-[12px] text-[#a1a1a6]">{l.company || l.product}</p>}
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                          {l.value_ngn ? <span className="font-semibold text-[#ffb366]">{naira(Number(l.value_ngn))}</span> : null}
                          {l.next_follow_up && (
                            <span className={overdue ? "font-semibold text-red-300" : "text-[#86868b]"}>
                              {overdue ? "Follow up " : "Next "}
                              {formatDate(l.next_follow_up)}
                            </span>
                          )}
                        </div>
                        <select
                          aria-label={`Move ${l.name}`}
                          value=""
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => e.target.value && void move(l, e.target.value)}
                          className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-[11px] text-[#a1a1a6] outline-none"
                        >
                          <option value="">Move to…</option>
                          {LEAD_STAGES.filter((s) => s !== stage).map((s) => (
                            <option key={s} value={s}>
                              {STAGE_LABEL[s]}
                            </option>
                          ))}
                        </select>
                      </article>
                    );
                  })}
                  {col.total > col.rows.length && (
                    <p className="px-1 text-center text-[11px] text-[#6e6e73]">+{col.total - col.rows.length} more. Use search or the Leads table.</p>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {drawer && (
        <RecordDrawer
          open
          resource={leadsResource}
          record={drawer.record}
          onClose={() => setDrawer(null)}
          onSaved={(row) => {
            setDrawer({ record: row as Lead });
            void load();
          }}
          onDeleted={() => {
            setDrawer(null);
            void load();
          }}
        />
      )}
    </div>
  );
}
