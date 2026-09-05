"use client";

import { useState } from "react";
import Link from "next/link";
import LeadForm from "./LeadForm";

const field =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50";
const btn =
  "rounded-xl bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50";
const box = "rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-6 space-y-4";

async function runLite(url: string, mode: string) {
  const res = await fetch("/api/security-lite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, mode }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || "Failed");
  return data;
}

function UrlForm({
  onSubmit,
  loading,
  label = "Analyze",
}: {
  onSubmit: (url: string) => void;
  loading: boolean;
  label?: string;
}) {
  const [url, setUrl] = useState("");
  return (
    <form
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(url.trim());
      }}
    >
      <input
        className={field}
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit" disabled={loading || !url.trim()} className={btn}>
        {loading ? "Working…" : label}
      </button>
    </form>
  );
}

function Err({ error }: { error: string | null }) {
  if (!error) return null;
  return <p className="text-sm text-red-400">{error}</p>;
}

// ——— Headers ———
export function SecurityHeadersTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  async function go(url: string) {
    setLoading(true);
    setError(null);
    try {
      setData(await runLite(url, "headers"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={box}>
      <UrlForm onSubmit={go} loading={loading} label="Check headers" />
      <Err error={error} />
      {data && (
        <div className="space-y-3">
          <p className="text-2xl font-bold text-white">
            Score {data.score}/100 · Grade {data.grade}
          </p>
          <ul className="space-y-2">
            {data.headers?.map((h: any) => (
              <li
                key={h.key}
                className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-white">{h.name}</span>
                  <span className={h.ok ? "text-green-400" : "text-red-400"}>
                    {h.ok ? "Present" : "Missing"}
                  </span>
                </div>
                {h.value && (
                  <p className="mt-1 break-all font-mono text-[11px] text-gray-500">
                    {h.value}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <LeadForm tool="Security Headers Checker" />
    </div>
  );
}

// ——— SSL ———
export function SslCheckerTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  async function go(url: string) {
    setLoading(true);
    setError(null);
    try {
      setData(await runLite(url, "ssl"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={box}>
      <UrlForm onSubmit={go} loading={loading} label="Check SSL" />
      <Err error={error} />
      {data && (
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            HTTPS:{" "}
            <strong className="text-white">{data.https ? "Yes" : "No"}</strong>
          </p>
          {data.tls?.error && <p className="text-red-400">{data.tls.error}</p>}
          {data.tls && !data.tls.error && (
            <>
              <p>Protocol: {String(data.tls.protocol || "—")}</p>
              <p>Days remaining: {String(data.tls.daysRemaining ?? "—")}</p>
              <p>Issuer: {String(data.tls.issuer || "—")}</p>
              <p>Subject: {String(data.tls.subject || "—")}</p>
              <p>Valid to: {String(data.tls.validTo || "—")}</p>
              <p>
                Trusted chain:{" "}
                {data.tls.authorized ? (
                  <span className="text-green-400">Yes</span>
                ) : (
                  <span className="text-amber-400">Check chain</span>
                )}
              </p>
            </>
          )}
          {data.httpRedirectChain && (
            <div className="mt-3">
              <p className="text-xs uppercase text-gray-500">HTTP redirect probe</p>
              <ul className="mt-1 font-mono text-[11px] text-gray-400">
                {data.httpRedirectChain.map((c: any, i: number) => (
                  <li key={i}>
                    {c.status} → {c.url}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <LeadForm tool="SSL Checker" />
    </div>
  );
}

// ——— Exposed files ———
export function ExposedFilesTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  async function go(url: string) {
    setLoading(true);
    setError(null);
    try {
      setData(await runLite(url, "exposed"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Probes common sensitive paths and only flags risk when response body supports it.
      </p>
      <UrlForm onSubmit={go} loading={loading} label="Probe paths" />
      <Err error={error} />
      {data?.results && (
        <ul className="space-y-2">
          {data.results.map((r: any) => (
            <li
              key={r.path}
              className={`rounded-xl border p-3 text-sm ${
                r.risk
                  ? "border-red-500/40 bg-red-500/10"
                  : "border-white/10 bg-black/30"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-white">{r.path}</span>
                <span className="text-xs text-gray-400">HTTP {r.status ?? "—"}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{r.evidence}</p>
              {r.risk && (
                <p className="mt-1 text-xs font-semibold text-red-300">Risk flagged</p>
              )}
            </li>
          ))}
        </ul>
      )}
      <LeadForm tool="Exposed Files Checker" />
    </div>
  );
}

// ——— Cookies ———
export function CookieAuditorTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  async function go(url: string) {
    setLoading(true);
    setError(null);
    try {
      setData(await runLite(url, "cookies"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Reads Set-Cookie on the first response hop. Client-only JS cookies are not visible
        server-side.
      </p>
      <UrlForm onSubmit={go} loading={loading} label="Audit cookies" />
      <Err error={error} />
      {data && (
        <div className="space-y-2">
          <p className="text-sm text-gray-300">{data.count} cookie(s) observed</p>
          {data.cookies?.length === 0 && (
            <p className="text-sm text-gray-500">No Set-Cookie header on this response.</p>
          )}
          {data.cookies?.map((c: any, i: number) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-3 text-xs">
              <p className="break-all font-mono text-gray-400">{c.raw}</p>
              <p className="mt-2 text-gray-300">
                HttpOnly: {c.httpOnly ? "✓" : "✗"} · Secure: {c.secure ? "✓" : "✗"} ·
                SameSite: {c.sameSite || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
      <LeadForm tool="Cookie Auditor" />
    </div>
  );
}

// ——— CSP generator ———
export function CspGeneratorTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  async function go(url: string) {
    setLoading(true);
    setError(null);
    try {
      setData(await runLite(url, "csp"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Builds a starter CSP from script hosts found on the page. Test in report-only mode
        first.
      </p>
      <UrlForm onSubmit={go} loading={loading} label="Generate CSP" />
      <Err error={error} />
      {data && (
        <div className="space-y-3">
          {data.existingCsp && (
            <div>
              <p className="text-xs text-gray-500">Existing CSP</p>
              <pre className="mt-1 overflow-x-auto rounded-xl bg-black/40 p-3 text-[11px] text-gray-300">
                {data.existingCsp}
              </pre>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500">Suggested starter policy</p>
            <pre className="mt-1 overflow-x-auto rounded-xl bg-black/40 p-3 text-[11px] text-green-300">
              {data.generated}
            </pre>
          </div>
          <p className="text-xs text-gray-500">{data.note}</p>
          {data.scriptHosts?.length > 0 && (
            <p className="text-xs text-gray-400">
              Script hosts: {data.scriptHosts.join(", ")}
            </p>
          )}
        </div>
      )}
      <LeadForm tool="CSP Generator" />
    </div>
  );
}

// ——— Robots / sitemap ———
export function RobotsAuditorTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  async function go(url: string) {
    setLoading(true);
    setError(null);
    try {
      setData(await runLite(url, "robots"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={box}>
      <UrlForm onSubmit={go} loading={loading} label="Audit robots" />
      <Err error={error} />
      {data && (
        <div className="space-y-3 text-sm text-gray-300">
          <p>robots.txt: HTTP {data.robotsStatus ?? "—"}</p>
          <p>sitemap.xml: HTTP {data.sitemapStatus ?? "—"}</p>
          <p>Sitemap <loc> count: {data.sitemapHasLocs}</p>
          {data.disallows?.length > 0 && (
            <div>
              <p className="text-xs uppercase text-gray-500">Disallow rules</p>
              <ul className="mt-1 font-mono text-[11px] text-gray-400">
                {data.disallows.map((d: string) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {data.robotsText && (
            <pre className="max-h-48 overflow-auto rounded-xl bg-black/40 p-3 text-[11px] text-gray-400">
              {data.robotsText.slice(0, 3000)}
            </pre>
          )}
        </div>
      )}
      <LeadForm tool="Robots Auditor" />
    </div>
  );
}

// ——— Mixed content ———
export function MixedContentTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  async function go(url: string) {
    setLoading(true);
    setError(null);
    try {
      setData(await runLite(url, "mixed"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={box}>
      <UrlForm onSubmit={go} loading={loading} label="Find mixed content" />
      <Err error={error} />
      {data && (
        <div className="space-y-2 text-sm">
          <p className="text-gray-300">
            Page HTTPS: {data.httpsPage ? "Yes" : "No"} · HTTP URLs found:{" "}
            <strong className="text-white">{data.mixedCount}</strong>
          </p>
          <ul className="max-h-60 space-y-1 overflow-auto font-mono text-[11px] text-gray-400">
            {data.samples?.map((s: string) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      <LeadForm tool="Mixed Content Finder" />
    </div>
  );
}

// ——— Redirects ———
export function RedirectInspectorTool() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  async function go(url: string) {
    setLoading(true);
    setError(null);
    try {
      setData(await runLite(url, "redirects"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={box}>
      <UrlForm onSubmit={go} loading={loading} label="Trace redirects" />
      <Err error={error} />
      {data && (
        <div className="space-y-2 text-sm text-gray-300">
          <p>
            Hops: {data.hops} · Final:{" "}
            <span className="text-white">{data.finalUrl}</span>
          </p>
          <ol className="list-decimal space-y-1 pl-4 font-mono text-[11px] text-gray-400">
            {data.chain?.map((c: any, i: number) => (
              <li key={i}>
                {c.status ?? "—"} · {c.url}
              </li>
            ))}
          </ol>
        </div>
      )}
      <LeadForm tool="Redirect Inspector" />
    </div>
  );
}

// ——— Interactive checklists ———
function Checklist({
  title,
  items,
  toolName,
}: {
  title: string;
  items: string[];
  toolName: string;
}) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        {done}/{items.length} complete — {title}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
              className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm ${
                checked[i]
                  ? "border-primary/40 bg-primary/10 text-white"
                  : "border-white/10 text-gray-300"
              }`}
            >
              <span>{checked[i] ? "✓" : "○"}</span>
              <span>{item}</span>
            </button>
          </li>
        ))}
      </ul>
      <LeadForm tool={toolName} resultSummary={`${done}/${items.length}`} />
    </div>
  );
}

export function SmeSecurityChecklistTool() {
  return (
    <Checklist
      title="SME security basics"
      toolName="SME Security Checklist"
      items={[
        "Unique passwords for email, hosting, and banking",
        "Password manager in use for the team",
        "2FA enabled on email and critical accounts",
        "Website and plugin/theme updates current",
        "Off-site backups tested at least once",
        "Staff know not to share OTPs on WhatsApp/SMS scams",
        "Business WhatsApp uses official WhatsApp Business app",
        "Domain lock / registrar 2FA enabled",
        "Admin URLs not shared publicly",
        "Privacy policy published if collecting customer data",
      ]}
    />
  );
}

export function GoLiveChecklistTool() {
  return (
    <Checklist
      title="Website go-live security"
      toolName="Go-Live Security Checklist"
      items={[
        "HTTPS working with valid certificate",
        "HTTP redirects to HTTPS",
        "Security headers set (HSTS, CSP starter, nosniff, frame guard)",
        "Debug mode / verbose errors disabled in production",
        "Default admin passwords changed",
        "Unused plugins/themes/services removed",
        "Backups scheduled before launch",
        "Forms protected (spam + server validation)",
        "Sensitive paths (.env, .git) not public",
        "Analytics / pixels loaded only over HTTPS",
        "Contact/privacy pages live",
        "Monitoring or uptime alert configured",
      ]}
    />
  );
}

export function BreachHygieneTool() {
  return (
    <div className={box}>
      <h3 className="font-display text-lg font-bold text-white">
        If an email or password may be leaked
      </h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-300">
        <li>Change the password on the affected account immediately.</li>
        <li>Change the same password everywhere else it was reused.</li>
        <li>Turn on 2FA (authenticator app preferred over SMS).</li>
        <li>Review account recovery email/phone for hijack changes.</li>
        <li>Scan devices for malware if a password manager was compromised.</li>
        <li>Alert your bank if financial accounts used the same password.</li>
        <li>Use a password manager going forward — never reuse passwords.</li>
      </ol>
      <Link
        href="/tools/password-generator"
        className="inline-flex text-sm font-semibold text-primary hover:underline"
      >
        Generate a strong password →
      </Link>
      <LeadForm tool="Breach Hygiene Guide" />
    </div>
  );
}

export function DependencyRiskTool() {
  return (
    <div className={box}>
      <h3 className="font-display text-lg font-bold text-white">
        Why software updates are a security control
      </h3>
      <div className="space-y-3 text-sm leading-relaxed text-gray-300">
        <p>
          Most website breaches on small business sites come from outdated CMS plugins,
          themes, or abandoned JavaScript libraries — not Hollywood zero-days.
        </p>
        <p>
          <strong className="text-white">WordPress / PHP sites:</strong> keep core, themes,
          and plugins updated; remove what you do not use; limit login attempts.
        </p>
        <p>
          <strong className="text-white">Next.js / Node sites:</strong> run{" "}
          <code className="text-primary">npm audit</code> regularly, apply security patches,
          and keep Node on a supported release.
        </p>
        <p>
          <strong className="text-white">Any stack:</strong> prefer maintained dependencies,
          pin versions intentionally, and do not copy random scripts into production.
        </p>
      </div>
      <LeadForm tool="Dependency Risk Explainer" />
    </div>
  );
}
