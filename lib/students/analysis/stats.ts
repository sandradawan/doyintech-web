/** Statistical functions for the student data analysis tool (no dependencies). */

export function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;
}

/** Sample standard deviation (n − 1), as SPSS reports it. */
export function sd(xs: number[]): number {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
}

export function variance(xs: number[]): number {
  const s = sd(xs);
  return s * s;
}

function logGamma(x: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x;
  const tmp = x + 5.5 - (x + 0.5) * Math.log(x + 5.5);
  let ser = 1.000000000190015;
  for (const ci of c) ser += ci / ++y;
  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}

/** Regularized lower incomplete gamma P(a, x). */
function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  if (x < a + 1) {
    let sum = 1 / a;
    let del = sum;
    let ap = a;
    for (let n = 0; n < 500; n++) {
      ap++;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-14) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  }
  // Continued fraction for Q, then P = 1 − Q.
  let b = x + 1 - a;
  let c = 1 / 1e-300;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

function betacf(a: number, b: number, x: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-300) d = 1e-300;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 500; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-300) d = 1e-300;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return h;
}

/** Regularized incomplete beta I_x(a, b). */
function betaI(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}

/** Upper-tail p-value of a chi-square statistic. */
export function chiSquareP(chi2: number, df: number): number {
  if (!(chi2 >= 0) || df <= 0) return NaN;
  return 1 - gammaP(df / 2, chi2 / 2);
}

/** Two-tailed p-value of a t statistic. */
export function tTwoTailedP(t: number, df: number): number {
  if (!isFinite(t) || df <= 0) return NaN;
  return betaI(df / 2, 0.5, df / (df + t * t));
}

/** Upper-tail p-value of an F statistic. */
export function fP(f: number, df1: number, df2: number): number {
  if (!(f >= 0) || df1 <= 0 || df2 <= 0) return NaN;
  return betaI(df2 / 2, df1 / 2, df2 / (df2 + df1 * f));
}

export type ChiSquareResult = {
  rows: string[];
  cols: string[];
  observed: number[][];
  chi2: number;
  df: number;
  p: number;
  n: number;
  cramersV: number;
  lowExpectedPct: number;
};

export function chiSquare(a: string[], b: string[], rowOrder?: string[], colOrder?: string[]): ChiSquareResult {
  const pairs = a.map((x, i) => [x, b[i]] as const).filter(([x, y]) => x !== "" && y !== "");
  const rows = order(pairs.map((p) => p[0]), rowOrder);
  const cols = order(pairs.map((p) => p[1]), colOrder);
  const observed = rows.map(() => cols.map(() => 0));
  for (const [x, y] of pairs) observed[rows.indexOf(x)][cols.indexOf(y)]++;
  const n = pairs.length;
  const rt = observed.map((r) => r.reduce((s, v) => s + v, 0));
  const ct = cols.map((_, j) => observed.reduce((s, r) => s + r[j], 0));
  let chi2 = 0;
  let low = 0;
  for (let i = 0; i < rows.length; i++)
    for (let j = 0; j < cols.length; j++) {
      const e = (rt[i] * ct[j]) / n;
      if (e < 5) low++;
      if (e > 0) chi2 += (observed[i][j] - e) ** 2 / e;
    }
  const df = (rows.length - 1) * (cols.length - 1);
  const k = Math.min(rows.length, cols.length) - 1;
  return {
    rows,
    cols,
    observed,
    chi2,
    df,
    p: chiSquareP(chi2, df),
    n,
    cramersV: k > 0 && n > 0 ? Math.sqrt(chi2 / (n * k)) : NaN,
    lowExpectedPct: rows.length * cols.length ? (low / (rows.length * cols.length)) * 100 : 0,
  };
}

function order(values: string[], preferred?: string[]): string[] {
  const set = Array.from(new Set(values));
  if (!preferred) return set.sort();
  return [...preferred.filter((v) => set.includes(v)), ...set.filter((v) => !preferred.includes(v)).sort()];
}

export type CorrelationResult = { r: number; n: number; t: number; df: number; p: number };

