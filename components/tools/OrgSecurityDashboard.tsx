"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TOOLS_CONFIG, whatsappUrl } from "@/lib/tools/config";
import LeadForm from "./LeadForm";

type Signal = {
  id: string;
  level: "ok" | "warn" | "critical" | "info";
  title: string;
  detail: string;
};

type DomainHealth = {
  domain: string;
  url: string;
  overall: "healthy" | "attention" | "critical";
  up: boolean;
  httpStatus: number | null;
  tls: { ok?: boolean; daysRemaining?: number; validTo?: string; error?: string };
  headerScore: number;
  email: { spf: boolean; dmarc: boolean };
  signals: Signal[];
  checkedAt: string;
  error?: string;
  loading?: boolean;
};

type AlertRules = {
  sslDays: number;
  minHeaderScore: number;
  requireSpf: boolean;
  requireDmarc: boolean;
  notifyUnreachable: boolean;
};

const STORAGE_DOMAINS = "doyintech_org_security_domains";
const STORAGE_RULES = "doyintech_org_security_rules";

const defaultRules: AlertRules = {
  sslDays: 14,
  minHeaderScore: 50,
  requireSpf: true,
  requireDmarc: true,
  notifyUnreachable: true,
};

function levelColor(level: string) {
  if (level === "critical") return "text-red-400 border-red-500/40 bg-red-500/10";
  if (level === "warn") return "text-amber-300 border-amber-500/40 bg-amber-500/10";
  if (level === "ok") return "text-green-400 border-green-500/30 bg-green-500/10";
  return "text-sky-300 border-sky-500/30 bg-sky-500/10";
}

function overallBadge(o: DomainHealth["overall"]) {
  if (o === "critical") return "bg-red-600 text-white";
  if (o === "attention") return "bg-amber-500 text-black";
  return "bg-green-600 text-white";
}

