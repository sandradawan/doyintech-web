"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  SCALES,
  detectColumns,
  norm,
  parseCsv,
  toDataset,
  type ColumnConfig,
  type ColumnRole,
  type Dataset,
  type ScaleKind,
} from "@/lib/students/analysis/dataset";
import { analyze, type Block, type Hypothesis, type Report, type Target } from "@/lib/students/analysis/analyze";
import { SAMPLE_TITLE, sampleCsv } from "@/lib/students/analysis/sample";
import { DATA_ANALYSIS_PRODUCT } from "@/lib/students/analysis/product";

type Step = 1 | 2 | 3 | 4;

// ------------------------------------------------------------------ payment unlock

const UNLOCKS_KEY = "doyintech_da_unlocks";
const SESSION_KEY = "doyintech_da_session";
const PRICE = DATA_ANALYSIS_PRODUCT.priceNgn;

type SavedSession = {
  ds: Dataset;
  fileName: string;
  title: string;
  distributed: string;
  alpha: number;
  showPercent: boolean;
  columns: ColumnConfig[];
  groups: string[];
  hypotheses: Hypothesis[];
};

/** Fingerprint of the raw responses: settings can change after paying, the data cannot. */
async function datasetHash(ds: Dataset): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify([ds.headers, ds.rows]));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function readUnlocks(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(UNLOCKS_KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function addUnlock(hash: string) {
  try {
    const list = readUnlocks().filter((h) => h !== hash);
    localStorage.setItem(UNLOCKS_KEY, JSON.stringify([hash, ...list].slice(0, 50)));
  } catch {
    /* private mode: the unlock lasts for this visit only */
  }
}

/** Where the free preview stops: just before the research question tables. */
function previewCut(blocks: Block[]): number {
  const i = blocks.findIndex((b) => b.type === "h2" && /Analysis of Research Questions/i.test(b.text));
  if (i > 0) return i;
  const t = blocks.findIndex((b) => b.type === "h2" && /Test of Hypotheses/i.test(b.text));
  return t > 0 ? t : Math.ceil(blocks.length / 3);
}

const ROLE_LABELS: Record<ColumnRole, string> = {
  likert: "Rating item (Strongly agree…)",
  demographic: "Background (gender, age…)",
  numeric: "Number (hours, score…)",
  ignore: "Leave out",
};

const uid = () => Math.random().toString(36).slice(2, 9);

function uniqueCount(ds: Dataset, index: number): number {
  return new Set(ds.rows.map((r) => norm(r[index] || "")).filter(Boolean)).size;
}

function sampleValues(ds: Dataset, index: number): string {
  const seen: string[] = [];
  for (const r of ds.rows) {
    const v = (r[index] || "").trim();
    if (v && !seen.some((s) => norm(s) === norm(v))) seen.push(v);
    if (seen.length >= 4) break;
  }
  return seen.join(", ");
}

function groupsInUse(columns: ColumnConfig[], groups: string[]): number[] {
  return groups.map((_, i) => i).filter((i) => columns.some((c) => c.role === "likert" && c.group === i));
}

function suggestHypotheses(ds: Dataset, columns: ColumnConfig[], groups: string[]): Hypothesis[] {
  const used = groupsInUse(columns, groups);
  const out: Hypothesis[] = [];
  if (used.length >= 2) out.push({ id: uid(), type: "corr", a: { kind: "group", group: used[0] }, b: { kind: "group", group: used[used.length - 1] } });
  const last = used[used.length - 1];
  if (last !== undefined) {
    const demo = columns.filter((c) => c.role === "demographic" && uniqueCount(ds, c.index) >= 2 && uniqueCount(ds, c.index) <= 8);
    for (const d of demo.slice(0, 2)) out.push({ id: uid(), type: "compare", target: { kind: "group", group: last }, by: d.index });
  }
  return out;
}

/** Drop empty research questions and renumber everything that points at them. */
function prepare(columns: ColumnConfig[], groups: string[], hypotheses: Hypothesis[]) {
  const used = groupsInUse(columns, groups);
  const map = new Map(used.map((g, i) => [g, i]));
  const cols = columns.map((c) => (c.role === "likert" && c.group !== undefined ? { ...c, group: map.get(c.group) } : c));
  const fix = (t: Target): Target | null => (t.kind === "group" ? (map.has(t.group) ? { kind: "group", group: map.get(t.group)! } : null) : t);
  const hyps: Hypothesis[] = [];
  for (const h of hypotheses) {
    if (h.type === "chi") {
      if (h.a !== h.b) hyps.push(h);
    } else if (h.type === "corr") {
      const a = fix(h.a);
      const b = fix(h.b);
      if (a && b && JSON.stringify(a) !== JSON.stringify(b)) hyps.push({ ...h, a, b });
    } else {
      const target = fix(h.target);
      if (target) hyps.push({ ...h, target });
    }
  }
  return { columns: cols, groups: used.map((g) => groups[g]), hypotheses: hyps };
}

const tKey = (t: Target) => (t.kind === "group" ? `g:${t.group}` : `c:${t.index}`);
const fromKey = (k: string): Target => (k.startsWith("g:") ? { kind: "group", group: Number(k.slice(2)) } : { kind: "column", index: Number(k.slice(2)) });

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

// ------------------------------------------------------------------ UI pieces

const inputCls = "w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink focus:border-brand-link focus:outline-none";
const labelCls = "block text-[13px] font-semibold text-brand-ink";

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl border border-brand-ink/10 bg-brand-ink/[0.03] p-5 sm:p-6 ${className}`}>{children}</div>;
}

function PrimaryButton({ children, onClick, disabled }: { children: ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="min-h-[44px] rounded-full bg-brand-accent px-6 py-3 text-[14px] font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, submit }: { children: ReactNode; onClick?: () => void; submit?: boolean }) {
  return (
    <button type={submit ? "submit" : "button"} onClick={onClick} className="min-h-[44px] rounded-full border border-brand-ink/20 px-5 py-2.5 text-[14px] font-semibold text-brand-ink hover:border-brand-link">
      {children}
    </button>
  );
}

function Stepper({ step, maxStep, go }: { step: Step; maxStep: Step; go: (s: Step) => void }) {
  const names = ["Upload", "Questions", "Hypotheses", "Results"];
  return (
    <ol className="mt-8 grid grid-cols-4 gap-2">
      {names.map((n, i) => {
        const s = (i + 1) as Step;
        const active = s === step;
        const open = s <= maxStep;
        return (
          <li key={n}>
            <button
              type="button"
              disabled={!open}
              onClick={() => go(s)}
              aria-current={active ? "step" : undefined}
              className={`w-full rounded-2xl border px-2 py-2.5 text-center transition ${
                active ? "border-brand-accent bg-brand-accent/10" : open ? "border-brand-ink/15 hover:border-brand-link/50" : "border-brand-ink/5 opacity-50"
              }`}
            >
              <span className="block text-[11px] text-brand-muted">Step {s}</span>
              <span className="block text-[13px] font-semibold text-brand-ink">{n}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ReportPreview({ report, locked }: { report: Report; locked: boolean }) {
  const cut = locked ? previewCut(report.blocks) : report.blocks.length;
  const hidden = report.blocks.length - cut;
  return (
    <div className="rounded-2xl bg-white p-5 font-serif text-[15px] leading-relaxed text-black shadow-lg sm:p-10">
      {report.blocks.slice(0, cut).map((b, i) => (
        <PreviewBlock key={i} b={b} />
      ))}
      {locked && hidden > 0 && (
        // Only section names are shown here: the results themselves never reach the page until it is unlocked.
        <div className="mt-4 rounded-xl border-2 border-dashed border-black/20 bg-[#f6f6f6] p-5 font-sans">
          <p className="text-[15px] font-bold">Also in your full Chapter Four</p>
          <ul className="mt-2 space-y-1 text-[14px]">
            {report.blocks
              .slice(cut)
              .filter((b): b is Extract<Block, { type: "h2" | "h3" }> => b.type === "h2" || b.type === "h3")
              .map((b, i) => (
                <li key={i} className={b.type === "h3" ? "pl-4 text-black/70" : "font-semibold"}>
                  {b.text}
                </li>
              ))}
          </ul>
          <p className="mt-3 text-[13px] text-black/70">
            {report.blocks.slice(cut).filter((b) => b.type === "table").length} more tables with interpretation. Unlock above for {PRICE}.
          </p>
        </div>
      )}
    </div>
  );
}

function PreviewBlock({ b }: { b: Block }) {
  switch (b.type) {
    case "h1":
      return <h2 className="mb-2 text-center font-serif text-[18px] font-bold">{b.text}</h2>;
    case "h2":
      return <h3 className="mb-2 mt-6 font-serif text-[16px] font-bold">{b.text}</h3>;
    case "h3":
      return <h4 className="mb-2 mt-5 font-serif text-[15px] font-bold">{b.text}</h4>;
    case "p":
      return <p className="mb-3 text-justify">{b.text}</p>;
    case "bullets":
      return (
        <ol className="mb-3 list-decimal space-y-1 pl-6 text-justify">
          {b.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      );
    case "chart": {
      const max = Math.max(...b.values, 1);
      const total = b.values.reduce((a, v) => a + v, 0) || 1;
      return (
        <figure className="mx-auto mb-4 max-w-[520px]" aria-label={`Bar chart of ${b.title}`}>
          {b.labels.map((l, i) => (
            <div key={l} className="mb-1 flex items-center gap-2 text-[12px]">
              <span className="w-28 shrink-0 truncate text-right">{l}</span>
              <span className="h-4 bg-[#1F4E79]" style={{ width: `${Math.max(1, (b.values[i] / max) * 60)}%` }} />
              <span className="shrink-0">
                {b.values[i]} ({((b.values[i] / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
          <figcaption className="mt-1 text-center text-[12px] italic">Figure: Respondents by {b.title.toLowerCase()}</figcaption>
        </figure>
      );
    }
    case "table": {
      const t = b.table;
      return (
        <div className="mb-4">
          <p className="mb-1 font-bold">{t.caption}</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  {t.head.map((h, j) => (
                    <th key={j} className="border border-black bg-[#e7e6e6] px-1.5 py-1 text-center font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.rows.map((r, i) => (
                  <tr key={i} className={t.boldLast && i === t.rows.length - 1 ? "font-bold" : ""}>
                    {t.head.map((_, j) => (
                      <td key={j} className={`whitespace-pre-line border border-black px-1.5 py-1 ${j === 0 || t.head[j] === "Item" ? "text-left" : "text-center"}`}>
                        {r[j] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {t.note && <p className="mt-1 text-[12px] italic">{t.note}</p>}
        </div>
      );
    }
  }
}

// ------------------------------------------------------------------ main tool

export default function DataAnalysisTool() {
  const [step, setStep] = useState<Step>(1);
  const [maxStep, setMaxStep] = useState<Step>(1);
  const [ds, setDs] = useState<Dataset | null>(null);
  const [fileName, setFileName] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [title, setTitle] = useState("");
  const [distributed, setDistributed] = useState("");
  const [alpha, setAlpha] = useState(0.05);
  const [showPercent, setShowPercent] = useState(true);

  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);

  const [busy, setBusy] = useState<"" | "word" | "pdf">("");
  const [downloadError, setDownloadError] = useState("");

  // Payment
  const [hash, setHash] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [payEmail, setPayEmail] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [payNote, setPayNote] = useState("");
  const [refInput, setRefInput] = useState("");
  const [checkingRef, setCheckingRef] = useState(false);

  /** Ask the server whether `reference` paid for the data set with fingerprint `want`. */
  async function confirmPayment(reference: string, want: string): Promise<{ ok: boolean; error?: string; paidHash?: string }> {
    try {
      const res = await fetch(`/api/students/data-analysis/unlock?reference=${encodeURIComponent(reference)}`);
      const data = await res.json();
      if (!data.ok) return { ok: false, error: data.error || "We couldn't confirm that payment." };
      addUnlock(data.datasetHash);
      if (want && data.datasetHash !== want) return { ok: false, paidHash: data.datasetHash, error: "That payment was for a different data file. Upload the file you paid for, or pay for this one." };
      return { ok: true, paidHash: data.datasetHash };
    } catch {
      return { ok: false, error: "Network problem while confirming your payment. Check your connection and try again." };
    }
  }

  // Back from Paystack: restore the saved work and confirm the payment.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const reference = q.get("reference") || q.get("trxref");
    if (!reference) return;
    window.history.replaceState(null, "", window.location.pathname);
    let saved: SavedSession | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    } catch {
      saved = null;
    }
    void (async () => {
      const savedHash = saved?.ds ? await datasetHash(saved.ds) : "";
      if (saved?.ds) {
        setDs(saved.ds);
        setFileName(saved.fileName);
        setTitle(saved.title);
        setDistributed(saved.distributed);
        setAlpha(saved.alpha);
        setShowPercent(saved.showPercent);
        setColumns(saved.columns);
        setGroups(saved.groups);
        setHypotheses(saved.hypotheses);
        setHash(savedHash);
        setStep(4);
        setMaxStep(4);
      }
      setPayNote("Confirming your payment…");
      const r = await confirmPayment(reference, savedHash);
      if (r.ok && saved?.ds) {
        setUnlocked(true);
        setPayNote("Payment confirmed. Your Chapter Four is unlocked: download it below.");
        try {
          localStorage.removeItem(SESSION_KEY);
        } catch {
          /* ignore */
        }
      } else if (r.ok || r.paidHash) {
        setPayNote("Payment confirmed. Upload the same data file again to download your Chapter Four.");
      } else {
        setPayNote("");
        setPayError(`${r.error} Your payment reference is ${reference}.`);
      }
    })();
    // Runs once, on arrival from the payment page.
  }, []);

  const go = (s: Step) => {
    setStep(s);
    setMaxStep((m) => (s > m ? s : m));
    requestAnimationFrame(() => document.getElementById("da-tool")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  function load(dataset: Dataset, name: string) {
    if (dataset.rows.length < 2 || dataset.headers.length < 2) {
      setLoadError("We couldn't find responses in that file. The first row should hold the questions and each row below one respondent's answers.");
      return;
    }
    const det = detectColumns(dataset);
    setDs(dataset);
    setFileName(name);
    setColumns(det.columns);
    setGroups(det.groups);
    setHypotheses(suggestHypotheses(dataset, det.columns, det.groups));
    setLoadError("");
    setMaxStep(2);
    setHash("");
    setUnlocked(false);
    void datasetHash(dataset).then((h) => {
      setHash(h);
      setUnlocked(readUnlocks().includes(h));
    });
  }

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (!ds || !hash) return;
    setPaying(true);
    setPayError("");
    const session: SavedSession = { ds, fileName, title, distributed, alpha, showPercent, columns, groups, hypotheses };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      /* too large or blocked: after paying, the student uploads the same file again */
    }
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: DATA_ANALYSIS_PRODUCT.id, email: payEmail, name: "Student", datasetHash: hash }),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS") {
        window.location.href = `https://wa.me/2348085343926?text=${encodeURIComponent(`Hi, I want to pay ${PRICE} to download my Chapter Four data analysis.`)}`;
        return;
      }
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "We couldn't start the payment. Please try again.");
      window.location.href = data.authorization_url;
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "We couldn't start the payment. Please try again.");
      setPaying(false);
    }
  }

  async function useReference(e: FormEvent) {
    e.preventDefault();
    const ref = refInput.trim();
    if (!ref || !hash) return;
    setCheckingRef(true);
    setPayError("");
    const r = await confirmPayment(ref, hash);
    setCheckingRef(false);
    if (r.ok) {
      setUnlocked(true);
      setPayNote("Payment confirmed. Your Chapter Four is unlocked.");
    } else setPayError(r.error || "We couldn't confirm that payment.");
  }

  async function readFile(file: File) {
    setLoadError("");
    if (file.size > 10 * 1024 * 1024) {
      setLoadError("That file is larger than 10 MB. Export only the responses sheet and try again.");
      return;
    }
    setLoading(true);
    try {
      const lower = file.name.toLowerCase();
      if (lower.endsWith(".xlsx")) {
        const { readSheet } = await import("read-excel-file/browser");
        const grid = (await readSheet(file)) as unknown[][];
        load(toDataset(grid), file.name);
      } else if (lower.endsWith(".csv") || lower.endsWith(".txt") || file.type.includes("csv")) {
        load(toDataset(parseCsv(await file.text())), file.name);
      } else if (lower.endsWith(".xls")) {
        setLoadError("Old .xls files aren't supported. In Excel, use File › Save As › Excel Workbook (.xlsx) or CSV.");
      } else {
        setLoadError("Please upload a .csv or .xlsx file.");
      }
    } catch {
      setLoadError("We couldn't read that file. Make sure it is a .csv or .xlsx export of your responses.");
    } finally {
      setLoading(false);
    }
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) void readFile(f);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void readFile(f);
  }

  function useSample() {
    load(toDataset(parseCsv(sampleCsv())), "sample-survey.csv");
    setTitle(SAMPLE_TITLE);
    setDistributed("150");
  }

  function updateColumn(index: number, patch: Partial<ColumnConfig>) {
    setColumns((cols) =>
      cols.map((c) => {
        if (c.index !== index) return c;
        const next = { ...c, ...patch };
        if (next.role === "likert") {
          if (!next.scale) next.scale = "agree5";
          if (next.group === undefined) next.group = Math.max(0, groups.length - 1);
        }
        return next;
      }),
    );
    if (patch.role === "likert" && groups.length === 0) setGroups(["Research Question 1"]);
  }

  // Analysis
  const prepared = useMemo(() => prepare(columns, groups, hypotheses), [columns, groups, hypotheses]);
  const report = useMemo<Report | null>(() => {
    if (!ds || step !== 4) return null;
    const d = Number(distributed);
    return analyze(ds, {
      title: title.trim() || "the study",
      distributed: d > 0 ? d : undefined,
      alpha,
      columns: prepared.columns,
      groups: prepared.groups,
      hypotheses: prepared.hypotheses,
      showPercent,
    });
  }, [ds, step, distributed, title, alpha, prepared, showPercent]);

  const fileBase = `Chapter-Four-${(title.trim() || "data-analysis").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "data-analysis"}`;

  async function downloadWord() {
    if (!report || !unlocked) return;
    setBusy("word");
    setDownloadError("");
    try {
      const [{ reportToDocx }, { barChartPng }] = await Promise.all([import("@/lib/students/analysis/report-docx"), import("@/lib/students/analysis/chart-image")]);
      const charts = await Promise.all(report.blocks.filter((b) => b.type === "chart").map((b) => (b.type === "chart" ? barChartPng(b.labels, b.values) : null)));
      saveBlob(await reportToDocx(report, charts), `${fileBase}.docx`);
    } catch {
      setDownloadError("The Word file couldn't be created. Please try again, or download the PDF.");
    } finally {
      setBusy("");
    }
  }

  async function downloadPdf() {
    if (!report || !unlocked) return;
    setBusy("pdf");
    setDownloadError("");
    try {
      const { reportToPdf } = await import("@/lib/students/analysis/report-pdf");
      saveBlob(reportToPdf(report), `${fileBase}.pdf`);
    } catch {
      setDownloadError("The PDF couldn't be created. Please try again, or download the Word file.");
    } finally {
      setBusy("");
    }
  }

  // Option lists for hypotheses
  const usedGroups = groupsInUse(columns, groups);
  const scoreTargets: { key: string; label: string }[] = [
    ...usedGroups.map((g) => ({ key: `g:${g}`, label: `${groups[g]} (overall score)` })),
    ...columns.filter((c) => c.role === "numeric").map((c) => ({ key: `c:${c.index}`, label: c.label })),
  ];
  const categoryCols = columns.filter((c) => c.role === "demographic" && ds && uniqueCount(ds, c.index) >= 2);
  const chiCols = columns.filter((c) => c.role === "demographic" || c.role === "likert");

  function defaultHypothesis(type: Hypothesis["type"]): Hypothesis | null {
    const id = uid();
    if (type === "corr") {
      if (scoreTargets.length < 2) return null;
      return { id, type, a: fromKey(scoreTargets[0].key), b: fromKey(scoreTargets[scoreTargets.length - 1].key) };
    }
    if (type === "compare") {
      if (!scoreTargets.length || !categoryCols.length) return null;
      return { id, type, target: fromKey(scoreTargets[scoreTargets.length - 1].key), by: categoryCols[0].index };
    }
    if (chiCols.length < 2) return null;
    return { id, type, a: chiCols[0].index, b: chiCols[1].index };
  }

  function setHyp(id: string, h: Hypothesis) {
    setHypotheses((hs) => hs.map((x) => (x.id === id ? h : x)));
  }

  const likertCount = columns.filter((c) => c.role === "likert").length;

  return (
    <div id="da-tool" className="scroll-mt-24">
      <Stepper step={step} maxStep={maxStep} go={go} />

      {/* ------------------------------------------------ step 1 */}
      {step === 1 && (
        <div className="mt-6 space-y-5">
          <Card>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center rounded-2xl border border-dashed px-4 py-10 text-center transition ${
                dragOver ? "border-brand-accent bg-brand-accent/5" : "border-brand-ink/25 hover:border-brand-link"
              }`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 text-brand-link" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mt-3 text-[15px] font-semibold text-brand-ink">{loading ? "Reading your file…" : fileName ? `Loaded: ${fileName}` : "Upload your responses"}</span>
              <span className="mt-1 text-[13px] text-brand-muted">Excel (.xlsx) or CSV, for example a Google Forms export</span>
              <input type="file" accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="sr-only" onChange={onFile} />
            </label>
            {ds && (
              <p className="mt-3 text-[13px] text-brand-link">
                {ds.rows.length} responses and {ds.headers.length} questions found.
              </p>
            )}
            {loadError && (
              <p role="alert" className="mt-3 text-[13px] text-red-400">
                {loadError}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <GhostButton onClick={useSample}>Try with sample data</GhostButton>
              <span className="text-[12px] text-brand-muted">Your file stays on your device. Nothing is uploaded to our servers.</span>
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <label htmlFor="da-title" className={labelCls}>
                Project title
              </label>
              <input id="da-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Influence of social media on students' academic performance" className={`mt-1.5 ${inputCls}`} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="da-dist" className={labelCls}>
                  Questionnaires distributed <span className="font-normal text-brand-muted">(optional)</span>
                </label>
                <input id="da-dist" inputMode="numeric" value={distributed} onChange={(e) => setDistributed(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 150" className={`mt-1.5 ${inputCls}`} />
                <p className="mt-1 text-[12px] text-brand-muted">Adds a response rate table.</p>
              </div>
              <div>
                <label htmlFor="da-alpha" className={labelCls}>
                  Level of significance
                </label>
                <select id="da-alpha" value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} className={`mt-1.5 ${inputCls}`}>
                  <option value={0.05}>0.05 (most common)</option>
                  <option value={0.01}>0.01</option>
                </select>
              </div>
            </div>
            <label className="flex min-h-[44px] items-center gap-3 text-[14px] text-brand-ink">
              <input type="checkbox" checked={showPercent} onChange={(e) => setShowPercent(e.target.checked)} className="h-5 w-5 accent-[#ff8c14]" />
              Show percentages beside each response count
            </label>
          </Card>

          <div className="flex justify-end">
            <PrimaryButton disabled={!ds} onClick={() => go(2)}>
              Next: check questions
            </PrimaryButton>
          </div>

          <details className="rounded-2xl border border-brand-ink/10 p-5 text-[14px] text-brand-muted">
            <summary className="cursor-pointer font-semibold text-brand-ink">How do I get my responses as a file?</summary>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-brand-ink">Google Forms:</strong> open the form, go to Responses, click &ldquo;View in Sheets&rdquo;, then File › Download › Microsoft Excel (.xlsx) or CSV.
              </li>
              <li>
                <strong className="text-brand-ink">Paper questionnaires:</strong> type the answers into Excel, one row per respondent and one column per question, with the questions in the first row. Type answers as words (Strongly Agree, Agree…) or numbers (5 to 1).
              </li>
              <li>
                <strong className="text-brand-ink">Microsoft Forms:</strong> open the form, go to Responses, click &ldquo;Open results in Excel&rdquo; and save it.
              </li>
            </ul>
          </details>
        </div>
      )}

      {/* ------------------------------------------------ step 2 */}
      {step === 2 && ds && (
        <div className="mt-6 space-y-5">
          <Card>
            <h2 className="text-[18px] font-semibold text-brand-ink">Research questions</h2>
            <p className="mt-1 text-[14px] text-brand-muted">
              We grouped your rating questions into {usedGroups.length} research question{usedGroups.length === 1 ? "" : "s"}. Rename each one to match your Chapter One.
            </p>
            <div className="mt-4 space-y-3">
              {groups.map((g, i) => {
                const n = columns.filter((c) => c.role === "likert" && c.group === i).length;
                return (
                  <div key={i}>
                    <label htmlFor={`da-g-${i}`} className="text-[12px] font-semibold uppercase tracking-wide text-brand-muted">
                      Research question {i + 1} · {n} item{n === 1 ? "" : "s"}
                    </label>
                    <input id={`da-g-${i}`} value={g} onChange={(e) => setGroups((gs) => gs.map((x, j) => (j === i ? e.target.value : x)))} className={`mt-1 ${inputCls}`} />
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <GhostButton onClick={() => setGroups((gs) => [...gs, `Research Question ${gs.length + 1}`])}>Add research question</GhostButton>
            </div>
          </Card>

          <Card>
            <h2 className="text-[18px] font-semibold text-brand-ink">Your questions</h2>
            <p className="mt-1 text-[14px] text-brand-muted">Check what each question is. Most are detected correctly; change any that are wrong.</p>
            <ul className="mt-4 space-y-3">
              {columns.map((c) => (
                <li key={c.index} className="rounded-2xl border border-brand-ink/10 bg-brand-well p-4">
                  <p className="line-clamp-3 text-[14px] font-semibold text-brand-ink">{c.header}</p>
                  <p className="mt-1 truncate text-[12px] text-brand-muted">e.g. {sampleValues(ds, c.index) || "(empty)"}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <select aria-label={`Type of question: ${c.label}`} value={c.role} onChange={(e) => updateColumn(c.index, { role: e.target.value as ColumnRole })} className={inputCls}>
                      {(Object.keys(ROLE_LABELS) as ColumnRole[]).map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                    {c.role === "likert" && (
                      <>
                        <select aria-label={`Answer scale: ${c.label}`} value={c.scale} onChange={(e) => updateColumn(c.index, { scale: e.target.value as ScaleKind })} className={inputCls}>
                          {(Object.keys(SCALES) as ScaleKind[])
                            .filter((k) => k !== "yesno")
                            .map((k) => (
                              <option key={k} value={k}>
                                {SCALES[k].name}: {SCALES[k].short.join("/")}
                              </option>
                            ))}
                        </select>
                        <select aria-label={`Research question for: ${c.label}`} value={c.group ?? 0} onChange={(e) => updateColumn(c.index, { group: Number(e.target.value) })} className={inputCls}>
                          {groups.map((g, i) => (
                            <option key={i} value={i}>
                              RQ{i + 1}: {g.length > 40 ? g.slice(0, 40) + "…" : g}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex flex-wrap justify-between gap-3">
            <GhostButton onClick={() => go(1)}>Back</GhostButton>
            <PrimaryButton disabled={likertCount === 0 && !columns.some((c) => c.role === "demographic")} onClick={() => go(3)}>
              Next: hypotheses
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ step 3 */}
      {step === 3 && ds && (
        <div className="mt-6 space-y-5">
          <Card>
            <h2 className="text-[18px] font-semibold text-brand-ink">Hypotheses</h2>
            <p className="mt-1 text-[14px] text-brand-muted">
              We suggested some from your questions. Match them to the hypotheses in your Chapter One, remove any you don&rsquo;t need, or add your own. Leave the wording blank to use the standard null hypothesis.
            </p>
            <ul className="mt-4 space-y-4">
              {hypotheses.map((h, i) => (
                <li key={h.id} className="rounded-2xl border border-brand-ink/10 bg-brand-well p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold text-brand-ink">Hypothesis {i + 1}</p>
                    <button type="button" onClick={() => setHypotheses((hs) => hs.filter((x) => x.id !== h.id))} className="min-h-[44px] px-2 text-[13px] text-red-400 hover:underline">
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 grid gap-2">
                    <select
                      aria-label="Kind of test"
                      value={h.type}
                      onChange={(e) => {
                        const next = defaultHypothesis(e.target.value as Hypothesis["type"]);
                        if (next) setHyp(h.id, { ...next, id: h.id });
                      }}
                      className={inputCls}
                    >
                      <option value="corr">Correlation (Pearson r)</option>
                      <option value="compare">Group difference (t-test / ANOVA)</option>
                      <option value="chi">Chi-square (two answers)</option>
                    </select>
                    {h.type === "corr" && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <select aria-label="First variable" value={tKey(h.a)} onChange={(e) => setHyp(h.id, { ...h, a: fromKey(e.target.value) })} className={inputCls}>
                          {scoreTargets.map((o) => (
                            <option key={o.key} value={o.key}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <select aria-label="Second variable" value={tKey(h.b)} onChange={(e) => setHyp(h.id, { ...h, b: fromKey(e.target.value) })} className={inputCls}>
                          {scoreTargets.map((o) => (
                            <option key={o.key} value={o.key}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {h.type === "compare" && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <select aria-label="What to compare" value={tKey(h.target)} onChange={(e) => setHyp(h.id, { ...h, target: fromKey(e.target.value) })} className={inputCls}>
                          {scoreTargets.map((o) => (
                            <option key={o.key} value={o.key}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <select aria-label="Compare by" value={h.by} onChange={(e) => setHyp(h.id, { ...h, by: Number(e.target.value) })} className={inputCls}>
                          {categoryCols.map((c) => (
                            <option key={c.index} value={c.index}>
                              by {c.label} ({uniqueCount(ds, c.index)} groups)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {h.type === "chi" && (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {(["a", "b"] as const).map((k) => (
                          <select key={k} aria-label={k === "a" ? "First question" : "Second question"} value={h[k]} onChange={(e) => setHyp(h.id, { ...h, [k]: Number(e.target.value) })} className={inputCls}>
                            {chiCols.map((c) => (
                              <option key={c.index} value={c.index}>
                                {c.label.length > 60 ? c.label.slice(0, 60) + "…" : c.label}
                              </option>
                            ))}
                          </select>
                        ))}
                      </div>
                    )}
                    <input
                      aria-label="Hypothesis wording"
                      value={h.statement || ""}
                      onChange={(e) => setHyp(h.id, { ...h, statement: e.target.value })}
                      placeholder="H0 wording (optional), e.g. There is no significant relationship between…"
                      className={inputCls}
                    />
                  </div>
                </li>
              ))}
            </ul>
            {hypotheses.length === 0 && <p className="mt-4 text-[14px] text-brand-muted">No hypotheses. That&rsquo;s fine if your project only has research questions.</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {(
                [
                  ["corr", "Add correlation"],
                  ["compare", "Add group difference"],
                  ["chi", "Add chi-square"],
                ] as const
              ).map(([type, label]) => {
                const h = defaultHypothesis(type);
                return h ? (
                  <GhostButton key={type} onClick={() => setHypotheses((hs) => [...hs, h])}>
                    {label}
                  </GhostButton>
                ) : null;
              })}
            </div>
          </Card>

          <div className="flex flex-wrap justify-between gap-3">
            <GhostButton onClick={() => go(2)}>Back</GhostButton>
            <PrimaryButton onClick={() => go(4)}>Analyse my data</PrimaryButton>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ step 4 */}
      {step === 4 && report && (
        <div className="mt-6 space-y-5">
          {payNote && (
            <p role="status" className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-[14px] text-emerald-300">
              {payNote}
            </p>
          )}

          {unlocked ? (
            <Card>
              <h2 className="text-[18px] font-semibold text-brand-ink">Your Chapter Four is ready</h2>
              <p className="mt-1 text-[14px] text-brand-muted">
                Download it as a Word file to edit, or as a PDF. Read through it and adjust the interpretation to fit your study before you submit. You can change settings and download again as often as you need for this data file.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <PrimaryButton disabled={!!busy} onClick={downloadWord}>
                  {busy === "word" ? "Preparing Word file…" : "Download Word (.docx)"}
                </PrimaryButton>
                <GhostButton onClick={downloadPdf}>{busy === "pdf" ? "Preparing PDF…" : "Download PDF"}</GhostButton>
              </div>
              {downloadError && (
                <p role="alert" className="mt-3 text-[13px] text-red-400">
                  {downloadError}
                </p>
              )}
            </Card>
          ) : (
            <Card>
              <h2 className="text-[18px] font-semibold text-brand-ink">Your Chapter Four is ready</h2>
              <p className="mt-1 text-[14px] text-brand-muted">
                Unlock the full analysis and download it as an editable Word file and a PDF for <strong className="text-brand-ink">{PRICE}</strong>, one payment for this data file. Change settings and download again as often as you need.
              </p>
              <form onSubmit={pay} className="mt-4 space-y-3">
                <div>
                  <label htmlFor="da-email" className={labelCls}>
                    Email for your receipt
                  </label>
                  <input
                    id="da-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={payEmail}
                    onChange={(e) => setPayEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`mt-1.5 ${inputCls}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={paying || !hash}
                  className="min-h-[48px] w-full rounded-full bg-brand-accent px-6 py-3 text-[15px] font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {paying ? "Opening secure payment…" : `Pay ${PRICE} and download`}
                </button>
                <p className="text-[12px] text-brand-muted">Secure payment by Paystack: card, bank transfer or USSD. You come straight back here to download.</p>
              </form>
              {payError && (
                <p role="alert" className="mt-3 text-[13px] text-red-400">
                  {payError}
                </p>
              )}
              <details className="mt-4 text-[13px] text-brand-muted">
                <summary className="cursor-pointer font-semibold text-brand-ink">Already paid for this file?</summary>
                <form onSubmit={useReference} className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input aria-label="Payment reference" value={refInput} onChange={(e) => setRefInput(e.target.value)} placeholder="Payment reference from your receipt email" className={inputCls} />
                  <GhostButton submit>{checkingRef ? "Checking…" : "Unlock"}</GhostButton>
                </form>
              </details>
            </Card>
          )}

          {report.warnings.length > 0 && (
            <div role="status" className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-[14px] text-amber-200">
              <p className="font-semibold">Please check</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {report.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          <ReportPreview report={report} locked={!unlocked} />

          <div className="flex flex-wrap justify-between gap-3">
            <GhostButton onClick={() => go(3)}>Back to hypotheses</GhostButton>
            <Link href="/students/projects" className="min-h-[44px] rounded-full px-2 py-3 text-[14px] font-semibold text-brand-link hover:underline">
              Need help with the rest of your project?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
