/** Reading survey responses and working out what each column is. */

export type Dataset = { headers: string[]; rows: string[][] };

export type ColumnRole = "ignore" | "demographic" | "likert" | "numeric";

export type ScaleKind = "agree5" | "agree4" | "freq5" | "level5" | "num5" | "num4" | "yesno";

export type ColumnConfig = {
  index: number;
  header: string;
  /** Short label used in tables (the part in [brackets] for Google Forms grids). */
  label: string;
  role: ColumnRole;
  scale?: ScaleKind;
  /** Research question group for Likert items. */
  group?: number;
};

/** Score for each answer on each scale; labels listed from the highest score down. */
export const SCALES: Record<ScaleKind, { name: string; labels: string[]; short: string[]; scores: number[]; positive: string; negative: string }> = {
  agree5: { name: "5-point agreement", labels: ["Strongly Agree", "Agree", "Undecided", "Disagree", "Strongly Disagree"], short: ["SA", "A", "U", "D", "SD"], scores: [5, 4, 3, 2, 1], positive: "Agreed", negative: "Disagreed" },
  agree4: { name: "4-point agreement", labels: ["Strongly Agree", "Agree", "Disagree", "Strongly Disagree"], short: ["SA", "A", "D", "SD"], scores: [4, 3, 2, 1], positive: "Agreed", negative: "Disagreed" },
  freq5: { name: "5-point frequency", labels: ["Always", "Often", "Sometimes", "Rarely", "Never"], short: ["Al", "Of", "So", "Ra", "Ne"], scores: [5, 4, 3, 2, 1], positive: "Accepted", negative: "Rejected" },
  level5: { name: "5-point level", labels: ["Very High", "High", "Moderate", "Low", "Very Low"], short: ["VH", "H", "M", "L", "VL"], scores: [5, 4, 3, 2, 1], positive: "Accepted", negative: "Rejected" },
  num5: { name: "1–5 rating", labels: ["5", "4", "3", "2", "1"], short: ["5", "4", "3", "2", "1"], scores: [5, 4, 3, 2, 1], positive: "Accepted", negative: "Rejected" },
  num4: { name: "1–4 rating", labels: ["4", "3", "2", "1"], short: ["4", "3", "2", "1"], scores: [4, 3, 2, 1], positive: "Accepted", negative: "Rejected" },
  yesno: { name: "Yes / No", labels: ["Yes", "No"], short: ["Yes", "No"], scores: [2, 1], positive: "Accepted", negative: "Rejected" },
};

const ALIASES: Record<string, [ScaleKind, number][]> = {};
function alias(kind: ScaleKind, score: number, ...words: string[]) {
  for (const w of words) (ALIASES[w] ||= []).push([kind, score]);
}
alias("agree5", 5, "strongly agree", "sa");
alias("agree5", 4, "agree", "a");
alias("agree5", 3, "undecided", "neutral", "not sure", "u", "un", "n", "ud", "neither agree nor disagree", "uncertain");
alias("agree5", 2, "disagree", "d");
alias("agree5", 1, "strongly disagree", "sd");
alias("agree4", 4, "strongly agree", "sa");
alias("agree4", 3, "agree", "a");
alias("agree4", 2, "disagree", "d");
alias("agree4", 1, "strongly disagree", "sd");
alias("freq5", 5, "always", "very often");
alias("freq5", 4, "often", "frequently");
alias("freq5", 3, "sometimes", "occasionally");
alias("freq5", 2, "rarely", "seldom");
alias("freq5", 1, "never");
alias("level5", 5, "very high", "very large extent", "to a very great extent", "very great extent");
alias("level5", 4, "high", "large extent", "great extent", "to a great extent");
alias("level5", 3, "moderate", "moderately", "average", "some extent", "to some extent");
alias("level5", 2, "low", "little extent", "to a little extent", "small extent");
alias("level5", 1, "very low", "no extent", "not at all", "very little extent");
alias("yesno", 2, "yes");
alias("yesno", 1, "no");

export function norm(v: string): string {
  return v.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.()]/g, "");
}

/** Score of one answer on a scale, or NaN. */
export function scoreOf(value: string, scale: ScaleKind): number {
  const v = norm(value);
  if (!v) return NaN;
  if (scale === "num5" || scale === "num4") {
    const n = Number(v);
    const max = scale === "num5" ? 5 : 4;
    return Number.isInteger(n) && n >= 1 && n <= max ? n : NaN;
  }
  const hit = ALIASES[v]?.find(([k]) => k === scale);
  return hit ? hit[1] : NaN;
}

export function labelOfScore(score: number, scale: ScaleKind): string {
  const s = SCALES[scale];
  const i = s.scores.indexOf(score);
  return i >= 0 ? s.labels[i] : String(score);
}

// ------------------------------------------------------------------ parsing

