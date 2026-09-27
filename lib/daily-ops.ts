/**
 * Shared helpers for unattended daily website operations.
 * Used by /api/cron/daily-ops
 */

export const MONEY_PATHS = [
  "/",
  "/products",
  "/hire",
  "/free-audit",
  "/pricing",
  "/tools/system-protector",
  "/status-pack",
  "/outreach/daily",
] as const;

export type HealthResult = {
  path: string;
  status: number;
  ok: boolean;
  ms: number;
};

export type DailyOpsReport = {
  ranAt: string;
  baseUrl: string;
  health: HealthResult[];
  healthOk: boolean;
  leadsLast24h: number;
  leadsSample: Array<{
    type?: string;
    product?: string;
    name?: string;
    email?: string;
    source?: string;
    created_at?: string;
  }>;
  actions: string[];
  errors: string[];
};

const DEFAULT_BASE = "https://doyintech.vercel.app";

export function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    DEFAULT_BASE
  ).replace(/\/$/, "");
}

export async function checkSiteHealth(
  baseUrl: string = siteBaseUrl()
): Promise<HealthResult[]> {
  const results: HealthResult[] = [];
  for (const path of MONEY_PATHS) {
    const start = Date.now();
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "DoyinTech-DailyOps/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      results.push({
        path,
        status: res.status,
        ok: res.status >= 200 && res.status < 400,
        ms: Date.now() - start,
      });
    } catch {
      results.push({
        path,
        status: 0,
        ok: false,
        ms: Date.now() - start,
      });
    }
  }
  return results;
}

export function formatOpsReport(report: DailyOpsReport): string {
  const fail = report.health.filter((h) => !h.ok);
  const lines = [
    `DoyinTech Daily Ops — ${report.ranAt}`,
    `Site: ${report.baseUrl}`,
    "",
    report.healthOk
      ? `Health: ALL OK (${report.health.length} money paths)`
      : `Health: ${fail.length} ISSUE(S)`,
    ...report.health.map(
      (h) => `  ${h.ok ? "✓" : "✗"} ${h.path} → ${h.status || "ERR"} (${h.ms}ms)`
    ),
    "",
    `Leads (last ~24h): ${report.leadsLast24h}`,
    ...report.leadsSample.slice(0, 8).map((l) => {
      const who = l.name || l.email || "—";
      return `  • [${l.type || "?"}] ${l.product || "—"} — ${who} (${l.source || ""})`;
    }),
    "",
    "Actions:",
    ...(report.actions.length
      ? report.actions.map((a) => `  • ${a}`)
      : ["  • None required"]),
    ...(report.errors.length
      ? ["", "Errors:", ...report.errors.map((e) => `  • ${e}`)]
      : []),
    "",
    "Manual (still needed for revenue):",
    "  • Reply WhatsApp audits within a few hours",
    "  • Close kit sales + hire deposits",
    "  • Do not auto-deploy unreviewed code",
  ];
  return lines.join("\n");
}
