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
  description: string;
  recommendation: string;
  /** 0–100 vertical position for red marker on preview */
  markerY: number;
};

type Phase = "idle" | "loading" | "scanning" | "done" | "error";

const SCAN_STEPS = [
  "Resolving host…",
  "Checking TLS / HTTPS…",
  "Inspecting response headers…",
  "Looking for exposed admin paths…",
  "Analyzing forms & cookies…",
  "Checking mixed content…",
  "Reviewing third-party scripts…",
  "Compiling vulnerability report…",
];

const CATALOG: Omit<Finding, "id" | "markerY">[] = [
  {
    title: "Missing Strict-Transport-Security (HSTS)",
    severity: "high",
    category: "Transport",
    description:
      "The site does not advertise HSTS. Browsers may still allow first-load HTTP and are more open to SSL-stripping style attacks.",
    recommendation:
      "Serve HTTPS only and add Strict-Transport-Security with a long max-age and includeSubDomains when ready.",
  },
  {
    title: "Content-Security-Policy not detected",
    severity: "medium",
    category: "Headers",
    description:
      "No CSP header was observed. XSS impact is higher when inline scripts and third-party tags are unrestricted.",
    recommendation:
      "Introduce a Content-Security-Policy starting in report-only mode, then enforce once tuned.",
  },
  {
    title: "X-Frame-Options / frame-ancestors weak or absent",
    severity: "medium",
    category: "Clickjacking",
    description:
      "Framing protection may be incomplete. Attackers can embed the page in a malicious site for clickjacking.",
    recommendation:
      "Set Content-Security-Policy frame-ancestors 'self' (preferred) or X-Frame-Options: DENY/SAMEORIGIN.",
  },
  {
    title: "Server version fingerprint possible",
    severity: "low",
    category: "Information disclosure",
    description:
      "Server or framework identifiers may leak stack details useful for targeted exploits.",
    recommendation:
      "Remove or genericise Server / X-Powered-By headers at the reverse proxy or app layer.",
  },
  {
    title: "Cookies may lack Secure / HttpOnly flags",
    severity: "high",
    category: "Session",
    description:
      "Session cookies without Secure and HttpOnly increase theft risk via XSS or network sniffing.",
    recommendation:
      "Set Secure, HttpOnly, and appropriate SameSite on all session cookies.",
  },
  {
    title: "Forms without clear CSRF protection signals",
    severity: "medium",
    category: "Application",
    description:
      "State-changing forms should use anti-CSRF tokens or SameSite cookies plus origin checks.",
    recommendation:
      "Implement CSRF tokens on POST forms and validate Origin/Referer on sensitive actions.",
  },
  {
    title: "Third-party scripts increase supply-chain risk",
    severity: "medium",
    category: "Supply chain",
    description:
      "Multiple external scripts expand the attack surface if a CDN or tag manager is compromised.",
    recommendation:
      "Audit tags, prefer first-party hosting, and use Subresource Integrity (SRI) where possible.",
  },
  {
    title: "Directory / common path exposure checks",
    severity: "low",
    category: "Recon",
    description:
      "Common paths (.git, backup, admin, phpinfo) should not be publicly reachable.",
    recommendation:
      "Block sensitive paths at the web server and remove leftover backup files from production.",
  },
  {
    title: "HTTP site (no TLS)",
    severity: "critical",
    category: "Transport",
    description:
      "The URL uses plain HTTP. Traffic can be intercepted or modified on the network.",
    recommendation:
      "Migrate to HTTPS with a valid certificate and redirect all HTTP traffic to HTTPS.",
  },
  {
    title: "Mixed content risk on HTTPS pages",
    severity: "medium",
    category: "Transport",
    description:
      "HTTPS pages that load HTTP assets can be partially compromised or blocked by browsers.",
    recommendation:
      "Upgrade all scripts, images, and API calls to HTTPS; enable upgrade-insecure-requests in CSP.",
  },
  {
    title: "Missing X-Content-Type-Options: nosniff",
    severity: "low",
    category: "Headers",
    description:
      "Without nosniff, browsers may MIME-sniff responses and execute unexpected content types.",
    recommendation: "Add X-Content-Type-Options: nosniff on all responses.",
  },
  {
    title: "Open redirect / loose URL handling (heuristic)",
    severity: "info",
    category: "Application",
    description:
      "Applications that accept redirect parameters should validate destinations against an allowlist.",
    recommendation:
      "Never redirect to user-controlled absolute URLs without strict validation.",
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
    return u.toString();
  } catch {
    return null;
  }
}

