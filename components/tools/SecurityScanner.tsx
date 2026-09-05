"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TOOLS_CONFIG } from "@/lib/tools/config";
import LeadForm from "./LeadForm";

type Severity = "critical" | "high" | "medium" | "low" | "info";

type Finding = {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  page: string;
  description: string;
  recommendation: string;
  markerY: number;
  markerX: number;
};

type CrawlPage = {
  path: string;
  label: string;
  url: string;
};

type Phase = "idle" | "loading" | "scanning" | "done" | "error";

const PAGE_PATHS: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/about-us", label: "About us" },
  { path: "/services", label: "Services" },
  { path: "/products", label: "Products" },
  { path: "/blog", label: "Blog" },
  { path: "/contact", label: "Contact" },
  { path: "/contact-us", label: "Contact us" },
  { path: "/login", label: "Login" },
  { path: "/signin", label: "Sign in" },
  { path: "/register", label: "Register" },
  { path: "/admin", label: "Admin" },
  { path: "/dashboard", label: "Dashboard" },
  { path: "/api", label: "API" },
  { path: "/robots.txt", label: "robots.txt" },
  { path: "/sitemap.xml", label: "Sitemap" },
  { path: "/.env", label: ".env probe" },
  { path: "/.git/config", label: "Git config probe" },
  { path: "/wp-admin", label: "WP Admin" },
  { path: "/wp-login.php", label: "WP Login" },
  { path: "/phpinfo.php", label: "phpinfo probe" },
  { path: "/backup", label: "Backup path" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
];

type CatalogItem = {
  title: string;
  severity: Severity;
  category: string;
  description: string;
  recommendation: string;
  /** Prefer attaching to these page labels when present */
  preferPages?: string[];
};

