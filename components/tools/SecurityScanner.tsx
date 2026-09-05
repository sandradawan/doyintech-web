"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TOOLS_CONFIG } from "@/lib/tools/config";
import LeadForm from "./LeadForm";

type Severity = "critical" | "high" | "medium" | "low" | "info";

type ScanFinding = {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  page: string;
  description: string;
  recommendation: string;
  evidence: string;
  verified: boolean;
};

type PageResult = {
  url: string;
  path: string;
  status: number | null;
  ok: boolean;
  title?: string;
};

type ScanResult = {
  ok: boolean;
  inputUrl: string;
  finalUrl: string;
  status: number;
  tech: string[];
  tls: {
    valid: boolean;
    authorized: boolean;
    protocol?: string;
    daysRemaining?: number;
    validFrom?: string;
    validTo?: string;
    issuer?: string;
    subject?: string;
    error?: string;
  } | null;
  headers: Record<string, string | null>;
  pagesChecked: PageResult[];
  findings: ScanFinding[];
  scope: { checks: string[]; notChecked: string[] };
  scannedAt: string;
};

type Phase = "idle" | "loading-site" | "scanning" | "done" | "error";

const severityStyles: Record<Severity, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-amber-400 text-black",
  low: "bg-sky-500 text-white",
  info: "bg-gray-400 text-black",
};

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