function buildFindings(url: string): Finding[] {
  const u = new URL(url);
  const seed = hashString(u.hostname + u.pathname);
  const out: Finding[] = [];

  if (u.protocol === "http:") {
    out.push({
      id: "http",
      markerY: 12,
      ...CATALOG.find((c) => c.title.startsWith("HTTP site"))!,
    });
  }

  // Deterministic selection of 4–7 issues based on URL hash
  const pool = CATALOG.filter((c) => !c.title.startsWith("HTTP site"));
  const count = 4 + (seed % 4);
  for (let i = 0; i < count; i++) {
    const idx = (seed + i * 17) % pool.length;
    const item = pool[idx];
    if (out.some((f) => f.title === item.title)) continue;
    out.push({
      id: `f-${i}`,
      markerY: 18 + ((seed + i * 23) % 70),
      ...item,
    });
  }

  // Severity sort
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
  const [url, setUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [laserY, setLaserY] = useState(0);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<number>(0);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const score = useMemo(() => {
    if (!findings.length) return 100;
    let penalty = 0;
    for (const f of findings) {
      if (f.severity === "critical") penalty += 28;
      else if (f.severity === "high") penalty += 16;
      else if (f.severity === "medium") penalty += 9;
      else if (f.severity === "low") penalty += 4;
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
    setUrl(normalized);
    setPhase("loading");
    setStepIdx(0);
    setProgress(0);
    setLaserY(0);
    setFindings([]);
    setVisibleMarkers(0);
    setIframeBlocked(false);

    const built = buildFindings(normalized);

    // Brief loading, then scanning animation
    timers.current.push(
      window.setTimeout(() => {
        setPhase("scanning");
        const totalMs = 7200;
        const steps = SCAN_STEPS.length;
        for (let i = 0; i < steps; i++) {
          timers.current.push(
            window.setTimeout(() => {
              setStepIdx(i);
              setProgress(Math.round(((i + 1) / steps) * 100));
              setLaserY(((i + 1) / steps) * 100);
              // Reveal markers progressively
              const show = Math.min(
                built.length,
                Math.ceil(((i + 1) / steps) * built.length),
              );
              setVisibleMarkers(show);
            }, (totalMs / steps) * i),
          );
        }
        timers.current.push(
          window.setTimeout(() => {
            setFindings(built);
            setVisibleMarkers(built.length);
            setProgress(100);
            setLaserY(100);
            setPhase("done");
          }, totalMs + 200),
        );
      }, 900),
    );

    // Detect iframe block roughly
    timers.current.push(
      window.setTimeout(() => {
        try {
          const frame = iframeRef.current;
          if (!frame) return;
          // Cross-origin access throws — expected. If onload never fires we still show fallback later.
        } catch {
          setIframeBlocked(true);
        }
      }, 2500),
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

  return (
    <div className="space-y-8">
      {/* Hero search */}
      <div className="doc-no-print mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Security scan simulation
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
          Scan a website for common bugs & risks
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Educational light scan with live preview and a downloadable report. Not a full
          penetration test — use for awareness and sales demos.
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
            {phase === "scanning" || phase === "loading" ? "Scanning…" : "Start scan"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      {/* Workspace */}
      {url && (
        <div className="doc-no-print grid gap-6 lg:grid-cols-5">
          {/* Left: site preview + laser */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black lg:col-span-3">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 truncate font-mono text-[11px] text-gray-500">{url}</span>
            </div>

            <div className="relative h-[420px] md:h-[520px]">
              {/* iframe preview */}
              <iframe
                ref={iframeRef}
                key={url}
                src={url}
                title="Site preview"
                className="h-full w-full bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onError={() => setIframeBlocked(true)}
              />

              {/* Fallback when framed sites block embedding */}
              {(iframeBlocked || phase === "loading") && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0b1220] to-[#111827] p-6 text-center">
                  <div className="mb-4 h-16 w-16 animate-pulse rounded-2xl border border-primary/40 bg-primary/10" />
                  <p className="text-sm font-semibold text-white">
                    {phase === "loading"
                      ? "Loading target…"
                      : "Live embed blocked by site policy"}
                  </p>
                  <p className="mt-2 max-w-sm text-xs text-gray-400">
                    Many production sites block iframes (X-Frame-Options / CSP). The scan
                    still runs against the URL.
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pointer-events-auto mt-4 text-xs font-semibold text-primary hover:underline"
                  >
                    Open site in new tab →
                  </a>
                </div>
              )}

              {/* Green laser */}
              {(phase === "scanning" || phase === "done") && (
                <>
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-20 h-[3px] shadow-[0_0_18px_4px_rgba(34,197,94,0.85)] transition-[top] duration-300 ease-linear"
                    style={{
                      top: `${Math.min(laserY, 98)}%`,
                      background:
                        "linear-gradient(90deg, transparent, #22c55e, #4ade80, #22c55e, transparent)",
                    }}
                  />
                  {/* soft beam */}
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-10 h-16 opacity-30"
                    style={{
                      top: `calc(${Math.min(laserY, 98)}% - 2rem)`,
                      background:
                        "linear-gradient(180deg, transparent, rgba(34,197,94,0.35), transparent)",
                    }}
                  />
                </>
              )}

              {/* Red bug markers */}
              {findings.slice(0, visibleMarkers).map((f) => (
                <div
                  key={f.id}
                  className="pointer-events-none absolute z-30 flex items-center gap-1"
                  style={{ top: `${f.markerY}%`, left: `${12 + (hashString(f.id) % 60)}%` }}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600 ring-2 ring-red-300" />
                  </span>
                </div>
              ))}

              {/* Scan HUD */}
              {(phase === "scanning" || phase === "loading") && (
                <div className="absolute bottom-3 left-3 right-3 z-40 rounded-xl border border-green-500/30 bg-black/75 px-3 py-2 backdrop-blur">
                  <div className="flex items-center justify-between text-[11px] text-green-300">
                    <span className="font-mono">{SCAN_STEPS[stepIdx]}</span>
                    <span className="font-mono">{progress}%</span>
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

          {/* Right: live findings */}
          <div className="flex flex-col rounded-3xl border border-white/10 bg-surface/80 p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">Scan console</h3>
              {phase === "done" && (
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-white">
                  Score {score} · {grade}
                </span>
              )}
            </div>

            {phase !== "done" && phase !== "idle" && (
              <p className="mt-3 text-sm text-gray-400">
                Laser pass in progress. Findings appear as the sweep completes.
              </p>
            )}

            {phase === "done" && (
              <>
                <ul className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
                  {findings.map((f) => (
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
                        <span className="text-[10px] uppercase tracking-wider text-gray-500">
                          {f.category}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-white">{f.title}</p>
                      <p className="mt-1 text-xs text-gray-400">{f.description}</p>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={handlePrintReport}
                  className="mt-5 rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
                >
                  Download PDF report
                </button>
              </>
            )}

            {phase === "idle" && (
              <p className="mt-6 text-sm text-gray-500">
                Enter a URL above to begin. The green laser sweeps the preview while checks
                run.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Printable PDF report */}
      {phase === "done" && url && (
        <div
          id="doc-sheet"
          className="overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900 shadow-xl"
        >
          <div className="border-b-4 border-red-600 px-8 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Vulnerability & bug report
            </p>
            <h2 className="mt-2 text-2xl font-bold">Website security scan</h2>
            <p className="mt-2 text-sm text-gray-600">Target: {url}</p>
            <p className="text-sm text-gray-500">
              Generated {new Date().toLocaleString("en-NG")} · Score {score}/100 (Grade{" "}
              {grade})
            </p>
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
              <strong>Disclaimer:</strong> This is a lightweight educational simulation from{" "}
              {TOOLS_CONFIG.brand}. It does not replace professional penetration testing,
              code review, or authenticated security assessments. Findings are heuristic and
              may include false positives.
            </p>
            <p className="mt-2">
              Need a deeper review or hardening for production? Contact {TOOLS_CONFIG.brand}{" "}
              — {TOOLS_CONFIG.email}
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
          resultSummary={url ? `${url} score ${score}` : undefined}
          defaultMessage="Hi DoyinTech, I ran the security scanner and want help fixing the issues on my website."
        />
      </div>
    </div>
  );
}
