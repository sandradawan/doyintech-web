"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

type Me = {
  ok?: boolean;
  email?: string | null;
  via?: string;
  allowlistConfigured?: boolean;
  error?: string;
};

type HealthItem = {
  id: string;
  label: string;
  status: "ok" | "warn" | "fail" | "skip";
  detail: string;
};

export default function AdminSettingsPage() {
  const session = useAdminSession();
  const [me, setMe] = useState<Me | null>(null);
  const [health, setHealth] = useState<HealthItem[]>([]);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!session.accessToken) return;
    fetch("/api/admin/me", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((res) => res.json().catch(() => ({})))
      .then((json: Me) => setMe(json));
  }, [session.accessToken]);

  const runHealth = useCallback(async () => {
    if (!session.isAdmin) return;
    setChecking(true);
    const headers = { ...session.authHeaders() };
    const items: HealthItem[] = [];

    async function probe(id: string, label: string, url: string) {
      try {
        const res = await fetch(url, { headers });
        const json = await res.json().catch(() => ({}));
        if (res.status === 401) {
          items.push({ id, label, status: "fail", detail: "Unauthorized — session or allowlist" });
        } else if (!res.ok) {
          items.push({ id, label, status: "fail", detail: json.error || `HTTP ${res.status}` });
        } else if (json.configured === false) {
          items.push({ id, label, status: "warn", detail: json.note || "Backend not fully configured" });
        } else {
          items.push({ id, label, status: "ok", detail: "Responding" });
        }
      } catch (e: unknown) {
        items.push({
          id,
          label,
          status: "fail",
          detail: e instanceof Error ? e.message : "Network error",
        });
      }
    }

    await probe("me", "Auth /api/admin/me", "/api/admin/me");
    await probe("overview", "Overview KPIs", "/api/admin/overview");
    await probe("hub-store", "Store hub", "/api/admin/hub?section=store");
    await probe("hub-orders", "Orders hub", "/api/admin/hub?section=orders");
    await probe("hub-ops", "Ops hub", "/api/admin/hub?section=ops");
    await probe("pricing", "Pricing API", "/api/admin/pricing");
    await probe("records", "Database records", "/api/admin/records?table=site_leads&limit=1");

    setHealth(items);
    setChecking(false);
  }, [session]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- auto-runs the async health check (sets its loading flag) once admin is known
    if (session.isAdmin) void runHealth();
  }, [session.isAdmin, runHealth]);

  const checks = [
    { label: "Signed-in email", value: session.email || "—" },
    { label: "Admin allowlist", value: me?.allowlistConfigured ? "Configured" : "Missing ADMIN_EMAILS" },
    { label: "Auth path", value: me?.via || "session" },
    { label: "Session", value: session.authenticated ? "Active" : "None" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">System</p>
          <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Settings</h1>
          <p className="mt-1 text-[13px] text-[#86868b]">
            Admin access is email/password + ADMIN_EMAILS. Use health check below to verify every module API.
          </p>
        </div>
        <button
          type="button"
          onClick={() => runHealth()}
          disabled={checking || !session.isAdmin}
          className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white disabled:opacity-50"
        >
          {checking ? "Checking…" : "Re-run health check"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {checks.map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <p className="text-[11px] uppercase tracking-wide text-[#86868b]">{c.label}</p>
            <p className="mt-2 text-[15px] font-medium text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-[13px] font-semibold text-white">Module health</p>
        </div>
        <ul className="divide-y divide-white/5">
          {health.map((h) => (
            <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[13px]">
              <span className="text-white">{h.label}</span>
              <span
                className={
                  h.status === "ok"
                    ? "text-emerald-300"
                    : h.status === "warn"
                      ? "text-amber-200"
                      : "text-red-300"
                }
              >
                {h.status.toUpperCase()} · {h.detail}
              </span>
            </li>
          ))}
          {!health.length && !checking ? (
            <li className="px-4 py-6 text-[#86868b]">Sign in as admin to run checks.</li>
          ) : null}
        </ul>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#121214] p-5 text-[13px] leading-relaxed text-[#a1a1a6]">
        <p className="font-semibold text-white">Required Vercel env</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>
            <code className="text-[#e8e8ed]">ADMIN_EMAILS</code> — your admin email(s), comma-separated
          </li>
          <li>
            <code className="text-[#e8e8ed]">NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
            <code className="text-[#e8e8ed]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
          </li>
          <li>
            <code className="text-[#e8e8ed]">SUPABASE_SERVICE_ROLE_KEY</code> — server data access
          </li>
        </ul>
        <p className="mt-4 font-semibold text-white">Supabase Auth user</p>
        <p className="mt-2">
          Create a user in Supabase Auth with the same email as ADMIN_EMAILS, then sign in at{" "}
          <a href="/admin/login" className="text-[#2997ff] hover:underline">
            /admin/login
          </a>
          .
        </p>
        <p className="mt-4 font-semibold text-white">Optional tables</p>
        <p className="mt-2">
          Pricing overrides need <code className="text-[#e8e8ed]">site_settings</code> (
          <code className="text-[#e8e8ed]">docs/site-settings.sql</code>). Leads / store / students need their
          existing tables.
        </p>
      </div>
    </div>
  );
}
