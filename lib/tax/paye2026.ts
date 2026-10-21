/**
 * Nigeria PAYE under the Nigeria Tax Act 2025 (effective 1 January 2026).
 *
 * - Consolidated Relief Allowance is abolished.
 * - Rent relief: 20% of annual rent paid, capped at ₦500,000.
 * - Deductible: pension (employee share, default 8% of basic + housing + transport),
 *   NHF (2.5% of basic, optional), NHIS and life assurance premiums.
 * - Progressive bands on annual taxable income (below).
 *
 * Sources reviewed Oct 2026: KPMG flash alert 2025-168, EY tax alert, PwC "Top 20 changes",
 * TheCable rent-relief coverage. Planning estimate only; not tax advice.
 */

export const PAYE_BANDS_2026 = [
  { upTo: 800_000, rate: 0 },
  { upTo: 3_000_000, rate: 0.15 },
  { upTo: 12_000_000, rate: 0.18 },
  { upTo: 25_000_000, rate: 0.21 },
  { upTo: 50_000_000, rate: 0.23 },
  { upTo: Infinity, rate: 0.25 },
] as const;

export const RENT_RELIEF_RATE = 0.2;
export const RENT_RELIEF_CAP = 500_000;
export const PENSION_EMPLOYEE_RATE = 0.08;
export const NHF_RATE = 0.025;

export type PayeInput = {
  /** Annual gross pay (all cash emoluments). */
  grossAnnual: number;
  /** Annual basic + housing + transport (pensionable pay). Defaults to gross. */
  pensionableAnnual?: number;
  /** Annual basic salary (for NHF). Defaults to pensionable pay. */
  basicAnnual?: number;
  includePension?: boolean;
  includeNhf?: boolean;
  nhisAnnual?: number;
  lifeAssuranceAnnual?: number;
  annualRent?: number;
};

export type BandLine = { from: number; to: number; rate: number; taxable: number; tax: number };

export type PayeResult = {
  grossAnnual: number;
  pension: number;
  nhf: number;
  nhis: number;
  lifeAssurance: number;
  rentRelief: number;
  totalReliefs: number;
  taxableIncome: number;
  annualTax: number;
  monthlyTax: number;
  netAnnual: number;
  netMonthly: number;
  effectiveRate: number;
  bands: BandLine[];
};

const clean = (n: number | undefined) => (Number.isFinite(n) && (n as number) > 0 ? (n as number) : 0);

export function taxOnTaxableIncome(taxable: number): { tax: number; bands: BandLine[] } {
  let lower = 0;
  let tax = 0;
  const bands: BandLine[] = [];
  for (const band of PAYE_BANDS_2026) {
    const slice = Math.max(0, Math.min(taxable, band.upTo) - lower);
    const bandTax = slice * band.rate;
    bands.push({ from: lower, to: band.upTo, rate: band.rate, taxable: slice, tax: bandTax });
    tax += bandTax;
    if (taxable <= band.upTo) break;
    lower = band.upTo;
  }
  return { tax, bands };
}

export function computePaye(input: PayeInput): PayeResult {
  const gross = clean(input.grossAnnual);
  const pensionable = Math.min(gross, clean(input.pensionableAnnual) || gross);
  const basic = Math.min(pensionable, clean(input.basicAnnual) || pensionable);

  const pension = input.includePension === false ? 0 : pensionable * PENSION_EMPLOYEE_RATE;
  const nhf = input.includeNhf ? basic * NHF_RATE : 0;
  const nhis = clean(input.nhisAnnual);
  const lifeAssurance = clean(input.lifeAssuranceAnnual);
  const rentRelief = Math.min(clean(input.annualRent) * RENT_RELIEF_RATE, RENT_RELIEF_CAP);

  const totalReliefs = pension + nhf + nhis + lifeAssurance + rentRelief;
  const taxableIncome = Math.max(0, gross - totalReliefs);
  const { tax, bands } = taxOnTaxableIncome(taxableIncome);

  // Net pay is what lands in the account: gross less tax and the employee's own contributions.
  const netAnnual = gross - tax - pension - nhf - nhis;

  return {
    grossAnnual: gross,
    pension,
    nhf,
    nhis,
    lifeAssurance,
    rentRelief,
    totalReliefs,
    taxableIncome,
    annualTax: tax,
    monthlyTax: tax / 12,
    netAnnual,
    netMonthly: netAnnual / 12,
    effectiveRate: gross > 0 ? tax / gross : 0,
    bands,
  };
}

export function naira(n: number): string {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}
