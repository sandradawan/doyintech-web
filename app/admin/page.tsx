"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SECRET_KEY = "doyin_admin_leads_secret";

type Overview = {
  configured: boolean;
  note?: string;
  leads: {
    total: number;
    new: number;
    byStatus: Record<string, number>;
    recent: Array<{
      id: string;
      name: string;
      product: string;
      type: string;
      status: string;
      created_at: string;
      email?: string;
    }>;
  };
  students: {
    total: number;
    pending_payment: number;
    paid: number;
    byStage: Record<string, number>;
    recent: Array<{
      id: string;
      request_id: string;
      package_name: string;
      stage: string;
      status: string;
      name: string;
      topic: string;
      amount_ngn: number;
      created_at: string;
    }>;
  };
  purchases: {
    total: number;
    recent: Array<{
      id: string;
      product: string;
      name: string;
      email?: string;
      created_at: string;
      status: string;
    }>;
  };
  errors?: { leads?: string | null; students?: string | null };
};

export default function AdminCrmHome() {
  const [secret, setSecret] = useState("");
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(SECRET_KEY);
      if (s) setSecret(s);
    } catch {
      /* ignore */
    }
  }, []);

  async function load(override?: string) {
    const s = override ?? secret;
    if (!s) return;
    setLoading(true);
    setErr("");
    try {
      sessionStorage.setItem(SECRET_KEY, s);
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch("/api/admin/overview", {
        headers: { "x-admin-secret": s },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData(json);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pb-20 pt-8 lg:pt-10">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#ff8c14]">
              Control center
            </p>
            <h1 className="mt-1 font-display text-[28px] font-semibold tracking-tight text-white sm:text-[32px]">
              DoyinTech CRM
            </h1>
            <p className="mt-2 max-w-xl text-[14px] text-[#a1a1a6]">
              Leads, student projects, properties, sales, store, and ops — one dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="min-w-[180px] rounded-xl border border-white/15 bg-[#141a28] px-4 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
            />
            <button
              type="button"
              onClick={() => load()}
              disabled={loading || !secret}
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>
        </div>

        {err && <p className="mt-4 text-sm text-red-400">{err}</p>}
        {data?.note && <p className="mt-4 text-sm text-amber-400">{data.note}</p>}

        {data && (
          <>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              <Kpi label="Leads" value={data.leads.total} href="/admin/leads" />
              <Kpi label="New leads" value={data.leads.new} href="/admin/leads" accent />
              <Kpi label="Student projects" value={data.students.total} href="/admin/students" />
              <Kpi
                label="Awaiting pay"
                value={data.students.pending_payment}
                href="/admin/students"
              />
              <Kpi label="Students paid" value={data.students.paid} href="/admin/students" />
              <Kpi label="Purchases" value={data.purchases.total} href="/admin/orders" />
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <Section title="Recent leads" href="/admin/leads" empty={!data.leads.recent.length}>
                {data.leads.recent.map((l) => (
                  <Row
                    key={l.id}
                    title={l.name}
                    meta={`${l.product} · ${l.type}`}
                    badge={l.status}
                    time={l.created_at}
                  />
                ))}
              </Section>

              <Section
                title="Student projects"
                href="/admin/students"
                empty={!data.students.recent.length}
              >
                {data.students.recent.map((s) => (
                  <Row
                    key={s.id}
                    title={s.request_id}
                    meta={`${s.name} · ${s.package_name}`}
                    badge={s.stage}
                    time={s.created_at}
                    sub={s.topic}
                  />
                ))}
              </Section>

              <Section
                title="Recent purchases"
                href="/admin/orders"
                empty={!data.purchases.recent.length}
              >
                {data.purchases.recent.map((p) => (
                  <Row
                    key={p.id}
                    title={p.product}
                    meta={p.name}
                    badge={p.status}
                    time={p.created_at}
                  />
                ))}
              </Section>

              <div className="rounded-2xl border border-white/10 bg-[#141416] p-5">
                <h2 className="text-[15px] font-semibold text-white">Quick actions</h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Action href="/admin/leads" label="Lead inbox" />
                  <Action href="/admin/students" label="Student pipeline" />
                  <Action href="/admin/properties" label="Property listings" />
                  <Action href="/admin/orders" label="Orders & sales" />
                  <Action href="/real-estate" label="Public property search" />
                  <Action href="/real-estate/list" label="Agent list form" />
                  <Action href="/store/admin" label="Store listings" />
                  <Action href="/ops/app" label="DoyinOps workspace" />
                  <Action href="/admin/analytics" label="Social analytics" />
                  <Action
                    href="https://wa.me/2348085343926"
                    label="WhatsApp business"
                    external
                  />
                </div>
                {(data.errors?.leads || data.errors?.students) && (
                  <p className="mt-4 text-[12px] text-amber-400">
                    DB notes: {data.errors.leads || ""} {data.errors.students || ""}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {!data && !loading && (
          <p className="mt-12 text-center text-[14px] text-[#86868b]">
            Enter your admin secret and click Refresh to load the CRM.
          </p>
        )}
      </div>
    </main>
  );
}

function Kpi({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: number;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border px-4 py-4 transition hover:border-white/25 ${
        accent
          ? "border-[#ff8c14]/40 bg-[#ff8c14]/10"
          : "border-white/10 bg-[#141416]"
      }`}
    >
      <p className="text-[24px] font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-[#86868b]">{label}</p>
    </Link>
  );
}

function Section({
  title,
  href,
  children,
  empty,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#141416] p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-white">{title}</h2>
        <Link href={href} className="text-[12px] text-[#2997ff] hover:underline">
          Open →
        </Link>
      </div>
      <div className="mt-4 space-y-2">
        {empty ? <p className="text-[13px] text-[#86868b]">Nothing yet.</p> : children}
      </div>
    </div>
  );
}

function Row({
  title,
  meta,
  badge,
  time,
  sub,
}: {
  title: string;
  meta: string;
  badge: string;
  time: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/30 px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-white">{title}</p>
          <p className="truncate text-[12px] text-[#a1a1a6]">{meta}</p>
          {sub && <p className="mt-0.5 truncate text-[11px] text-[#86868b]">{sub}</p>}
        </div>
        <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[#a1a1a6]">
          {badge}
        </span>
      </div>
      <p className="mt-1 text-[10px] text-[#555]">
        {time ? new Date(time).toLocaleString() : ""}
      </p>
    </div>
  );
}

function Action({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const cls =
    "rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[13px] text-[#e8e8ed] transition hover:border-[#ff8c14]/40 hover:text-white";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}
