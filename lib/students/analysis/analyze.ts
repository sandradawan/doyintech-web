/** Builds Chapter Four (presentation, analysis and interpretation of data) from survey responses. */
import { SCALES, labelOfScore, norm, scoreOf, type ColumnConfig, type Dataset, type ScaleKind } from "./dataset";
import {
  alphaLabel,
  anova,
  chiSquare,
  corrStrength,
  cronbachAlpha,
  fmt,
  fmtP,
  mean,
  pearson,
  sd,
  tTest,
} from "./stats";

/** A target for correlation or comparison: a research-question group score or a numeric column. */
export type Target = { kind: "group"; group: number } | { kind: "column"; index: number };

export type Hypothesis =
  | { id: string; type: "chi"; a: number; b: number; statement?: string }
  | { id: string; type: "corr"; a: Target; b: Target; statement?: string }
  | { id: string; type: "compare"; target: Target; by: number; statement?: string };

export type AnalysisConfig = {
  title: string;
  distributed?: number;
  alpha: number;
  columns: ColumnConfig[];
  groups: string[];
  hypotheses: Hypothesis[];
  /** Include item percentages in the research question tables. */
  showPercent: boolean;
};

export type Table = { caption: string; head: string[]; rows: string[][]; widths?: number[]; boldLast?: boolean; note?: string };
export type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "table"; table: Table }
  | { type: "chart"; title: string; labels: string[]; values: number[] };

export type Report = { title: string; blocks: Block[]; warnings: string[] };

const WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const word = (i: number) => WORDS[i] || String(i + 1);
const pct = (n: number, d: number) => (d ? (n / d) * 100 : 0);
const p1 = (x: number) => `${fmt(x, 1)}%`;

function cutoff(scale: ScaleKind): number {
  const s = SCALES[scale].scores;
  return mean(s);
}

/** Order demographic categories: numeric-looking ranges ascending, otherwise by frequency. */
function categories(values: string[]): { value: string; count: number }[] {
  const counts = new Map<string, { value: string; count: number }>();
  for (const v of values) {
    if (!v) continue;
    const k = norm(v);
    const e = counts.get(k);
    if (e) e.count++;
    else counts.set(k, { value: v.trim(), count: 1 });
  }
  const list = Array.from(counts.values());
  const lead = (s: string) => {
    const m = s.match(/(\d+(\.\d+)?)/);
    return m ? Number(m[1]) : NaN;
  };
  const allNum = list.every((c) => isFinite(lead(c.value)));
  return allNum ? list.sort((a, b) => lead(a.value) - lead(b.value)) : list.sort((a, b) => b.count - a.count);
}

export function canonicalCategory(values: string[], v: string): string {
  const k = norm(v);
  return values.find((x) => norm(x) === k) || v;
}