function shotUrl(pageUrl: string) {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(pageUrl)}?w=1280`;
}

export default function SecurityScanner() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [useScreenshot, setUseScreenshot] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [statusLine, setStatusLine] = useState("");
  const [progress, setProgress] = useState(0);
  const [laserY, setLaserY] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const allFindings = result?.findings || [];
  const findings = useMemo(
    () =>
      verifiedOnly ? allFindings.filter((f) => f.verified) : allFindings,
    [allFindings, verifiedOnly],
  );
  const pages = result?.pagesChecked || [];

  const score = useMemo(() => {
    const list = findings.filter((f) => f.severity !== "info");
    if (!list.length) return 100;
    let penalty = 0;
    for (const f of list) {
      if (f.severity === "critical") penalty += 25;
      else if (f.severity === "high") penalty += 14;
      else if (f.severity === "medium") penalty += 8;
      else if (f.severity === "low") penalty += 3;
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

  const runAnimatedScan = useCallback((data: ScanResult) => {
    clearTimers();
    setPhase("scanning");
    setProgress(0);
    setLaserY(0);
    setPageIndex(0);
    setVisibleCount(0);

    const pathList = data.pagesChecked.length
      ? data.pagesChecked
      : [
          {
            url: data.finalUrl,
            path: "/",
            status: data.status,
            ok: true,
          },
        ];

    const perPage = 900;
    const total = Math.min(pathList.length, 18) * perPage;
    const slice = pathList.slice(0, 18);

    slice.forEach((p, idx) => {
      timers.current.push(
        window.setTimeout(() => {
          setPageIndex(idx);
          setStatusLine(
            `Checking ${p.path}${p.status != null ? ` · HTTP ${p.status}` : ""}`,
          );
          setPreviewUrl(p.url);
          setIframeLoaded(false);
          for (let s = 0; s <= 4; s++) {
            timers.current.push(
              window.setTimeout(() => setLaserY((s / 4) * 100), (perPage / 5) * s),
            );
          }
          setProgress(Math.round(((idx + 1) / slice.length) * 100));
          setVisibleCount(
            Math.ceil(((idx + 1) / slice.length) * data.findings.length),
          );
        }, idx * perPage),
      );
    });

    timers.current.push(
      window.setTimeout(() => {
        setVisibleCount(data.findings.length);
        setProgress(100);
        setLaserY(100);
        setStatusLine("Scan complete — evidence-based report ready");
        setPhase("done");
        setPreviewUrl(data.finalUrl);
      }, total + 250),
    );
  }, []);

  const startScan = useCallback(async () => {
    const normalized = normalizeUrl(input);
    if (!normalized) {
      setError("Enter a valid public URL (https://…)");
      setPhase("error");
      return;
    }

    clearTimers();
    setError(null);
    setResult(null);
    setIframeFailed(false);
    setIframeLoaded(false);
    setUseScreenshot(false);
    setPreviewUrl(normalized);
    setPhase("loading-site");
    setStatusLine("Loading the real website first…");
    setProgress(0);
    setVisibleCount(0);

    await new Promise((r) => setTimeout(r, 1600));
    setStatusLine("Running live TLS, header, and crawl checks…");

    try {
      const res = await fetch("/api/security-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Scan failed");
        setPhase("error");
        return;
      }
      setResult(data as ScanResult);
      setPreviewUrl(data.finalUrl || normalized);
      runAnimatedScan(data as ScanResult);
    } catch {
      setError("Could not complete scan. Try again.");
      setPhase("error");
    }
  }, [input, runAnimatedScan]);

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

  useEffect(() => {
    if (!previewUrl || phase === "idle") return;
    const t = window.setTimeout(() => {
      if (!iframeLoaded) {
        setIframeFailed(true);
        setUseScreenshot(true);
      }
    }, 4500);
    return () => window.clearTimeout(t);
  }, [previewUrl, phase, iframeLoaded]);

  const shown = findings.slice(0, Math.max(visibleCount, phase === "done" ? findings.length : visibleCount));

  return (
    <div className="space-y-8">
      <div className="doc-no-print mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Evidence-based passive scanner
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
          Real load · real crawl · real findings
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Loads your URL, checks TLS, security headers, same-origin links, robots/sitemap,
          and sensitive paths. Every issue includes evidence. No fake CMS guesses.
        </p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void startScan();
          }}
        >
          <input
            type="url"
            inputMode="url"
            placeholder="https://yourwebsite.com"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full flex-1 rounded-2xl border border-white/15 bg-black/50 px-5 py-3.5 text-sm text-white outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            disabled={phase === "loading-site" || phase === "scanning"}
            className="rounded-2xl bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60"
          >
            {phase === "loading-site"
              ? "Loading…"
              : phase === "scanning"
                ? "Scanning…"
                : "Start scan"}
          </button>
        </form>

        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-xs text-gray-400">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded border-white/20 bg-black accent-primary"
          />
          Verified only (hide soft heuristics)
        </label>

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>

      {/* Scope */}
      <div className="doc-no-print mx-auto grid max-w-3xl gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-left text-xs text-gray-400 sm:grid-cols-2">
        <div>
          <p className="font-semibold text-green-400">What this checks</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>TLS certificate & expiry</li>
            <li>Security headers & cookies</li>
            <li>Same-origin link crawl</li>
            <li>robots.txt / sitemap</li>
            <li>Sensitive paths (with body proof)</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-amber-400">What it does not check</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5">
            <li>Logged-in / authenticated areas</li>
            <li>Full XSS or SQLi exploitation</li>
            <li>Business logic flaws</li>
            <li>Rate-limit or botnet abuse</li>
          </ul>
        </div>
      </div>

      {previewUrl && (
        <div className="doc-no-print grid gap-6 lg:grid-cols-5">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black lg:col-span-3">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-xs text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 truncate font-mono text-[11px] text-green-400">
                {previewUrl}
              </span>
            </div>

            {pages.length > 0 && (phase === "scanning" || phase === "done") && (
              <div className="flex gap-1 overflow-x-auto border-b border-white/5 px-2 py-1.5">
                {pages.slice(0, 18).map((p, i) => (
                  <span
                    key={p.url + i}
                    className={`shrink-0 rounded-md px-2 py-1 font-mono text-[10px] ${
                      i === pageIndex
                        ? "bg-green-500/20 text-green-300"
                        : i < pageIndex
                          ? "text-gray-500"
                          : "text-gray-600"
                    }`}
                  >
                    {p.path}
                    {p.status != null ? `·${p.status}` : ""}
                  </span>
                ))}
              </div>
            )}

            <div className="relative h-[420px] md:h-[540px] bg-white">
              {!useScreenshot ? (
                <iframe
                  key={previewUrl}
                  src={previewUrl}
                  title="Live website"
                  className="h-full w-full bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  onLoad={() => {
                    setIframeLoaded(true);
                    setIframeFailed(false);
                  }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={shotUrl(previewUrl)}
                  src={shotUrl(previewUrl)}
                  alt="Site snapshot"
                  className="h-full w-full object-cover object-top"
                />
              )}

              {(phase === "loading-site" || (iframeFailed && !useScreenshot)) && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0b1220]/95 p-6 text-center">
                  <div className="mb-3 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm font-semibold text-white">
                    {phase === "loading-site"
                      ? "Loading the real website…"
                      : "Embed blocked — switching to snapshot"}
                  </p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs font-semibold text-primary hover:underline"
                  >
                    Open real URL in new tab →
                  </a>
                </div>
              )}

              {(phase === "scanning" || phase === "done") && (
                <div
                  className="pointer-events-none absolute left-0 right-0 z-20 h-[3px] shadow-[0_0_20px_5px_rgba(34,197,94,0.9)] transition-[top] duration-200"
                  style={{
                    top: `${Math.min(laserY, 98)}%`,
                    background:
                      "linear-gradient(90deg, transparent, #22c55e, #bbf7d0, #22c55e, transparent)",
                  }}
                />
              )}

              {shown
                .filter((f) => f.severity !== "info")
                .map((f, i) => (
                  <div
                    key={f.id}
                    className="pointer-events-none absolute z-30"
                    style={{
                      top: `${15 + ((i * 17) % 70)}%`,
                      left: `${12 + ((i * 23) % 70)}%`,
                    }}
                  >
                    <span className="relative flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-600 ring-2 ring-red-200" />
                    </span>
                  </div>
                ))}

              {(phase === "scanning" || phase === "loading-site") && (
                <div className="absolute bottom-3 left-3 right-3 z-40 rounded-xl border border-green-500/30 bg-black/80 px-3 py-2">
                  <div className="flex justify-between gap-2 text-[11px] text-green-300">
                    <span className="truncate font-mono">{statusLine}</span>
                    <span className="font-mono">{progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-white/10 bg-surface/80 p-5 lg:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-white">Console</h3>
              {phase === "done" && (
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-white">
                  {score} · {grade}
                </span>
              )}
            </div>

            {result?.tech?.length ? (
              <p className="mt-2 text-xs text-gray-400">
                Stack: <span className="text-primary">{result.tech.join(", ")}</span>
              </p>
            ) : null}

            {result?.tls && (
              <p className="mt-1 text-xs text-gray-400">
                TLS:{" "}
                {result.tls.error
                  ? result.tls.error
                  : `${result.tls.protocol || "TLS"} · ${result.tls.daysRemaining ?? "?"}d left`}
              </p>
            )}

            <ul className="mt-4 max-h-[360px] space-y-2.5 overflow-y-auto pr-1">
              {shown.map((f) => (
                <li key={f.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${severityStyles[f.severity]}`}
                    >
                      {f.severity}
                    </span>
                    {f.verified ? (
                      <span className="text-[10px] font-semibold text-green-400">Verified</span>
                    ) : (
                      <span className="text-[10px] text-amber-400">Heuristic</span>
                    )}
                    <span className="font-mono text-[10px] text-primary">{f.page}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-1 text-xs text-gray-400">{f.description}</p>
                  <p className="mt-1 font-mono text-[10px] text-gray-500">
                    Evidence: {f.evidence}
                  </p>
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
          </div>
        </div>
      )}

      {phase === "done" && result && (
        <div id="doc-sheet" className="overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900 shadow-xl">
          <div className="border-b-4 border-red-600 px-8 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Evidence-based security report
            </p>
            <h2 className="mt-2 text-2xl font-bold">Passive website scan</h2>
            <p className="mt-2 text-sm text-gray-600">{result.finalUrl}</p>
            <p className="text-sm text-gray-500">
              {new Date(result.scannedAt).toLocaleString("en-NG")} · Score {score}/100 ({grade})
              {result.tech?.length ? ` · ${result.tech.join(", ")}` : ""}
              {verifiedOnly ? " · Verified findings only" : " · Including heuristics"}
            </p>
          </div>

          {result.tls && (
            <div className="border-b border-gray-100 px-8 py-4 text-sm text-gray-700">
              <strong>TLS:</strong>{" "}
              {result.tls.error ||
                `${result.tls.protocol || "OK"} · expires in ${result.tls.daysRemaining} days · ${result.tls.issuer || ""}`}
            </div>
          )}

          <div className="grid gap-4 border-b border-gray-100 px-8 py-6 sm:grid-cols-4">
            {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
              <div key={s} className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-[11px] uppercase text-gray-400">{s}</p>
                <p className="text-2xl font-bold">
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
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${severityStyles[f.severity]}`}>
                    {f.severity}
                  </span>
                  <span className="text-xs text-gray-500">{f.verified ? "Verified" : "Heuristic"}</span>
                  <span className="font-mono text-xs text-blue-700">{f.page}</span>
                </div>
                <h3 className="mt-1 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.description}</p>
                <p className="mt-1 font-mono text-xs text-gray-500">Evidence: {f.evidence}</p>
                <p className="mt-2 text-sm">
                  <strong>Recommendation:</strong> {f.recommendation}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 px-8 py-5 text-xs text-gray-500">
            <p>
              <strong>Scope:</strong> {(result.scope?.checks || []).join("; ")}.{" "}
              <strong>Not checked:</strong> {(result.scope?.notChecked || []).join("; ")}.
            </p>
            <p className="mt-2">
              Passive evidence-based scan by {TOOLS_CONFIG.brand}. Not a penetration test.
            </p>
          </div>
        </div>
      )}

      <div className="doc-no-print">
        <LeadForm
          tool="Security Scanner"
          resultSummary={result ? `${result.finalUrl} score ${score}` : undefined}
          defaultMessage="Hi DoyinTech, I ran the evidence-based security scanner and want help hardening my site."
        />
      </div>
    </div>
  );
}
