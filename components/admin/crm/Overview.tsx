"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/admin/client";
import { Badge, ErrorNote, PageHeader, Spinner, btn, formatDate, naira, panel, relativeTime } from "@/components/admin/crm/ui";

type Lead = { id: string; name: string; company: string | null; product: string | null; status: string; value_ngn: number | null; next_follow_up: string | null; created_at: string };
type Data = {
  pipeline: { stages: { stage: string; count: number; value: number }[]; openCount: number; openValue: number } | null;
  leads: { new7: number; new30: number; recent: Lead[]; followUps: Lead[] } | null;
  tasks: { id: string; kind: string; body: string; due_at: string; lead_id: string | null; contact_email: string | null }[] | null;
  revenue: { last30: number; prev30: number; payments30: number; enquiries30: number; enquiriesPrev30: number } | null;
  subscriptions: { active: number; mrrKobo: number } | null;
  store: { shops: number; pendingApproval: number; fees30: number } | null;
  subscribers: number | null;
  audit: { actor: string; action: string; resource: string; record_id: string | null; created_at: string }[] | null;
};

function trend(now: number, prev: number) {
  if (!prev) return now ? "new" : "";
  const pct = Math.round(((now - prev) / prev) * 100);
  return `${pct >= 0 ? "▲" : "▼"} ${Math.abs(pct)}% vs previous 30 days`;
}