export function analyze(ds: Dataset, cfg: AnalysisConfig): Report {
  const blocks: Block[] = [];
  const warnings: string[] = [];
  const findings: string[] = [];
  const n = ds.rows.length;
  const col = (i: number) => ds.rows.map((r) => r[i] ?? "");
  const cfgOf = (i: number) => cfg.columns.find((c) => c.index === i);
  let tableNo = 0;
  const caption = (t: string) => `Table 4.${++tableNo}: ${t}`;
  const alpha = cfg.alpha;

  const demographics = cfg.columns.filter((c) => c.role === "demographic");
  const numerics = cfg.columns.filter((c) => c.role === "numeric");
  const likert = cfg.columns.filter((c) => c.role === "likert" && c.scale);
  const groups = cfg.groups.map((title, gi) => ({ title, items: likert.filter((c) => c.group === gi) })).filter((g) => g.items.length);

  /** Respondent-level composite score (mean of answered items, needs at least half). */
  const groupScores = (gi: number): number[] => {
    const items = likert.filter((c) => c.group === gi);
    return ds.rows.map((r) => {
      const s = items.map((c) => scoreOf(r[c.index] ?? "", c.scale!)).filter((x) => isFinite(x));
      return s.length >= Math.ceil(items.length / 2) ? mean(s) : NaN;
    });
  };
  const targetValues = (t: Target): number[] =>
    t.kind === "group" ? groupScores(t.group) : col(t.index).map((v) => (v === "" ? NaN : Number(v.replace(/,/g, ""))));
  const targetName = (t: Target): string =>
    t.kind === "group" ? cfg.groups[t.group] || `Research Question ${t.group + 1}` : cfgOf(t.index)?.label || ds.headers[t.index];

  blocks.push({ type: "h1", text: "CHAPTER FOUR" });
  blocks.push({ type: "h1", text: "DATA PRESENTATION, ANALYSIS AND INTERPRETATION" });
  blocks.push({ type: "h2", text: "4.1 Introduction" });
  blocks.push({
    type: "p",
    text:
      `This chapter presents, analyses and interprets the data collected from respondents for the study${cfg.title ? ` titled "${cfg.title}"` : ""}. ` +
      `A total of ${n} valid responses were analysed. Frequency counts and simple percentages were used to describe the respondents, ` +
      (groups.length ? "mean and standard deviation were used to answer the research questions, " : "") +
      (cfg.hypotheses.length ? `and the hypotheses were tested at the ${alpha} level of significance. ` : "") +
      "The results are presented in tables followed by their interpretation.",
  });

  let sec = 1;
  // ---------------------------------------------------------------- response rate
  if (cfg.distributed && cfg.distributed > 0) {
    sec++;
    const d = cfg.distributed;
    const rate = pct(n, d);
    blocks.push({ type: "h2", text: `4.${sec} Response Rate` });
    blocks.push({
      type: "table",
      table: {
        caption: caption("Questionnaire response rate"),
        head: ["Questionnaire", "Frequency", "Percentage (%)"],
        rows: [
          ["Returned and valid", String(n), fmt(rate, 1)],
          ["Not returned or invalid", String(Math.max(0, d - n)), fmt(Math.max(0, 100 - rate), 1)],
          ["Total distributed", String(d), "100.0"],
        ],
        boldLast: true,
      },
    });
    blocks.push({
      type: "p",
      text: `Table 4.${tableNo} shows that out of ${d} copies of the questionnaire distributed, ${n} (${p1(rate)}) were returned and found valid for analysis. ${
        rate >= 70 ? "This response rate is considered adequate for drawing conclusions from the study." : rate >= 50 ? "This response rate is considered acceptable for the study." : "This response rate is low, and the findings should be interpreted with caution."
      }`,
    });
    if (n > d) warnings.push("More responses than questionnaires distributed: check the 'questionnaires distributed' number.");
  }

  // ---------------------------------------------------------------- demographics
  if (demographics.length || numerics.length) {
    sec++;
    blocks.push({ type: "h2", text: `4.${sec} Demographic Characteristics of Respondents` });
    blocks.push({ type: "p", text: "This section presents the background information of the respondents." });
    for (const c of demographics) {
      const vals = col(c.index);
      const cats = categories(vals);
      const total = cats.reduce((s, x) => s + x.count, 0);
      let cum = 0;
      const rows = cats.map((x) => {
        const p = pct(x.count, total);
        cum += p;
        return [x.value, String(x.count), fmt(p, 1), fmt(Math.min(100, cum), 1)];
      });
      rows.push(["Total", String(total), "100.0", ""]);
      blocks.push({
        type: "table",
        table: { caption: caption(`Distribution of respondents by ${c.label.toLowerCase()}`), head: [c.label, "Frequency", "Percentage (%)", "Cumulative (%)"], rows, boldLast: true },
      });
      blocks.push({ type: "chart", title: c.label, labels: cats.map((x) => x.value), values: cats.map((x) => x.count) });
      const parts = cats.map((x) => `${x.count} (${p1(pct(x.count, total))}) ${x.value}`);
      const top = cats.reduce((a, b) => (b.count > a.count ? b : a));
      const missing = n - total;
      blocks.push({
        type: "p",
        text:
          `Table 4.${tableNo} shows the distribution of respondents by ${c.label.toLowerCase()}. ` +
          `The responses were ${listJoin(parts)}. ` +
          (cats.length > 1 ? `This implies that most of the respondents were in the "${top.value}" category (${p1(pct(top.count, total))}).` : "") +
          (missing > 0 ? ` ${missing} respondent${missing === 1 ? "" : "s"} did not answer this question.` : ""),
      });
    }
    if (numerics.length) {
      const rows = numerics.map((c) => {
        const xs = col(c.index).filter((v) => v !== "").map((v) => Number(v.replace(/,/g, ""))).filter((x) => isFinite(x));
        return [c.label, String(xs.length), fmt(Math.min(...xs)), fmt(Math.max(...xs)), fmt(mean(xs)), fmt(sd(xs))];
      });
      blocks.push({ type: "table", table: { caption: caption("Descriptive statistics of numeric variables"), head: ["Variable", "N", "Minimum", "Maximum", "Mean", "Std. Deviation"], rows } });
      blocks.push({
        type: "p",
        text: `Table 4.${tableNo} presents the descriptive statistics. ` + rows.map((r) => `${r[0]} ranged from ${r[2]} to ${r[3]}, with a mean of ${r[4]} and a standard deviation of ${r[5]}`).join("; ") + ".",
      });
    }
  }

  // ---------------------------------------------------------------- research questions
  if (groups.length) {
    sec++;
    const sec0 = sec;
    blocks.push({ type: "h2", text: `4.${sec} Analysis of Research Questions` });
    const scales = Array.from(new Set(likert.map((c) => c.scale!)));
    blocks.push({
      type: "p",
      text:
        "The research questions were answered using the mean and standard deviation of the responses. " +
        scales
          .map((s) => {
            const sc = SCALES[s];
            return `For the ${sc.name} scale (${sc.labels.map((l, i) => `${l} = ${sc.scores[i]}`).join(", ")}), the criterion mean is ${fmt(cutoff(s))}`;
          })
          .join("; ") +
        ". Any item with a mean score equal to or greater than the criterion mean was regarded as " +
        `"${SCALES[scales[0]].positive}", while items below it were regarded as "${SCALES[scales[0]].negative}".`,
    });
    groups.forEach((g, gi) => {
      const scale = g.items[0].scale!;
      const sc = SCALES[scale];
      const cut = cutoff(scale);
      blocks.push({ type: "h3", text: `4.${sec0}.${gi + 1} Research Question ${word(gi)}: ${g.title}` });
      const itemStats = g.items.map((c) => {
        const scores = col(c.index).map((v) => scoreOf(v, c.scale!)).filter((x) => isFinite(x));
        const counts = sc.scores.map((s) => scores.filter((x) => x === s).length);
        const m = mean(scores);
        return { c, scores, counts, m, s: sd(scores), n: scores.length };
      });
      const rows = itemStats.map((it, i) => [
        String(i + 1),
        it.c.label,
        ...it.counts.map((k) => (cfg.showPercent ? `${k}\n(${fmt(pct(k, it.n), 1)}%)` : String(k))),
        String(it.n),
        fmt(it.m),
        fmt(it.s),
        it.m >= cut ? sc.positive : sc.negative,
      ]);
      const gm = mean(itemStats.map((it) => it.m));
      const gsd = mean(itemStats.map((it) => it.s));
      rows.push(["", "Grand mean", ...sc.short.map(() => ""), "", fmt(gm), fmt(gsd), gm >= cut ? sc.positive : sc.negative]);
      blocks.push({
        type: "table",
        table: {
          caption: caption(`Mean and standard deviation of responses on ${g.title.replace(/\?$/, "").toLowerCase()}`),
          head: ["S/N", "Item", ...sc.short, "N", "Mean", "SD", "Decision"],
          rows,
          boldLast: true,
          note: `Criterion mean = ${fmt(cut)}. ${sc.short.map((s, i) => `${s} = ${sc.labels[i]}`).join(", ")}.`,
        },
      });
      const pos = itemStats.filter((it) => it.m >= cut);
      const sorted = [...itemStats].sort((a, b) => b.m - a.m);
      const hi = sorted[0];
      const lo = sorted[sorted.length - 1];
      const decision = gm >= cut ? sc.positive.toLowerCase() : sc.negative.toLowerCase();
      blocks.push({
        type: "p",
        text:
          `Table 4.${tableNo} shows the responses on research question ${word(gi).toLowerCase()}. ` +
          `${pos.length} out of ${itemStats.length} item${itemStats.length === 1 ? "" : "s"} had mean scores equal to or above the criterion mean of ${fmt(cut)}. ` +
          `Item ${itemStats.indexOf(hi) + 1} ("${hi.c.label}") had the highest mean (${fmt(hi.m)}), ` +
          (itemStats.length > 1 ? `while item ${itemStats.indexOf(lo) + 1} ("${lo.c.label}") had the lowest mean (${fmt(lo.m)}). ` : "") +
          `The grand mean of ${fmt(gm)} is ${gm >= cut ? "above" : "below"} the criterion mean, which shows that respondents generally ${decision === "agreed" || decision === "disagreed" ? decision : `${decision} the items`} on ${g.title.replace(/\?$/, "").toLowerCase()}.`,
      });
      findings.push(`On ${g.title.replace(/\?$/, "").toLowerCase()}, the grand mean was ${fmt(gm)} (criterion ${fmt(cut)}), so respondents generally ${decision === "agreed" || decision === "disagreed" ? decision : `${decision} the items`}; the strongest item was "${hi.c.label}" (mean ${fmt(hi.m)}).`);
    });

    // ---------------------------------------------------------------- reliability
    const rel = groups
      .map((g) => ({ g, r: cronbachAlpha(g.items.map((c) => col(c.index).map((v) => scoreOf(v, c.scale!)))) }))
      .filter((x) => x.r.k >= 2);
    if (rel.length) {
      sec++;
      blocks.push({ type: "h2", text: `4.${sec} Reliability of the Instrument` });
      blocks.push({
        type: "table",
        table: {
          caption: caption("Cronbach's alpha reliability coefficients"),
          head: ["Scale", "No. of items", "Cronbach's alpha", "Remark"],
          rows: rel.map(({ g, r }) => [g.title, String(r.k), fmt(r.alpha, 3), alphaLabel(r.alpha)]),
        },
      });
      blocks.push({
        type: "p",
        text:
          `Table 4.${tableNo} shows the internal consistency of each section of the questionnaire. ` +
          rel.map(({ g, r }) => `"${g.title}" had an alpha of ${fmt(r.alpha, 3)} (${alphaLabel(r.alpha).toLowerCase()})`).join("; ") +
          ". A coefficient of 0.70 and above is generally regarded as acceptable reliability.",
      });
      for (const { g, r } of rel) if (isFinite(r.alpha) && r.alpha < 0.6) warnings.push(`Low reliability for "${g.title}" (alpha ${fmt(r.alpha, 3)}). Check for negatively worded items or items that don't belong.`);
    }
  }

  // ---------------------------------------------------------------- hypotheses
  if (cfg.hypotheses.length) {
    sec++;
    const sec0 = sec;
    blocks.push({ type: "h2", text: `4.${sec} Test of Hypotheses` });
    blocks.push({ type: "p", text: `The hypotheses were tested at the ${alpha} level of significance. A null hypothesis is rejected when the p-value is less than ${alpha}; otherwise it is retained.` });
    cfg.hypotheses.forEach((h, hi) => {
      const label = `Hypothesis ${word(hi)}`;
      try {
        if (h.type === "chi") {
          const ca = cfgOf(h.a);
          const cb = cfgOf(h.b);
          const an = ca?.label || ds.headers[h.a];
          const bn = cb?.label || ds.headers[h.b];
          const prep = (c: ColumnConfig | undefined, i: number) => {
            const vals = col(i);
            if (c?.role === "likert" && c.scale) return { vals: vals.map((v) => (isFinite(scoreOf(v, c.scale!)) ? labelOfScore(scoreOf(v, c.scale!), c.scale!) : "")), order: SCALES[c.scale].labels };
            const cats = categories(vals).map((x) => x.value);
            return { vals: vals.map((v) => (v ? canonicalCategory(cats, v) : "")), order: cats };
          };
          const A = prep(ca, h.a);
          const B = prep(cb, h.b);
          const r = chiSquare(A.vals, B.vals, A.order, B.order);
          const statement = h.statement || `There is no significant relationship between ${an.toLowerCase()} and ${bn.toLowerCase()}.`;
          blocks.push({ type: "h3", text: `4.${sec0}.${hi + 1} ${label}` });
          blocks.push({ type: "p", text: `H0: ${statement}` });
          const rows = r.rows.map((rv, i) => [rv, ...r.observed[i].map(String), String(r.observed[i].reduce((s, v) => s + v, 0))]);
          rows.push(["Total", ...r.cols.map((_, j) => String(r.observed.reduce((s, row) => s + row[j], 0))), String(r.n)]);
          blocks.push({ type: "table", table: { caption: caption(`Cross-tabulation of ${an.toLowerCase()} and ${bn.toLowerCase()}`), head: [an, ...r.cols, "Total"], rows, boldLast: true } });
          blocks.push({
            type: "table",
            table: {
              caption: caption(`Chi-square test of ${an.toLowerCase()} and ${bn.toLowerCase()}`),
              head: ["Test", "Value", "df", "p-value", "Cramér's V", "Decision"],
              rows: [["Pearson chi-square", fmt(r.chi2, 3), String(r.df), fmtP(r.p), fmt(r.cramersV, 3), r.p < alpha ? "Reject H0" : "Retain H0"]],
            },
          });
          blocks.push({ type: "p", text: hypothesisText(r.p, alpha, `χ²(${r.df}, N = ${r.n}) = ${fmt(r.chi2, 3)}`, `a significant relationship between ${an.toLowerCase()} and ${bn.toLowerCase()}`) });
          if (r.lowExpectedPct > 20) warnings.push(`${label}: ${fmt(r.lowExpectedPct, 0)}% of cells have expected counts below 5, so the chi-square result may not be reliable. Consider merging small categories.`);
          findings.push(`${label}: ${r.p < alpha ? "there is" : "there is no"} significant relationship between ${an.toLowerCase()} and ${bn.toLowerCase()} (p = ${fmtP(r.p)}).`);
        } else if (h.type === "corr") {
          const an = targetName(h.a);
          const bn = targetName(h.b);
          const r = pearson(targetValues(h.a), targetValues(h.b));
          const statement = h.statement || `There is no significant relationship between ${an.toLowerCase()} and ${bn.toLowerCase()}.`;
          blocks.push({ type: "h3", text: `4.${sec0}.${hi + 1} ${label}` });
          blocks.push({ type: "p", text: `H0: ${statement}` });
          blocks.push({
            type: "table",
            table: {
              caption: caption(`Pearson correlation between ${an.toLowerCase()} and ${bn.toLowerCase()}`),
              head: ["Variables", "N", "r", "p-value", "Strength", "Decision"],
              rows: [[`${an} × ${bn}`, String(r.n), fmt(r.r, 3), fmtP(r.p), `${corrStrength(r.r)} ${r.r >= 0 ? "positive" : "negative"}`, r.p < alpha ? "Reject H0" : "Retain H0"]],
            },
          });
          blocks.push({
            type: "p",
            text:
              hypothesisText(r.p, alpha, `r(${r.df}) = ${fmt(r.r, 3)}`, `a significant relationship between ${an.toLowerCase()} and ${bn.toLowerCase()}`) +
              ` The correlation is ${corrStrength(r.r)} and ${r.r >= 0 ? "positive, meaning that as one increases the other tends to increase" : "negative, meaning that as one increases the other tends to decrease"}.`,
          });
          findings.push(`${label}: ${r.p < alpha ? "there is a significant" : "there is no significant"} relationship between ${an.toLowerCase()} and ${bn.toLowerCase()} (r = ${fmt(r.r, 3)}, p = ${fmtP(r.p)}).`);
        } else {
          const tn = targetName(h.target);
          const bc = cfgOf(h.by);
          const bn = bc?.label || ds.headers[h.by];
          const values = targetValues(h.target);
          const raw = col(h.by);
          const cats = categories(raw).map((x) => x.value);
          const groupsV = cats
            .map((name) => ({ name, values: values.filter((v, i) => raw[i] && canonicalCategory(cats, raw[i]) === name && isFinite(v)) }))
            .filter((g) => g.values.length >= 2);
          const statement = h.statement || `There is no significant difference in ${tn.toLowerCase()} based on ${bn.toLowerCase()}.`;
          blocks.push({ type: "h3", text: `4.${sec0}.${hi + 1} ${label}` });
          blocks.push({ type: "p", text: `H0: ${statement}` });
          if (groupsV.length < 2) throw new Error(`"${bn}" needs at least two groups with two or more respondents each.`);
          if (groupsV.length === 2) {
            const r = tTest(groupsV[0].values, groupsV[1].values, [groupsV[0].name, groupsV[1].name]);
            blocks.push({
              type: "table",
              table: {
                caption: caption(`Independent samples t-test of ${tn.toLowerCase()} by ${bn.toLowerCase()}`),
                head: [bn, "N", "Mean", "SD", "t", "df", "p-value", "Decision"],
                rows: [
                  [r.groups[0].name, String(r.groups[0].n), fmt(r.groups[0].mean), fmt(r.groups[0].sd), fmt(r.t, 3), String(r.df), fmtP(r.p), r.p < alpha ? "Reject H0" : "Retain H0"],
                  [r.groups[1].name, String(r.groups[1].n), fmt(r.groups[1].mean), fmt(r.groups[1].sd), "", "", "", ""],
                ],
              },
            });
            blocks.push({ type: "p", text: hypothesisText(r.p, alpha, `t(${r.df}) = ${fmt(r.t, 3)}`, `a significant difference in ${tn.toLowerCase()} between ${r.groups[0].name} (M = ${fmt(r.groups[0].mean)}) and ${r.groups[1].name} (M = ${fmt(r.groups[1].mean)})`) });
            findings.push(`${label}: ${r.p < alpha ? "there is a significant" : "there is no significant"} difference in ${tn.toLowerCase()} based on ${bn.toLowerCase()} (t = ${fmt(r.t, 3)}, p = ${fmtP(r.p)}).`);
          } else {
            const r = anova(groupsV);
            blocks.push({
              type: "table",
              table: {
                caption: caption(`Mean ${tn.toLowerCase()} by ${bn.toLowerCase()}`),
                head: [bn, "N", "Mean", "SD"],
                rows: r.groups.map((g) => [g.name, String(g.n), fmt(g.mean), fmt(g.sd)]),
              },
            });
            blocks.push({
              type: "table",
              table: {
                caption: caption(`One-way ANOVA of ${tn.toLowerCase()} by ${bn.toLowerCase()}`),
                head: ["Source", "Sum of squares", "df", "Mean square", "F", "p-value", "Decision"],
                rows: [
                  ["Between groups", fmt(r.ssBetween, 3), String(r.dfBetween), fmt(r.msBetween, 3), fmt(r.f, 3), fmtP(r.p), r.p < alpha ? "Reject H0" : "Retain H0"],
                  ["Within groups", fmt(r.ssWithin, 3), String(r.dfWithin), fmt(r.msWithin, 3), "", "", ""],
                  ["Total", fmt(r.ssBetween + r.ssWithin, 3), String(r.dfBetween + r.dfWithin), "", "", "", ""],
                ],
              },
            });
            blocks.push({ type: "p", text: hypothesisText(r.p, alpha, `F(${r.dfBetween}, ${r.dfWithin}) = ${fmt(r.f, 3)}`, `a significant difference in ${tn.toLowerCase()} across the ${bn.toLowerCase()} groups`) });
            findings.push(`${label}: ${r.p < alpha ? "there is a significant" : "there is no significant"} difference in ${tn.toLowerCase()} based on ${bn.toLowerCase()} (F = ${fmt(r.f, 3)}, p = ${fmtP(r.p)}).`);
          }
        }
      } catch (e) {
        warnings.push(`${label} could not be tested: ${e instanceof Error ? e.message : "check the variables chosen"}`);
        blocks.push({ type: "p", text: "This hypothesis could not be tested with the data provided." });
      }
    });
  }

  // ---------------------------------------------------------------- summary
  if (findings.length) {
    sec++;
    blocks.push({ type: "h2", text: `4.${sec} Summary of Findings` });
    blocks.push({ type: "p", text: "Based on the analysis, the following findings were made:" });
    blocks.push({ type: "bullets", items: findings });
  }
  if (n < 30) warnings.push(`Only ${n} responses. Statistical tests are less reliable with fewer than 30 respondents.`);
  return { title: cfg.title, blocks, warnings };
}

function hypothesisText(p: number, alpha: number, stat: string, effect: string): string {
  const reject = p < alpha;
  return (
    `The result shows ${stat}, p = ${fmtP(p)}. Since the p-value is ${reject ? "less than" : "greater than"} the ${alpha} level of significance, ` +
    `the null hypothesis is ${reject ? "rejected" : "retained (not rejected)"}. This means that there is ${reject ? "" : "no "}${effect.replace(/^a /, reject ? "a " : "")}.`
  );
}

function listJoin(parts: string[]): string {
  if (parts.length <= 1) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}