export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const delim = guessDelimiter(src);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (q) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else q = false;
      } else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function guessDelimiter(src: string): string {
  const first = src.split(/\r?\n/, 1)[0] || "";
  const counts = [",", ";", "\t"].map((d) => [d, first.split(d).length] as const);
  return counts.sort((a, b) => b[1] - a[1])[0][0];
}

/** Turn a 2-D grid (first row = headers) into a clean dataset. */
export function toDataset(grid: unknown[][]): Dataset {
  const cells = grid.map((r) => r.map(cellText));
  while (cells.length && cells[0].every((c) => !c)) cells.shift();
  const width = Math.max(0, ...cells.map((r) => r.length));
  const rawHeaders = (cells[0] || []).concat(Array(width).fill("")).slice(0, width);
  const seen = new Map<string, number>();
  const headers = rawHeaders.map((h, i) => {
    const base = h.trim() || `Column ${i + 1}`;
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    return n > 1 ? `${base} (${n})` : base;
  });
  const rows = cells
    .slice(1)
    .map((r) => headers.map((_, i) => (r[i] ?? "").trim()))
    .filter((r) => r.some((c) => c !== ""));
  // Drop columns that are completely empty.
  const keep = headers.map((_, i) => rows.some((r) => r[i] !== ""));
  return {
    headers: headers.filter((_, i) => keep[i]),
    rows: rows.map((r) => r.filter((_, i) => keep[i])),
  };
}

function cellText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v).trim();
}

// ------------------------------------------------------------------ detection

const IGNORE_HEADER = /^(timestamp|time ?stamp|date|e-?mail( address)?|name|full ?name|matric(ulation)?( no| number)?|phone|signature|id|s\/?n|serial( no| number)?|score)$/i;

export function itemLabel(header: string): string {
  const m = header.match(/\[(.+)\]\s*$/);
  return (m ? m[1] : header).trim();
}

function groupKey(header: string): string | null {
  const m = header.match(/^(.*?)\s*\[.+\]\s*$/);
  return m ? m[1].trim() : null;
}

export function detectScale(values: string[]): ScaleKind | null {
  const vals = values.filter((v) => v !== "");
  if (vals.length === 0) return null;
  const order: ScaleKind[] = ["agree5", "agree4", "freq5", "level5", "yesno", "num5", "num4"];
  for (const kind of order) {
    if (!vals.every((v) => isFinite(scoreOf(v, kind)))) continue;
    if (kind === "agree5") {
      // A 4-point scale has no neutral option at all.
      if (!vals.some((v) => scoreOf(v, "agree5") === 3)) return isFinite(scoreOf(vals[0], "agree4")) ? "agree4" : "agree5";
    }
    if (kind === "num5" || kind === "num4") {
      if (new Set(vals).size < 3) return null;
      if (kind === "num5" && !vals.some((v) => v === "5")) continue;
    }
    if (kind === "yesno") return null; // yes/no questions are better as demographics-style tables
    return kind;
  }
  return null;
}

export function detectColumns(ds: Dataset): { columns: ColumnConfig[]; groups: string[] } {
  const columns: ColumnConfig[] = ds.headers.map((header, index) => {
    const values = ds.rows.map((r) => r[index]).filter((v) => v !== "");
    const unique = new Set(values.map(norm));
    const label = itemLabel(header);
    const base = { index, header, label };
    if (IGNORE_HEADER.test(header.trim()) || values.length === 0) return { ...base, role: "ignore" as const };
    const scale = detectScale(values);
    if (scale) return { ...base, role: "likert" as const, scale };
    const numeric = values.every((v) => v !== "" && isFinite(Number(v.replace(/,/g, ""))));
    if (numeric && unique.size > 8) return { ...base, role: "numeric" as const };
    if (unique.size <= 12 || unique.size <= values.length * 0.3) return { ...base, role: "demographic" as const };
    return { ...base, role: "ignore" as const };
  });

  // Group Likert items: by Google Forms grid title, otherwise in runs of consecutive items.
  const groups: string[] = [];
  const likert = columns.filter((c) => c.role === "likert");
  const byKey = new Map<string, number>();
  let run: ColumnConfig[] = [];
  const flush = () => {
    if (!run.length) return;
    const size = run.length > 10 ? 5 : run.length;
    for (let i = 0; i < run.length; i += size) {
      groups.push(`Research Question ${groups.length + 1}`);
      for (const c of run.slice(i, i + size)) c.group = groups.length - 1;
    }
    run = [];
  };
  for (const c of likert) {
    const key = groupKey(c.header);
    if (key) {
      flush();
      if (!byKey.has(key)) {
        groups.push(key);
        byKey.set(key, groups.length - 1);
      }
      c.group = byKey.get(key);
    } else {
      if (run.length && run[run.length - 1].index !== c.index - 1) flush();
      run.push(c);
    }
  }
  flush();
  return { columns, groups };
}
