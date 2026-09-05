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
  evidence?: string;
};

type ScanResult = {
  ok: boolean;
  inputUrl: string;
  finalUrl: string;
  status: number;
  tech: string[];
  headers: Record<string, string | null>;
  pagesChecked: { path: string; status: number | null; ok: boolean }[];
  findings: ScanFinding[];
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

export default function SecurityScanner() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [statusLine, setStatusLine] = useState("");
  const [progress, setProgress] = useState(0);
  const [laserY, setLaserY] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const timers = useRef<number[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const findings = result?.findings || [];
  const pages = result?.pagesChecked || [];

  const score = useMemo(() => {
    if (!findings.length) return 100;
    let penalty = 0;
    for (const f of findings) {
      if (f.severity === "critical") penalty += 25;
      else if (f.severity === "high") penalty += 14;
      else if (f.severity === "medium") penalty += 8;
      else if (f.severity === "low") penalty += 3;
      else penalty += 0; // info does not hurt score much
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

    const pathList =
      data.pagesChecked.length > 0
        ? data.pagesChecked
        : [{ path: "/", status: data.status, ok: true }];

    const perPage = 1200;
    const total = pathList.length * perPage;

    pathList.forEach((p, idx) => {
      timers.current.push(
        window.setTimeout(() => {
          setPageIndex(idx);
          setStatusLine(
            `Scanning ${p.path} ${p.status ? `(HTTP ${p.status})` : ""}`.trim(),
          );
          // laser sweep
          for (let s = 0; s <= 5; s++) {
            timers.current.push(
              window.setTimeout(() => {
                setLaserY((s / 5) * 100);
              }, (perPage / 6) * s),
            );
          }
          setProgress(Math.round(((idx + 1) / pathList.length) * 100));
          const unlock = Math.ceil(
            ((idx + 1) / pathList.length) * data.findings.length,
          );
          setVisibleCount(unlock);

          // navigate preview to path when possible (same origin iframe may still block)
          try {
            const base = new URL(data.finalUrl);
            const next = new URL(p.path, base).toString();
            setPreviewUrl(next);
            setIframeLoaded(false);
          } catch {
            /* ignore */
          }
        }, idx * perPage),
      );
    });

    timers.current.push(
      window.setTimeout(() => {
        setVisibleCount(data.findings.length);
        setProgress(100);
        setLaserY(100);
        setStatusLine("Scan complete");
        setPhase("done");
        setPreviewUrl(data.finalUrl);
      }, total + 300),
    );
  }, []);

  const startScan = useCallback(async () => {
    const normalized = normalizeUrl(input);
    if (!normalized) {
      setError("Enter a valid website URL (e.g. https://example.com)");
      setPhase("error");
      return;
    }

    clearTimers();
    setError(null);
    setResult(null);
    setIframeFailed(false);
    setIframeLoaded(false);
    setPreviewUrl(normalized);
    setPhase("loading-site");
    setStatusLine("Loading website…");
    setProgress(0);
    setVisibleCount(0);

    // Give the real URL a moment to load in the iframe before scanning
    await new Promise((r) => setTimeout(r, 1800));

    setStatusLine("Running live checks on the server…");

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
      setError("Could not complete scan. Check your connection and try again.");
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

  // If iframe has not loaded after a few seconds, mark failed (X-Frame-Options)
  useEffect(() => {
    if (!previewUrl || phase === "idle") return;
    const t = window.setTimeout(() => {
      if (!iframeLoaded) setIframeFailed(true);
    }, 4000);
    return () => window.clearTimeout(t);
  }, [previewUrl, phase, iframeLoaded]);

  const shown = findings.slice(0, visibleCount);

  return (
    <div className="space-y-8">
      <div className="doc-no-print mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Live passive security scan
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
          Real URL load + header & path checks
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Loads your site first, then checks real HTTP headers, tech signals, and sensitive
          paths. Findings include evidence — no fake WordPress guesses on Next.js sites.
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
            className="w-full flex-1 rounded-2xl border border-white/15 bg-black/50 px-5 py-3.5 text-sm text-white outline-none ring-primary/40 placeholder:text-gray-500 focus:border-primary/50 focus:ring-2"
          />
          <button
            type="submit"
            disabled={phase === "loading-site" || phase === "scanning"}
            className="rounded-2xl bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60"
          >
            {phase === "loading-site"
              ? "Loading site…"
              : phase === "scanning"
                ? "Scanning…"
                : "Start scan"}
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
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
                {pages.map((p, i) => (
                  <span
                    key={p.path}
                    className={`shrink-0 rounded-md px-2 py-1 font-mono text-[10px] ${
                      i === pageIndex
                        ? "bg-green-500/20 text-green-300"
                        : i < pageIndex
                          ? "text-gray-500"
                          : "text-gray-600"
                    }`}
                  >
                    {p.path}
                    {p.status ? ` · ${p.status}` : ""}
                  </span>
                ))}
              </div>
            )}

            <div className="relative h-[420px] md:h-[540px] bg-white">
              {/* Real site iframe */}
              <iframe
                ref={iframeRef}
                key={previewUrl}
                src={previewUrl}
                title="Live website preview"
                className="h-full w-full bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                onLoad={() => {
                  setIframeLoaded(true);
                  setIframeFailed(false);
                }}
              />

              {/* Overlay only while loading or if frame blocked */}
              {(phase === "loading-site" || (iframeFailed && !iframeLoaded)) && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0b1220]/95 p-6 text-center">
                  <div className="mb-3 h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm font-semibold text-white">
                    {phase === "loading-site"
                      ? "Loading the real website…"
                      : "This site blocks embedding in other pages"}
                  </p>
                  <p className="mt-2 max-w-md text-xs text-gray-400">
                    {phase === "loading-site"
                      ? "We open your URL first, then run live server-side checks."
                      : "Browser security (X-Frame-Options / CSP) prevents showing it here. The scan still uses the real URL. Open it in a new tab to view."}
                  </p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-xs font-semibold text-primary hover:underline"
                  >
                    Open real URL in new tab →
                  </a>
                </div>
              )}

              {(phase === "scanning" || phase === "done") && (
                <>
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-20 h-[3px] shadow-[0_0_20px_5px_rgba(34,197,94,0.9)] transition-[top] duration-200"
                    style={{
                      top: `${Math.min(laserY, 98)}%`,
                      background:
                        "linear-gradient(90deg, transparent, #22c55e, #bbf7d0, #22c55e, transparent)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-10 h-16 opacity-35"
                    style={{
                      top: `calc(${Math.min(laserY, 98)}% - 2rem)`,
                      background:
                        "linear-gradient(180deg, transparent, rgba(34,197,94,0.35), transparent)",
                    }}
                  />
                </>
              )}

              {/* Red markers for non-info findings */}
              {phase !== "loading-site" &&
                shown
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
                <div className="absolute bottom-3 left-3 right-3 z-40 rounded-xl border border-green-500/30 bg-black/80 px-3 py-2 backdrop-blur">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-green-300">
                    <span className="truncate font-mono">{statusLine}</span>
                    <span className="shrink-0 font-mono">{progress}%</span>
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

            {result?.tech?.length ? (
              <p className="mt-2 text-xs text-gray-400">
                Detected stack:{" "}
                <span className="text-primary">{result.tech.join(", ")}</span>
              </p>
            ) : null}

            {pages.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Paths checked (real HTTP status)
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {pages.map((p) => (
                    <span
                      key={p.path}
                      className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-gray-400"
                    >
                      {p.path}:{p.status ?? "—"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ul className="mt-4 max-h-[340px] space-y-2.5 overflow-y-auto pr-1">
              {shown.map((f) => (
                <li
                  key={f.id}
                  className="rounded-xl border border-white/10 bg-black/30 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${severityStyles[f.severity]}`}
                    >
                      {f.severity}
                    </span>
                    <span className="text-[10px] text-gray-500">{f.category}</span>
                    <span className="font-mono text-[10px] text-primary">{f.page}</span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-1 text-xs text-gray-400">{f.description}</p>
                  {f.evidence && (
                    <p className="mt-1 font-mono text-[10px] text-gray-500">
                      Evidence: {f.evidence}
                    </p>
                  )}
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
        <div
          id="doc-sheet"
          className="overflow-hidden rounded-2xl border border-white/10 bg-white text-gray-900 shadow-xl"
        >
          <div className="border-b-4 border-red-600 px-8 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              Live security scan report
            </p>
            <h2 className="mt-2 text-2xl font-bold">Website vulnerability check</h2>
            <p className="mt-2 text-sm text-gray-600">Target: {result.finalUrl}</p>
            <p className="text-sm text-gray-500">
              {new Date(result.scannedAt).toLocaleString("en-NG")} · Score {score}/100
              (Grade {grade})
              {result.tech?.length ? ` · Stack: ${result.tech.join(", ")}` : ""}
            </p>
          </div>

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
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${severityStyles[f.severity]}`}
                  >
                    {f.severity}
                  </span>
                  <span className="text-xs text-gray-500">{f.category}</span>
                  <span className="font-mono text-xs text-blue-700">{f.page}</span>
                </div>
                <h3 className="mt-1 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{f.description}</p>
                {f.evidence && (
                  <p className="mt-1 font-mono text-xs text-gray-500">Evidence: {f.evidence}</p>
                )}
                <p className="mt-2 text-sm">
                  <strong>Recommendation:</strong> {f.recommendation}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 px-8 py-5 text-xs text-gray-500">
            <p>
              Passive scan by {TOOLS_CONFIG.brand}: real HTTP headers, HTML signals, and path
              responses only. Not a full penetration test.
            </p>
            <p className="mt-2">{TOOLS_CONFIG.email}</p>
          </div>
        </div>
      )}

      <div className="doc-no-print">
        <LeadForm
          tool="Security Scanner"
          resultSummary={result ? `${result.finalUrl} score ${score}` : undefined}
          defaultMessage="Hi DoyinTech, I ran the live security scanner and want help fixing the issues on my website."
        />
      </div>
    </div>
  );
}
