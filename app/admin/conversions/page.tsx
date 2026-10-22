"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { EVENT_LABELS, type EventName } from "@/lib/analytics/events";

type Top = { key: string; count: number }[];
type Data = {
  days: number;
  totals: Record<string, number>;
  revenueKobo: number;
  daily: { date: string; leads: number; whatsapp: number; payments: number }[];
  enquiryPages: Top;
  salePages: Top;
  sources: Top;
  downloads: Top;
  sequences: Record<string, { active: number; finished: number; converted: number; unsubscribed: number }>;
  truncated: boolean;
};

const FUNNEL: EventName[] = ["cta_click", "tool_download", "newsletter_signup", "whatsapp_click", "lead", "checkout_start", "payment"];

const SEQUENCE_NAMES: Record<string, string> = {
  general: "General list",
  tools: "Tool users",
  lead: "Website leads",
  store: "Shop sellers",
};

const naira = (kobo: number) => "₦" + Math.round(kobo / 100).toLocaleString("en-NG");

export default function AdminConversionsPage() {
  const session = useAdminSession();
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/conversions?days=${days}`, { headers: { ...session.authHeaders() } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not load conversions");
      setData(json);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [session, days]);

  useEffect(() => {
    if (session.isAdmin) void load();
  }, [session.isAdmin, load]);

  const t = data?.totals || {};
  const peak = Math.max(1, ...(data?.daily || []).map((d) => d.leads + d.whatsapp + d.payments));
  const funnelPeak = Math.max(1, ...FUNNEL.map((n) => t[n] || 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Growth</p>
          <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Conversions</h1>
          <p className="mt-1 text-[13px] text-[#86868b]">Which pages and sources bring enquiries and sales, and how the follow-up emails are doing.</p>
        </div>
        <div className="flex gap-1 rounded-full border border-white/10 p-1">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${days === d ? "bg-white text-black" : "text-[#a1a1a6] hover:text-white"}`}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-[13px] text-[#86868b]">Loading…</p>}
      {err && <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">{err}</p>}

      {data && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Enquiries (forms + WhatsApp)" value={(t.lead || 0) + (t.whatsapp_click || 0)} />
            <Kpi label="Payments" value={(t.payment || 0) + (t.subscription_payment || 0)} />
            <Kpi label="Revenue tracked" value={naira(data.revenueKobo)} />
            <Kpi label="Shops created" value={t.shop_created || 0} />
          </div>

          <Panel title="Daily: leads, WhatsApp clicks and payments">
            <div className="flex h-32 items-end gap-[2px]">
              {data.daily.map((d) => {
                const total = d.leads + d.whatsapp + d.payments;
                return (
                  <div
                    key={d.date}
                    title={`${d.date}: ${d.leads} leads, ${d.whatsapp} WhatsApp, ${d.payments} payments`}
                    className="flex min-w-0 flex-1 flex-col-reverse overflow-hidden rounded-t"
                    style={{ height: `${Math.max(2, (total / peak) * 100)}%` }}
                  >
                    {total === 0 ? (
                      <span className="h-full bg-white/5" />
                    ) : (
                      <>
                        <span className="bg-[#2997ff]" style={{ flex: d.leads }} />
                        <span className="bg-[#25D366]" style={{ flex: d.whatsapp }} />
                        <span className="bg-[#ff8c14]" style={{ flex: d.payments }} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-[12px] text-[#a1a1a6]">
              <Legend color="#2997ff" label="Leads" />
              <Legend color="#25D366" label="WhatsApp clicks" />
              <Legend color="#ff8c14" label="Payments" />
            </div>
          </Panel>

          <Panel title="Funnel">
            <ul className="space-y-2">
              {FUNNEL.map((n) => (
                <li key={n} className="grid grid-cols-[170px_1fr_60px] items-center gap-3 text-[13px]">
                  <span className="text-[#c7cdd8]">{EVENT_LABELS[n]}</span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-white/5">
                    <span className="block h-full rounded-full bg-[#ff8c14]" style={{ width: `${((t[n] || 0) / funnelPeak) * 100}%` }} />
                  </span>
                  <span className="text-right tabular-nums text-white">{(t[n] || 0).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <TopList title="Pages that bring enquiries" rows={data.enquiryPages} empty="No enquiries yet." />
            <TopList title="What sells" rows={data.salePages} empty="No payments yet." />
            <TopList title="Sources (visitors who accepted analytics)" rows={data.sources} empty="No tagged sources yet. Add ?utm_source=… to links you share." />
            <TopList title="Tools people save PDFs from" rows={data.downloads} empty="No tool downloads yet." />
          </div>

          <Panel title="Follow-up emails">
            {Object.keys(data.sequences).length === 0 ? (
              <p className="text-[13px] text-[#86868b]">No subscribers yet.</p>
            ) : (
              <table className="w-full text-left text-[13px]">
                <thead className="text-[11px] uppercase tracking-wide text-[#86868b]">
                  <tr>
                    <th className="py-2 font-medium">Sequence</th>
                    <th className="py-2 text-right font-medium">Receiving</th>
                    <th className="py-2 text-right font-medium">Finished</th>
                    <th className="py-2 text-right font-medium">Paid</th>
                    <th className="py-2 text-right font-medium">Unsubscribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white">
                  {Object.entries(data.sequences).map(([k, s]) => (
                    <tr key={k}>
                      <td className="py-2">{SEQUENCE_NAMES[k] || k}</td>
                      <td className="py-2 text-right tabular-nums">{s.active}</td>
                      <td className="py-2 text-right tabular-nums">{s.finished}</td>
                      <td className="py-2 text-right tabular-nums text-emerald-300">{s.converted}</td>
                      <td className="py-2 text-right tabular-nums text-[#86868b]">{s.unsubscribed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          {data.truncated && <p className="text-[12px] text-[#86868b]">Showing the most recent 20,000 events in this period.</p>}
        </>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <p className="font-display text-[22px] font-semibold text-white">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-[#86868b]">{label}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="mb-4 text-[14px] font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} /> {label}
    </span>
  );
}

function TopList({ title, rows, empty }: { title: string; rows: Top; empty: string }) {
  return (
    <Panel title={title}>
      {rows.length === 0 ? (
        <p className="text-[13px] text-[#86868b]">{empty}</p>
      ) : (
        <ul className="space-y-1.5 text-[13px]">
          {rows.map((r) => (
            <li key={r.key} className="flex justify-between gap-3">
              <span className="truncate text-[#c7cdd8]">{r.key}</span>
              <span className="tabular-nums text-white">{r.count}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