export default function OrgSecurityDashboard() {
  const [domains, setDomains] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [health, setHealth] = useState<Record<string, DomainHealth>>({});
  const [rules, setRules] = useState<AlertRules>(defaultRules);
  const [scanning, setScanning] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  useEffect(() => {
    try {
      const d = localStorage.getItem(STORAGE_DOMAINS);
      if (d) setDomains(JSON.parse(d));
      const r = localStorage.getItem(STORAGE_RULES);
      if (r) setRules({ ...defaultRules, ...JSON.parse(r) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_DOMAINS, JSON.stringify(domains));
  }, [domains]);

  useEffect(() => {
    localStorage.setItem(STORAGE_RULES, JSON.stringify(rules));
  }, [rules]);

  const checkOne = useCallback(async (domain: string) => {
    setHealth((h) => ({
      ...h,
      [domain]: {
        ...(h[domain] || {
          domain,
          url: `https://${domain}`,
          overall: "attention",
          up: false,
          httpStatus: null,
          tls: {},
          headerScore: 0,
          email: { spf: false, dmarc: false },
          signals: [],
          checkedAt: "",
        }),
        loading: true,
      },
    }));
    try {
      const res = await fetch("/api/org-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setHealth((h) => ({
          ...h,
          [domain]: {
            domain,
            url: `https://${domain}`,
            overall: "critical",
            up: false,
            httpStatus: null,
            tls: {},
            headerScore: 0,
            email: { spf: false, dmarc: false },
            signals: [
              {
                id: "err",
                level: "critical",
                title: "Check failed",
                detail: data.error || "Request failed",
              },
            ],
            checkedAt: new Date().toISOString(),
            loading: false,
            error: data.error,
          },
        }));
        return;
      }
      setHealth((h) => ({
        ...h,
        [domain]: { ...data, loading: false },
      }));
    } catch {
      setHealth((h) => ({
        ...h,
        [domain]: {
          domain,
          url: `https://${domain}`,
          overall: "critical",
          up: false,
          httpStatus: null,
          tls: {},
          headerScore: 0,
          email: { spf: false, dmarc: false },
          signals: [
            {
              id: "net",
              level: "critical",
              title: "Network error",
              detail: "Could not reach health API",
            },
          ],
          checkedAt: new Date().toISOString(),
          loading: false,
          error: "Network error",
        },
      }));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    if (!domains.length) return;
    setScanning(true);
    for (const d of domains) {
      await checkOne(d);
    }
    setLastRefresh(new Date().toISOString());
    setScanning(false);
  }, [domains, checkOne]);

  function addDomain() {
    const raw = input.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
    if (!raw || domains.includes(raw)) return;
    if (domains.length >= 12) return;
    setDomains((d) => [...d, raw]);
    setInput("");
    void checkOne(raw);
  }

  function removeDomain(domain: string) {
    setDomains((d) => d.filter((x) => x !== domain));
    setHealth((h) => {
      const next = { ...h };
      delete next[domain];
      return next;
    });
  }

  const alerts = useMemo(() => {
    const list: { domain: string; title: string; level: string }[] = [];
    for (const domain of domains) {
      const h = health[domain];
      if (!h || h.loading) continue;
      if (rules.notifyUnreachable && !h.up) {
        list.push({ domain, title: "Unreachable", level: "critical" });
      }
      if (
        h.tls.daysRemaining !== undefined &&
        h.tls.daysRemaining < rules.sslDays
      ) {
        list.push({
          domain,
          title: `SSL ${h.tls.daysRemaining}d left`,
          level: h.tls.daysRemaining < 7 ? "critical" : "warn",
        });
      }
      if (h.headerScore < rules.minHeaderScore) {
        list.push({
          domain,
          title: `Headers ${h.headerScore}`,
          level: "warn",
        });
      }
      if (rules.requireSpf && !h.email.spf) {
        list.push({ domain, title: "SPF missing", level: "warn" });
      }
      if (rules.requireDmarc && !h.email.dmarc) {
        list.push({ domain, title: "DMARC missing", level: "warn" });
      }
    }
    return list;
  }, [domains, health, rules]);

  const summary = useMemo(() => {
    let healthy = 0;
    let attention = 0;
    let critical = 0;
    for (const d of domains) {
      const o = health[d]?.overall;
      if (o === "healthy") healthy++;
      else if (o === "critical") critical++;
      else if (o) attention++;
    }
    return { healthy, attention, critical, total: domains.length };
  }, [domains, health]);

  const waAlertMsg =
    alerts.length > 0
      ? `Hi DoyinTech, Org Security Dashboard alerts:\n${alerts
          .slice(0, 12)
          .map((a) => `• ${a.domain}: ${a.title}`)
          .join("\n")}\nPlease help monitor/fix.`
      : `Hi DoyinTech, I want managed monitoring for my organization domains.`;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Organization Security Dashboard
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Live domain health signals
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-400">
              Add company domains. We check reachability, TLS expiry, security headers,
              SPF and DMARC — then surface live alerts. Domains stay in this browser
              (localStorage). For 24/7 managed monitoring, contact DoyinTech.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refreshAll()}
            disabled={scanning || !domains.length}
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50"
          >
            {scanning ? "Refreshing…" : "Refresh all"}
          </button>
        </div>

        <form
          className="mt-5 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            addDomain();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="example.com or https://example.com"
            className="w-full flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
          />
          <button
            type="submit"
            className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:border-primary/40"
          >
            Add domain
          </button>
        </form>
        <p className="mt-2 text-[11px] text-gray-500">
          Up to 12 domains · Last refresh:{" "}
          {lastRefresh ? new Date(lastRefresh).toLocaleString() : "never"}
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Domains", value: summary.total, color: "text-white" },
          { label: "Healthy", value: summary.healthy, color: "text-green-400" },
          { label: "Attention", value: summary.attention, color: "text-amber-300" },
          { label: "Critical", value: summary.critical, color: "text-red-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-black/30 p-4 text-center"
          >
            <p className="text-[11px] uppercase tracking-wider text-gray-500">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Alert feed */}
      <div className="rounded-3xl border border-white/10 bg-surface/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-white">Live alert feed</h3>
          <a
            href={whatsappUrl(waAlertMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
          >
            Send alerts to WhatsApp →
          </a>
        </div>
        {alerts.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            {domains.length
              ? "No rule-based alerts right now."
              : "Add a domain to start monitoring."}
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {alerts.map((a, i) => (
              <li
                key={`${a.domain}-${a.title}-${i}`}
                className={`rounded-xl border px-3 py-2 text-sm ${levelColor(
                  a.level === "critical" ? "critical" : "warn",
                )}`}
              >
                <span className="font-mono font-semibold">{a.domain}</span> — {a.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Domain cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {domains.map((domain) => {
          const h = health[domain];
          return (
            <div
              key={domain}
              className="rounded-3xl border border-white/10 bg-black/30 p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-semibold text-white">{domain}</p>
                  {h?.checkedAt && (
                    <p className="text-[11px] text-gray-500">
                      {new Date(h.checkedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {h && !h.loading && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${overallBadge(
                        h.overall,
                      )}`}
                    >
                      {h.overall}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => void checkOne(domain)}
                    className="text-[10px] font-bold uppercase text-primary"
                  >
                    {h?.loading ? "…" : "Scan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDomain(domain)}
                    className="text-[10px] font-bold uppercase text-gray-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {h?.loading && (
                <p className="mt-4 text-sm text-gray-400">Checking live signals…</p>
              )}

              {h && !h.loading && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-300 sm:grid-cols-4">
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-gray-500">Uptime</p>
                      <p className="font-semibold">{h.up ? "Up" : "Down"}</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-gray-500">SSL days</p>
                      <p className="font-semibold">
                        {h.tls.daysRemaining ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-gray-500">Headers</p>
                      <p className="font-semibold">{h.headerScore}/100</p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-2">
                      <p className="text-gray-500">Email</p>
                      <p className="font-semibold">
                        {h.email.spf ? "SPF" : "—"}/{h.email.dmarc ? "DMARC" : "—"}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-3 max-h-40 space-y-1.5 overflow-y-auto">
                    {h.signals.map((s) => (
                      <li
                        key={s.id}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs ${levelColor(
                          s.level,
                        )}`}
                      >
                        <span className="font-semibold">{s.title}</span>
                        <span className="text-gray-400"> — {s.detail}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Alert rules */}
      <div className="rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-6">
        <h3 className="font-display text-lg font-bold text-white">Alert rules</h3>
        <p className="mt-1 text-sm text-gray-400">
          Rules drive the live alert feed. Saved in this browser.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-gray-300">
            SSL alert if days remaining <
            <input
              type="number"
              min={1}
              max={90}
              value={rules.sslDays}
              onChange={(e) =>
                setRules((r) => ({ ...r, sslDays: Number(e.target.value) || 14 }))
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white"
            />
          </label>
          <label className="block text-sm text-gray-300">
            Headers alert if score <
            <input
              type="number"
              min={0}
              max={100}
              value={rules.minHeaderScore}
              onChange={(e) =>
                setRules((r) => ({
                  ...r,
                  minHeaderScore: Number(e.target.value) || 0,
                }))
              }
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-white"
            />
          </label>
          {(
            [
              ["notifyUnreachable", "Alert when site unreachable"],
              ["requireSpf", "Alert when SPF missing"],
              ["requireDmarc", "Alert when DMARC missing"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={rules[key]}
                onChange={(e) =>
                  setRules((r) => ({ ...r, [key]: e.target.checked }))
                }
                className="accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-primary/30 bg-primary/10 p-5 md:p-6">
        <h3 className="font-display text-lg font-bold text-white">
          Want this watching 24/7?
        </h3>
        <p className="mt-2 text-sm text-gray-300">
          This dashboard runs checks when you open or refresh it. Managed monitoring from{" "}
          {TOOLS_CONFIG.brand} can watch your domains on a schedule and message you on
          WhatsApp when something changes.
        </p>
        <a
          href={whatsappUrl(
            "Hi DoyinTech, I want managed Organization Security monitoring for my domains.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
        >
          Request managed monitoring
        </a>
      </div>

      <LeadForm
        tool="Organization Security Dashboard"
        resultSummary={
          domains.length
            ? `${domains.length} domains · ${alerts.length} alerts`
            : undefined
        }
        defaultMessage="Hi DoyinTech, I used the Organization Security Dashboard and want help securing our company domains."
      />
    </div>
  );
}