export function pearson(x: number[], y: number[]): CorrelationResult {
  const pairs = x.map((v, i) => [v, y[i]]).filter(([a, b]) => isFinite(a) && isFinite(b));
  const n = pairs.length;
  const mx = mean(pairs.map((p) => p[0]));
  const my = mean(pairs.map((p) => p[1]));
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (const [a, b] of pairs) {
    sxy += (a - mx) * (b - my);
    sxx += (a - mx) ** 2;
    syy += (b - my) ** 2;
  }
  const r = sxx && syy ? sxy / Math.sqrt(sxx * syy) : NaN;
  const df = n - 2;
  const t = Math.abs(r) >= 1 ? Infinity : (r * Math.sqrt(df)) / Math.sqrt(1 - r * r);
  return { r, n, t, df, p: Math.abs(r) >= 1 ? 0 : tTwoTailedP(t, df) };
}

export type GroupStat = { name: string; n: number; mean: number; sd: number };

export type TTestResult = { groups: GroupStat[]; t: number; df: number; p: number; meanDiff: number };

/** Independent-samples t-test (equal variances assumed, as in the SPSS first row). */
export function tTest(a: number[], b: number[], names: [string, string]): TTestResult {
  const n1 = a.length;
  const n2 = b.length;
  const sp = ((n1 - 1) * variance(a) + (n2 - 1) * variance(b)) / (n1 + n2 - 2);
  const se = Math.sqrt(sp * (1 / n1 + 1 / n2));
  const t = (mean(a) - mean(b)) / se;
  const df = n1 + n2 - 2;
  return {
    groups: [
      { name: names[0], n: n1, mean: mean(a), sd: sd(a) },
      { name: names[1], n: n2, mean: mean(b), sd: sd(b) },
    ],
    t,
    df,
    p: tTwoTailedP(t, df),
    meanDiff: mean(a) - mean(b),
  };
}

export type AnovaResult = {
  groups: GroupStat[];
  ssBetween: number;
  ssWithin: number;
  dfBetween: number;
  dfWithin: number;
  msBetween: number;
  msWithin: number;
  f: number;
  p: number;
};

export function anova(groups: { name: string; values: number[] }[]): AnovaResult {
  const all = groups.flatMap((g) => g.values);
  const gm = mean(all);
  let ssb = 0;
  let ssw = 0;
  for (const g of groups) {
    const m = mean(g.values);
    ssb += g.values.length * (m - gm) ** 2;
    ssw += g.values.reduce((s, v) => s + (v - m) ** 2, 0);
  }
  const dfb = groups.length - 1;
  const dfw = all.length - groups.length;
  const msb = ssb / dfb;
  const msw = ssw / dfw;
  const f = msb / msw;
  return {
    groups: groups.map((g) => ({ name: g.name, n: g.values.length, mean: mean(g.values), sd: sd(g.values) })),
    ssBetween: ssb,
    ssWithin: ssw,
    dfBetween: dfb,
    dfWithin: dfw,
    msBetween: msb,
    msWithin: msw,
    f,
    p: fP(f, dfb, dfw),
  };
}

/** Cronbach's alpha for a set of items (rows with any missing item are dropped). */
export function cronbachAlpha(items: number[][]): { alpha: number; k: number; n: number } {
  const k = items.length;
  if (k < 2) return { alpha: NaN, k, n: 0 };
  const rows: number[][] = [];
  for (let i = 0; i < items[0].length; i++) {
    const row = items.map((it) => it[i]);
    if (row.every((v) => isFinite(v))) rows.push(row);
  }
  const n = rows.length;
  if (n < 2) return { alpha: NaN, k, n };
  const itemVar = items.map((_, j) => variance(rows.map((r) => r[j])));
  const totalVar = variance(rows.map((r) => r.reduce((a, b) => a + b, 0)));
  const alpha = (k / (k - 1)) * (1 - itemVar.reduce((a, b) => a + b, 0) / totalVar);
  return { alpha, k, n };
}

export function alphaLabel(a: number): string {
  if (!isFinite(a)) return "Not computed";
  if (a >= 0.9) return "Excellent";
  if (a >= 0.8) return "Good";
  if (a >= 0.7) return "Acceptable";
  if (a >= 0.6) return "Questionable";
  if (a >= 0.5) return "Poor";
  return "Unacceptable";
}

export function corrStrength(r: number): string {
  const a = Math.abs(r);
  if (a >= 0.7) return "strong";
  if (a >= 0.4) return "moderate";
  if (a >= 0.1) return "weak";
  return "negligible";
}

export function fmt(x: number, d = 2): string {
  return isFinite(x) ? x.toFixed(d) : "–";
}

export function fmtP(p: number): string {
  if (!isFinite(p)) return "–";
  return p < 0.001 ? "< .001" : p.toFixed(3).replace(/^0/, "");
}