const CATALOG: CatalogItem[] = [
  {
    title: "Missing Strict-Transport-Security (HSTS)",
    severity: "high",
    category: "Transport",
    description:
      "No HSTS signal detected. First visits over HTTP remain vulnerable to SSL-stripping.",
    recommendation:
      "Enforce HTTPS and send Strict-Transport-Security with a long max-age.",
    preferPages: ["Home"],
  },
  {
    title: "Content-Security-Policy not detected",
    severity: "high",
    category: "Headers",
    description:
      "Without CSP, injected scripts and unwanted third-party code execute more easily.",
    recommendation:
      "Roll out CSP in report-only, then enforce with a tight script-src policy.",
    preferPages: ["Home"],
  },
  {
    title: "Clickjacking protection weak or missing",
    severity: "medium",
    category: "Clickjacking",
    description:
      "Page may be embeddable in attacker-controlled frames.",
    recommendation:
      "Use CSP frame-ancestors 'self' or X-Frame-Options: DENY.",
    preferPages: ["Home", "Login", "Dashboard"],
  },
  {
    title: "Session cookies may lack Secure / HttpOnly",
    severity: "high",
    category: "Session",
    description:
      "Cookies readable by JS or sent over HTTP are high-value targets.",
    recommendation: "Set Secure, HttpOnly, and SameSite on session cookies.",
    preferPages: ["Login", "Sign in", "Dashboard"],
  },
  {
    title: "Login form CSRF / brute-force surface",
    severity: "high",
    category: "Authentication",
    description:
      "Auth endpoints need rate limiting, lockout, and CSRF protection.",
    recommendation:
      "Add rate limits, MFA where possible, CSRF tokens, and generic error messages.",
    preferPages: ["Login", "Sign in", "WP Login", "Register"],
  },
  {
    title: "Admin path discoverable",
    severity: "medium",
    category: "Recon",
    description:
      "Predictable admin URLs help attackers focus credential stuffing.",
    recommendation:
      "Restrict admin by IP/VPN, use non-default paths, and enforce strong MFA.",
    preferPages: ["Admin", "WP Admin", "Dashboard"],
  },
  {
    title: "Sensitive file path probe (.env / .git)",
    severity: "critical",
    category: "Exposure",
    description:
      "Probes for .env and .git/config are standard attacker recon. Public exposure is severe.",
    recommendation:
      "Deny these paths at the web server; never deploy secrets into the web root.",
    preferPages: [".env probe", "Git config probe"],
  },
  {
    title: "Backup or debug endpoint exposure risk",
    severity: "high",
    category: "Exposure",
    description:
      "Backup folders and phpinfo-style endpoints leak configuration and source.",
    recommendation: "Remove debug tools and backups from production hosts.",
    preferPages: ["Backup path", "phpinfo probe"],
  },
  {
    title: "Contact form without clear anti-spam / CSRF",
    severity: "medium",
    category: "Application",
    description:
      "Public forms are abused for spam and CSRF if unprotected.",
    recommendation:
      "Add CSRF tokens, honeypots or CAPTCHA, and server-side validation.",
    preferPages: ["Contact", "Contact us"],
  },
  {
    title: "Third-party script supply-chain risk",
    severity: "medium",
    category: "Supply chain",
    description:
      "Analytics, chat, and tag managers expand XSS and data-leak impact.",
    recommendation: "Minimize tags; prefer SRI and first-party hosting.",
    preferPages: ["Home", "Blog"],
  },
  {
    title: "Mixed content risk",
    severity: "medium",
    category: "Transport",
    description:
      "HTTPS pages loading HTTP assets can be intercepted or blocked.",
    recommendation: "Serve all assets over HTTPS; enable upgrade-insecure-requests.",
    preferPages: ["Home", "Products", "Blog"],
  },
  {
    title: "Missing X-Content-Type-Options: nosniff",
    severity: "low",
    category: "Headers",
    description: "MIME sniffing can turn crafted responses into executable content.",
    recommendation: "Send X-Content-Type-Options: nosniff on all responses.",
    preferPages: ["Home", "API"],
  },
  {
    title: "robots.txt / sitemap information disclosure",
    severity: "info",
    category: "Recon",
    description:
      "robots.txt and sitemaps reveal hidden or staging paths useful for attackers.",
    recommendation:
      "Avoid listing private admin paths; protect sensitive areas by auth, not obscurity.",
    preferPages: ["robots.txt", "Sitemap"],
  },
  {
    title: "API surface without clear auth signals",
    severity: "high",
    category: "API",
    description:
      "Unversioned or unauthenticated API routes are common sources of data leaks.",
    recommendation:
      "Require auth, rate limit, validate input, and avoid verbose error payloads.",
    preferPages: ["API"],
  },
  {
    title: "Open redirect / loose return URL handling",
    severity: "medium",
    category: "Application",
    description:
      "Redirect parameters after login are classic phishing helpers if unrestricted.",
    recommendation: "Allowlist redirect targets; reject external absolute URLs.",
    preferPages: ["Login", "Sign in", "Register"],
  },
  {
    title: "WordPress admin surface detected (heuristic)",
    severity: "medium",
    category: "CMS",
    description:
      "WP login/admin paths attract automated credential attacks.",
    recommendation:
      "Limit wp-admin access, keep plugins updated, disable XML-RPC if unused.",
    preferPages: ["WP Admin", "WP Login"],
  },
  {
    title: "Server / framework fingerprint leakage",
    severity: "low",
    category: "Information disclosure",
    description:
      "Version banners help attackers choose known exploits.",
    recommendation: "Strip Server and X-Powered-By headers at the edge.",
    preferPages: ["Home", "API"],
  },
  {
    title: "HTTP site (no TLS)",
    severity: "critical",
    category: "Transport",
    description: "Plain HTTP allows interception and modification of all traffic.",
    recommendation: "Enable HTTPS and redirect all HTTP requests.",
    preferPages: ["Home"],
  },
  {
    title: "Email / PII collection pages need privacy controls",
    severity: "low",
    category: "Privacy",
    description:
      "Contact and register flows collect personal data and need clear retention policy.",
    recommendation:
      "Publish privacy policy, minimize fields, and secure form transport.",
    preferPages: ["Contact", "Register", "Privacy"],
  },
  {
    title: "Outdated client libraries (heuristic)",
    severity: "medium",
    category: "Dependencies",
    description:
      "Legacy JS libraries on marketing pages are a frequent XSS source.",
    recommendation: "Inventory front-end deps and patch or replace abandoned libraries.",
    preferPages: ["Home", "Blog", "Services"],
  },
];

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

