/**
 * Lightweight questionnaire analysis (descriptive stats + narrative draft).
 * Runs on server from CSV text — no Python dependency.
 */

export type ColumnProfile = {
  name: string;
  kind: "numeric" | "categorical";
  missing: number;
  n: number;
  mean?: number;
  sd?: number;
  min?: number;
  max?: number;
  frequencies?: { value: string; count: number; pct: number }[];
};

export type AnalysisResult = {
  rowCount: number;
  columnCount: number;
  columns: ColumnProfile[];
  narrative: string;
  tablesMarkdown: string;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  const s = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(cur.trim());
      cur = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(cur.trim());
      cur = "";
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
    } else cur += c;
  }
  if (cur.length || row.length) {
    row.push(cur.trim());
    if (row.some((x) => x !== "")) rows.push(row);
  }
  return rows;
}

function isNumericValue(v: string): boolean {
  if (v === "" || v == null) return false;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n);
}

function mean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function sd(nums: number[], m: number): number {
  if (nums.length < 2) return 0;
  const v = nums.reduce((a, b) => a + (b - m) ** 2, 0) / (nums.length - 1);
  return Math.sqrt(v);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function analyzeQuestionnaireCsv(csvText: string): AnalysisResult {
  const grid = parseCsv(csvText);
  if (grid.length < 2) {
    throw new Error("Need a header row and at least one data row.");
  }
  const headers = grid[0].map((h, i) => h || `Column_${i + 1}`);
  const data = grid.slice(1).filter((r) => r.some((c) => c !== ""));
  const rows = data.slice(0, 5000);

  const columns: ColumnProfile[] = headers.map((name, colIdx) => {
    const values = rows.map((r) => (r[colIdx] ?? "").trim());
    const nonEmpty = values.filter((v) => v !== "");
    const missing = values.length - nonEmpty.length;
    const numericRatio =
      nonEmpty.length === 0
        ? 0
        : nonEmpty.filter(isNumericValue).length / nonEmpty.length;
    const kind: "numeric" | "categorical" =
      numericRatio >= 0.8 ? "numeric" : "categorical";

    if (kind === "numeric") {
      const nums = nonEmpty
        .filter(isNumericValue)
        .map((v) => Number(String(v).replace(/,/g, "")));
      const m = nums.length ? mean(nums) : 0;
      return {
        name,
        kind,
        missing,
        n: nums.length,
        mean: nums.length ? round2(m) : undefined,
        sd: nums.length ? round2(sd(nums, m)) : undefined,
        min: nums.length ? round2(Math.min(...nums)) : undefined,
        max: nums.length ? round2(Math.max(...nums)) : undefined,
      };
    }

    const counts = new Map<string, number>();
    for (const v of nonEmpty) counts.set(v, (counts.get(v) || 0) + 1);
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const frequencies = sorted.slice(0, 12).map(([value, count]) => ({
      value: value.slice(0, 80),
      count,
      pct: nonEmpty.length ? round2((count / nonEmpty.length) * 100) : 0,
    }));
    return { name, kind, missing, n: nonEmpty.length, frequencies };
  });

  const narrative = buildNarrative(rows.length, columns);
  const tablesMarkdown = buildTables(columns);
  return { rowCount: rows.length, columnCount: headers.length, columns, narrative, tablesMarkdown };
}

function buildNarrative(n: number, columns: ColumnProfile[]): string {
  const lines: string[] = [];
  lines.push(
    `This section presents the analysis of questionnaire responses from ${n} respondent${n === 1 ? "" : "s"} across ${columns.length} variable${columns.length === 1 ? "" : "s"}. Findings are descriptive and should be verified against your research questions and supervisor guidance.`
  );
  lines.push("");
  lines.push("Sample overview");
  lines.push(
    `A total of ${n} valid response rows were included after removing completely empty rows. Missing values were noted per variable where applicable.`
  );
  const cats = columns.filter((c) => c.kind === "categorical" && c.frequencies?.length);
  const nums = columns.filter((c) => c.kind === "numeric" && c.mean != null);
  if (cats.length) {
    lines.push("");
    lines.push("Categorical findings");
    for (const c of cats.slice(0, 8)) {
      const top = c.frequencies![0];
      lines.push(
        `For “${c.name}” (n = ${c.n}), the most frequent response was “${top.value}” (${top.count} respondents; ${top.pct}%).`
      );
    }
  }
  if (nums.length) {
    lines.push("");
    lines.push("Numeric / scale findings");
    for (const c of nums.slice(0, 8)) {
      lines.push(
        `For “${c.name}” (n = ${c.n}), the mean score was ${c.mean} (SD = ${c.sd}), ranging from ${c.min} to ${c.max}.`
      );
    }
  }
  lines.push("");
  lines.push("Summary");
  lines.push(
    "Overall, the descriptive results above summarise the main patterns in the uploaded responses. Cross-tabulations and hypothesis tests can be added in a full statistical project package if required."
  );
  lines.push("");
  lines.push(
    "— Draft generated by DoyinTech Student Analyzer. Edit to match your institution’s format."
  );
  return lines.join("\n");
}

function buildTables(columns: ColumnProfile[]): string {
  const parts: string[] = [];
  for (const c of columns) {
    if (c.kind === "numeric") {
      parts.push(`### ${c.name} (numeric)\n`);
      parts.push("| Statistic | Value |");
      parts.push("| --- | --- |");
      parts.push(`| N | ${c.n} |");
      parts.push(`| Mean | ${c.mean ?? "—"} |");
      parts.push(`| SD | ${c.sd ?? "—"} |");
      parts.push("");
    } else if (c.frequencies?.length) {
      parts.push(`### ${c.name} (frequencies)\n`);
      parts.push("| Response | Count | % |");
      parts.push("| --- | --- | --- |");
      for (const f of c.frequencies) {
        parts.push(`| ${f.value.replace(/\|/g, "/")} | ${f.count} | ${f.pct} |");
      }
      parts.push("");
    }
  }
  return parts.join("\n");
}