/** CRM home: money, pipeline, what needs doing today, and recent changes. */
export default function Overview() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await adminApi<Data>("/api/admin/crm/overview"));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
     
    void load();
  }, [load]);

  const maxStage = Math.max(1, ...(data?.pipeline?.stages.map((s) => s.count) || [1]));

  return (
    <div>
      <PageHeader
        eyebrow="Command center"
        title="Overview"
        description="Revenue, pipeline and today's follow-ups at a glance."
        actions={
          <>
            <button type="button" onClick={load} className={btn.ghost} disabled={loading}>
              {loading ? <Spinner /> : "Refresh"}
            </button>
            <Link href="/admin/pipeline" className={btn.primary}>
              Open pipeline
            </Link>
          </>
        }
      />
      {error && <div className="mb-4"><ErrorNote message={error} /></div>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Revenue, last 30 days"
          value={data?.revenue ? naira(data.revenue.last30 / 100) : "—"}
          sub={data?.revenue ? trend(data.revenue.last30, data.revenue.prev30) : undefined}
          href="/admin/conversions"
        />
        <Kpi
          label="Monthly recurring"
          value={data?.subscriptions ? naira(data.subscriptions.mrrKobo / 100) : "—"}
          sub={data?.subscriptions ? `${data.subscriptions.active} active subscriptions` : undefined}
          href="/admin/r/subscriptions?f_status=active"
        />
        <Kpi
          label="Open pipeline"
          value={data?.pipeline ? naira(data.pipeline.openValue) : "—"}
          sub={data?.pipeline ? `${data.pipeline.openCount} open deals` : undefined}
          href="/admin/pipeline"
        />
        <Kpi
          label="Enquiries, last 30 days"
          value={data?.revenue ? String(data.revenue.enquiries30) : data?.leads ? String(data.leads.new30) : "—"}
          sub={data?.revenue ? trend(data.revenue.enquiries30, data.revenue.enquiriesPrev30) : undefined}
          href="/admin/r/site_leads"
        />
        <Kpi label="New leads this week" value={data?.leads ? String(data.leads.new7) : "—"} href="/admin/r/site_leads?f_status=new" />
        <Kpi label="Email subscribers" value={data?.subscribers != null ? data.subscribers.toLocaleString() : "—"} href="/admin/r/email_subscribers" />
        <Kpi
          label="Seller shops"
          value={data?.store ? String(data.store.shops) : "—"}
          sub={data?.store?.pendingApproval ? `${data.store.pendingApproval} waiting for payment approval` : undefined}
          alert={Boolean(data?.store?.pendingApproval)}
          href="/admin/r/storefronts?f_payments_status=pending_review"
        />
        <Kpi label="Shop fees, last 30 days" value={data?.store ? naira(data.store.fees30 / 100) : "—"} href="/admin/r/storefront_orders?f_status=paid" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card title="Today" action={<Link href="/admin/r/crm_activities?f_done=false&f_kind=task" className="text-[12px] text-[#8ab4ff] hover:underline">All tasks</Link>}>
          {!data ? (
            <p className="px-4 py-6 text-[13px] text-[#86868b]">Loading…</p>
          ) : (data.leads?.followUps.length || 0) + (data.tasks?.length || 0) === 0 ? (
            <p className="px-4 py-6 text-[13px] text-[#86868b]">Nothing due. Set a follow-up date on a lead or add a task to see it here.</p>
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {data.tasks?.map((t) => (
                <li key={t.id}>
                  <Link
                    href={t.lead_id ? `/admin/r/site_leads?open=${t.lead_id}` : t.contact_email ? `/admin/contacts?email=${encodeURIComponent(t.contact_email)}` : `/admin/r/crm_activities?open=${t.id}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03]"
                  >
                    <Badge value="task" tone={new Date(t.due_at) < new Date() ? "red" : "orange"} />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[13px] text-white">{t.body}</span>
                      <span className="text-[11px] text-[#86868b]">Due {formatDate(t.due_at, true)}</span>
                    </span>
                  </Link>
                </li>
              ))}
              {data.leads?.followUps.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/r/site_leads?open=${l.id}`} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03]">
                    <Badge value="follow up" tone="violet" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-white">
                        {l.name}
                        {l.company ? ` · ${l.company}` : ""}
                      </span>
                      <span className="text-[11px] text-[#86868b]">
                        {l.status} · due {formatDate(l.next_follow_up)}
                        {l.value_ngn ? ` · ${naira(Number(l.value_ngn))}` : ""}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Pipeline by stage" action={<Link href="/admin/pipeline" className="text-[12px] text-[#8ab4ff] hover:underline">Board</Link>}>
          <ul className="space-y-2.5 px-4 py-4">
            {data?.pipeline?.stages.map((s) => (
              <li key={s.stage} className="grid grid-cols-[92px_1fr_auto] items-center gap-3 text-[12px]">
                <span className="capitalize text-[#c7c7cc]">{s.stage}</span>
                <span className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                  <span className="block h-full rounded-full bg-[#ff8c14]" style={{ width: `${(s.count / maxStage) * 100}%` }} />
                </span>
                <span className="tabular-nums text-white">
                  {s.count}
                  {s.value ? <span className="text-[#86868b]"> · {naira(s.value)}</span> : null}
                </span>
              </li>
            ))}
            {!data?.pipeline && <li className="text-[13px] text-[#86868b]">No pipeline data yet.</li>}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Newest leads" action={<Link href="/admin/r/site_leads" className="text-[12px] text-[#8ab4ff] hover:underline">All leads</Link>}>
          <ul className="divide-y divide-white/[0.05]">
            {data?.leads?.recent.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/r/site_leads?open=${l.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-white/[0.03]">
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-white">{l.name}</span>
                    <span className="block truncate text-[11px] text-[#86868b]">
                      {l.product || "General"} · {relativeTime(l.created_at)}
                    </span>
                  </span>
                  <Badge value={l.status || "new"} />
                </Link>
              </li>
            ))}
            {data?.leads?.recent.length === 0 && <li className="px-4 py-6 text-[13px] text-[#86868b]">No leads yet.</li>}
          </ul>
        </Card>
        <Card title="Recent admin changes" action={<Link href="/admin/r/admin_audit_log" className="text-[12px] text-[#8ab4ff] hover:underline">Audit log</Link>}>
          <ul className="divide-y divide-white/[0.05]">
            {data?.audit?.map((a, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3 text-[12px]">
                <Badge value={a.action} />
                <span className="min-w-0 flex-1 truncate text-[#c7c7cc]">
                  {a.resource.replace(/_/g, " ")} <span className="text-[#6e6e73]">{a.record_id?.slice(0, 8)}</span>
                </span>
                <span className="shrink-0 text-[#86868b]">
                  {a.actor.split("@")[0]} · {relativeTime(a.created_at)}
                </span>
              </li>
            ))}
            {(!data?.audit || data.audit.length === 0) && <li className="px-4 py-6 text-[13px] text-[#86868b]">No changes recorded yet.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, href, alert }: { label: string; value: string; sub?: string; href: string; alert?: boolean }) {
  return (
    <Link href={href} className={`${panel} block px-4 py-4 transition hover:border-white/20 ${alert ? "!border-[#ff8c14]/40" : ""}`}>
      <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{label}</p>
      <p className="mt-1.5 text-[22px] font-semibold tabular-nums tracking-tight text-white">{value}</p>
      {sub && <p className={`mt-0.5 text-[11px] ${alert ? "text-[#ffb366]" : sub.startsWith("▼") ? "text-red-300" : sub.startsWith("▲") ? "text-emerald-300" : "text-[#86868b]"}`}>{sub}</p>}
    </Link>
  );
}

function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className={panel}>
      <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <h2 className="text-[13px] font-semibold text-white">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}