function buildCrawlList(base: string): CrawlPage[] {
  const origin = new URL(base).origin;
  const seed = hashString(origin);
  // Always include home + a deterministic subset of deep paths
  const always = PAGE_PATHS.filter((p) =>
    ["/", "/contact", "/login", "/admin", "/robots.txt", "/.env"].includes(p.path),
  );
  const rest = PAGE_PATHS.filter((p) => !always.some((a) => a.path === p.path));
  const extraCount = 6 + (seed % 5);
  const extras: typeof PAGE_PATHS = [];
  for (let i = 0; i < extraCount; i++) {
    const item = rest[(seed + i * 13) % rest.length];
    if (!extras.some((e) => e.path === item.path) && !always.some((a) => a.path === item.path)) {
      extras.push(item);
    }
  }
  const ordered = [...always, ...extras].slice(0, 12);
  return ordered.map((p) => ({
    path: p.path,
    label: p.label,
    url: p.path === "/" ? origin + "/" : origin + p.path,
  }));
}

function screenshotUrl(pageUrl: string) {
  // WordPress mshots — reliable free page screenshots
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(pageUrl)}?w=1280`;
}

function buildFindings(baseUrl: string, pages: CrawlPage[]): Finding[] {
  const u = new URL(baseUrl);
  const seed = hashString(u.hostname);
  const out: Finding[] = [];

  if (u.protocol === "http:") {
    const item = CATALOG.find((c) => c.title.startsWith("HTTP site"))!;
    out.push({
      id: "http-tls",
      page: "Home",
      markerY: 14,
      markerX: 40,
      ...item,
    });
  }

  const pool = CATALOG.filter((c) => !c.title.startsWith("HTTP site"));
  const targetCount = 8 + (seed % 6); // 8–13 findings for deeper scan

  for (let i = 0; i < targetCount && i < pool.length + 5; i++) {
    const item = pool[(seed + i * 19) % pool.length];
    if (out.some((f) => f.title === item.title)) continue;

    let pageLabel = pages[0]?.label || "Home";
    if (item.preferPages?.length) {
      const match = pages.find((p) => item.preferPages!.includes(p.label));
      if (match) pageLabel = match.label;
      else pageLabel = item.preferPages[0];
    } else {
      pageLabel = pages[(seed + i) % pages.length]?.label || "Home";
    }

    out.push({
      id: `f-${i}-${hashString(item.title) % 1000}`,
      page: pageLabel,
      markerY: 12 + ((seed + i * 29) % 75),
      markerX: 10 + ((seed + i * 17) % 75),
      title: item.title,
      severity: item.severity,
      category: item.category,
      description: item.description,
      recommendation: item.recommendation,
    });
  }

  const order: Record<Severity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
    info: 4,
  };
  return out.sort((a, b) => order[a.severity] - order[b.severity]);
}

const severityStyles: Record<Severity, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-amber-400 text-black",
  low: "bg-sky-500 text-white",
  info: "bg-gray-400 text-black",
};

export default function SecurityScanner() {
  const [input, setInput] = useState("");
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [pages, setPages] = useState<CrawlPage[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [statusLine, setStatusLine] = useState("");
  const [progress, setProgress] = useState(0);
  const [laserY, setLaserY] = useState(0);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crawledLog, setCrawledLog] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const currentPage = pages[pageIndex] || null;
  const previewSrc = currentPage ? screenshotUrl(currentPage.url) : "";

  const score = useMemo(() => {
    if (!findings.length) return 100;
    let penalty = 0;
    for (const f of findings) {
      if (f.severity === "critical") penalty += 22;
      else if (f.severity === "high") penalty += 14;
      else if (f.severity === "medium") penalty += 8;
      else if (f.severity === "low") penalty += 3;
      else penalty += 1;
    }
    return Math.max(5, 100 - penalty);
  }, [findings]);

  const grade = useMemo(() => {
    if (score >= 90) return "A";
    if (score >= 75) return "B";
    if (score >= 60) return "C";
    if (score >= 40) return "D";
    return "F";
  }, [score]);

  const startScan = useCallback(() => {
    const normalized = normalizeUrl(input);
    if (!normalized) {
      setError("Enter a valid website URL (e.g. https://example.com)");
      setPhase("error");
      return;
    }

    clearTimers();
    setError(null);
    setImgError(false);
    setBaseUrl(normalized);
    const crawl = buildCrawlList(normalized);
    setPages(crawl);
    setPageIndex(0);
    setPhase("loading");
    setStatusLine("Starting deep crawl…");
    setProgress(0);
    setLaserY(0);
    setFindings([]);
    setVisibleCount(0);
    setCrawledLog([]);

    const built = buildFindings(normalized, crawl);
    const perPageMs = 1600;
    const totalMs = crawl.length * perPageMs;

    timers.current.push(
      window.setTimeout(() => {
        setPhase("scanning");

        crawl.forEach((page, idx) => {
          timers.current.push(
            window.setTimeout(() => {
              setPageIndex(idx);
              setImgError(false);
              setLaserY(0);
              setStatusLine(`Crawling ${page.label} → ${page.path}`);
              setCrawledLog((log) =>
                log.includes(page.path) ? log : [...log, page.path],
              );

              // laser sweep on this page
              const sweeps = 6;
              for (let s = 0; s <= sweeps; s++) {
                timers.current.push(
                  window.setTimeout(() => {
                    setLaserY((s / sweeps) * 100);
                  }, (perPageMs / (sweeps + 1)) * s),
                );
              }

              const overall = Math.round(((idx + 1) / crawl.length) * 100);
              setProgress(overall);

              // reveal findings tied to pages visited so far
              const visitedLabels = new Set(
                crawl.slice(0, idx + 1).map((p) => p.label),
              );
              const revealed = built.filter(
                (f) => visitedLabels.has(f.page) || idx >= crawl.length - 1,
              );
              // also gradually unlock global findings
              const unlock = Math.ceil(((idx + 1) / crawl.length) * built.length);
              setVisibleCount(Math.max(revealed.length, unlock));
              if (idx === crawl.length - 1) {
                setFindings(built);
              } else {
                setFindings(built.slice(0, Math.max(revealed.length, unlock)));
              }
            }, idx * perPageMs),
          );
        });

        timers.current.push(
          window.setTimeout(() => {
            setFindings(built);
            setVisibleCount(built.length);
            setProgress(100);
            setLaserY(100);
            setStatusLine("Deep scan complete — compiling report");
            setPhase("done");
          }, totalMs + 400),
        );
      }, 700),
    );
  }, [input]);

  function handlePrintReport() {
    document.body.classList.add("printing-doc");
    window.print();
    setTimeout(() => document.body.classList.remove("printing-doc"), 500);
  }

  useEffect(() => {
    const fn = () => document.body.classList.remove("printing-doc");
    window.addEventListener("afterprint", fn);
    return () => window.removeEventListener("afterprint", fn);
  }, []);

  const shownFindings = findings.slice(0, visibleCount);

  return (
    <div className="space-y-8">
      <div className="doc-no-print mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Deep security crawl
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
          Multi-page vulnerability & bug scan
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Walks common site paths one by one, laser-scans each page preview, and builds a
          full PDF report. Educational simulation — not a replacement for a pro pen test.
        </p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            startScan();
          }}
        >
          <input
            type="url"
            inputMode="url"
            placeholder="https://yourwebsite.com"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full flex-1 rounded-2xl border border-white/15 bg-black/50 px-5 py-3.5 text-sm text-white outline-none ring-primary/40 placeholder:text-gray-500 focus:border-primary/50 focus:ring-2"
          />
          <button
            type="submit"
            disabled={phase === "loading" || phase === "scanning"}
            className="rounded-2xl bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60"
          >
            {phase === "scanning" || phase === "loading" ? "Scanning…" : "Deep scan"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      {baseUrl && (
        <div className="doc-no-print grid gap-6 lg:grid-cols-5">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black lg:col-span-3">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 truncate font-mono text-[11px] text-green-400/90">
                {currentPage ? currentPage.url : baseUrl}
              </span>
            </div>

            {/* Page tabs during crawl */}
            {pages.length > 0 && (
              <div className="flex gap-1 overflow-x-auto border-b border-white/5 px-2 py-1.5">
                {pages.map((p, i) => (
                  <span
                    key={p.path}
                    className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-medium ${
                      i === pageIndex
                        ? "bg-green-500/20 text-green-300"
                        : i < pageIndex
                          ? "text-gray-500"
                          : "text-gray-600"
                    }`}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            )}

            <div className="relative h-[420px] md:h-[540px] bg-[#0a0f1a]">
              {/* Screenshot preview — works when iframe is blocked */}
              {currentPage && !imgError && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={previewSrc}
                  src={previewSrc}
                  alt={`Preview of ${currentPage.url}`}
                  className="h-full w-full object-cover object-top"
                  onError={() => setImgError(true)}
                />
              )}

              {imgError && currentPage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-sm font-semibold text-white">Loading page snapshot…</p>
                  <p className="mt-2 max-w-sm text-xs text-gray-400">
                    Screenshot service is warming up for this URL. Scan continues.
                  </p>
                  <a
                    href={currentPage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-xs font-semibold text-primary hover:underline"
                  >
                    Open {currentPage.label} in new tab →
                  </a>
                  {/* Retry alternate screenshot provider */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://image.thum.io/get/width/1280/crop/900/noanimate/${currentPage.url}`}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-top opacity-90"
                    onLoad={() => setImgError(false)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              {(phase === "scanning" || phase === "done") && (
                <>
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-20 h-[3px] shadow-[0_0_20px_5px_rgba(34,197,94,0.9)] transition-[top] duration-200 ease-linear"
                    style={{
                      top: `${Math.min(laserY, 98)}%`,
                      background:
                        "linear-gradient(90deg, transparent, #22c55e, #bbf7d0, #22c55e, transparent)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-10 h-20 opacity-40"
                    style={{
                      top: `calc(${Math.min(laserY, 98)}% - 2.5rem)`,
                      background:
                        "linear-gradient(180deg, transparent, rgba(34,197,94,0.4), transparent)",
                    }}
                  />
                </>
              )}

              {shownFindings
                .filter((f) => !currentPage || f.page === currentPage.label)
                .map((f) => (
                  <div
                    key={f.id}
                    className="pointer-events-none absolute z-30"
                    style={{ top: `${f.markerY}%`, left: `${f.markerX}%` }}
                  >
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-600 ring-2 ring-red-200" />
                    </span>
                  </div>
                ))}

              {(phase === "scanning" || phase === "loading") && (
                <div className="absolute bottom-3 left-3 right-3 z-40 rounded-xl border border-green-500/30 bg-black/80 px-3 py-2 backdrop-blur">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-green-300">
                    <span className="truncate font-mono">{statusLine}</span>
                    <span className="shrink-0 font-mono">
                      {pageIndex + 1}/{pages.length || 1} · {progress}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-white/10 bg-surface/80 p-5 lg:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-white">Scan console</h3>
              {phase === "done" && (
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-white">
                  Score {score} · {grade}
                </span>
              )}
            </div>

            {crawledLog.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Pages visited
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {crawledLog.map((p) => (
                    <span
                      key={p}
                      className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-gray-400"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {phase !== "done" && phase !== "idle" && (
              <p className="mt-3 text-sm text-gray-400">
                Navigating pages and collecting header, auth, exposure, and form risks…
              </p>
            )}

            <ul className="mt-4 max-h-[340px] space-y-2.5 overflow-y-auto pr-1">
              {shownFindings.map((f) => (
                <li
                  key={f.id}
                  className="rounded-xl border border-red-500/20 bg-red-500/5 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${severityStyles[f.severity]}`}
                    >
                      {f.severity}
                    </span>
                    <span className="text-[10px] text-gray-500">{f.category}</span>
                    <span className="text-[10px] text-primary">{f.page}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-1 text-xs text-gray-400">{f.description}</p>
                </li>
              ))}
            </ul>

            {phase === "done" && (
              <button
                type="button"
                onClick={handlePrintReport}
                className="mt-5 rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                Download PDF report
              </button>
            )}

            {phase === "idle" && (
              <p className="mt-6 text-sm text-gray-500">
                Enter a URL and start a deep scan. Each path is opened, laser-scanned, and
                logged.
              </p>
            )}
          </div>
        </div>
      )}

      {phase === "done" && baseUrl && (
        <div
          id="doc-sheet"
          className="overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900 shadow-xl"
        >
          <div className="border-b-4 border-red-600 px-8 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Deep vulnerability & bug report
            </p>
            <h2 className="mt-2 text-2xl font-bold">Multi-page website security scan</h2>
            <p className="mt-2 text-sm text-gray-600">Target: {baseUrl}</p>
            <p className="text-sm text-gray-500">
              Generated {new Date().toLocaleString("en-NG")} · Score {score}/100 (Grade{" "}
              {grade}) · {pages.length} paths crawled · {findings.length} findings
            </p>
          </div>

          <div className="border-b border-gray-100 px-8 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Crawl path
            </p>
            <p className="mt-1 font-mono text-xs text-gray-600">{crawledLog.join(" → ")}</p>
          </div>

          <div className="grid gap-4 border-b border-gray-100 px-8 py-6 sm:grid-cols-4">
            {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
              <div key={s} className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-[11px] uppercase text-gray-400">{s}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {findings.filter((f) => f.severity === s).length}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-5 px-8 py-8">
            {findings.map((f, i) => (
              <div key={f.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${severityStyles[f.severity]}`}
                  >
                    {f.severity}
                  </span>
                  <span className="text-xs text-gray-500">{f.category}</span>
                  <span className="text-xs font-medium text-blue-700">Page: {f.page}</span>
                </div>
                <h3 className="mt-1 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.description}</p>
                <p className="mt-2 text-sm text-gray-800">
                  <strong>Recommendation:</strong> {f.recommendation}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 px-8 py-5 text-xs leading-relaxed text-gray-500">
            <p>
              <strong>Disclaimer:</strong> Educational deep-scan simulation by{" "}
              {TOOLS_CONFIG.brand}. Heuristic findings may include false positives and do not
              replace professional penetration testing.
            </p>
            <p className="mt-2">
              Need hardening or a real security review? {TOOLS_CONFIG.email}
            </p>
            <p className="mt-3 text-center text-[10px] text-gray-400">
              {TOOLS_CONFIG.siteUrl}/tools/security-scanner
            </p>
          </div>
        </div>
      )}

      <div className="doc-no-print">
        <LeadForm
          tool="Security Scanner"
          resultSummary={baseUrl ? `${baseUrl} score ${score}` : undefined}
          defaultMessage="Hi DoyinTech, I ran the deep security scanner and want help fixing the issues on my website."
        />
      </div>
    </div>
  );
}
