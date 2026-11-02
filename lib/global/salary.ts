/**
 * Take-home pay engines by country. Each one turns a gross annual salary into the
 * employee's deductions and net pay for one stated tax year. Pure functions: no I/O.
 */

export type SalaryLine = { label: string; amount: number };
export type SalaryResult = { gross: number; lines: SalaryLine[]; net: number };
export type SalaryOptions = { married?: boolean };

export type SalaryCountry = {
  slug: string;
  country: string;
  short: string;
  currency: string;
  locale: string;
  taxYear: string;
  authority: string;
  /** Typical salary for the worked example and the default input. */
  example: number;
  hasFilingStatus?: boolean;
  covers: string;
  excludes: string;
  calc: (grossAnnual: number, opts?: SalaryOptions) => SalaryResult;
};

type Band = [upTo: number, rate: number];

/** Tax on `income` across progressive bands; each band is [upper limit, rate]. */
export function bandTax(income: number, bands: Band[]): number {
  let tax = 0;
  let lower = 0;
  for (const [upTo, rate] of bands) {
    if (income <= lower) break;
    tax += (Math.min(income, upTo) - lower) * rate;
    lower = upTo;
  }
  return tax;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const pos = (n: number) => Math.max(0, n);

function result(gross: number, lines: SalaryLine[]): SalaryResult {
  const clean = lines.map((l) => ({ label: l.label, amount: r2(pos(l.amount)) }));
  return { gross: r2(gross), lines: clean, net: r2(gross - clean.reduce((s, l) => s + l.amount, 0)) };
}

/** UK 2026/27, England, Wales and Northern Ireland: income tax and employee Class 1 NI. */
function uk(g: number): SalaryResult {
  const allowance = pos(12570 - pos(g - 100000) / 2);
  const taxable = pos(g - allowance);
  const tax = bandTax(taxable, [[37700, 0.2], [125140, 0.4], [Infinity, 0.45]]);
  const ni = pos(Math.min(g, 50270) - 12570) * 0.08 + pos(g - 50270) * 0.02;
  return result(g, [
    { label: "Income tax", amount: tax },
    { label: "National Insurance", amount: ni },
  ]);
}

/** US 2026 federal income tax with the standard deduction, plus Social Security and Medicare. */
function us(g: number, opts?: SalaryOptions): SalaryResult {
  const married = !!opts?.married;
  const deduction = married ? 32200 : 16100;
  const bands: Band[] = married
    ? [[24800, 0.1], [100800, 0.12], [211400, 0.22], [403550, 0.24], [512450, 0.32], [768700, 0.35], [Infinity, 0.37]]
    : [[12400, 0.1], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [640600, 0.35], [Infinity, 0.37]];
  const tax = bandTax(pos(g - deduction), bands);
  const socialSecurity = Math.min(g, 184500) * 0.062;
  const medicare = g * 0.0145 + pos(g - (married ? 250000 : 200000)) * 0.009;
  return result(g, [
    { label: "Federal income tax", amount: tax },
    { label: "Social Security (6.2%)", amount: socialSecurity },
    { label: "Medicare", amount: medicare },
  ]);
}

/** India FY 2026-27, new tax regime (default): standard deduction, 87A rebate, surcharge and cess. */
export function indiaTax(g: number): number {
  const taxable = pos(g - 75000);
  let tax = bandTax(taxable, [
    [400000, 0], [800000, 0.05], [1200000, 0.1], [1600000, 0.15], [2000000, 0.2], [2400000, 0.25], [Infinity, 0.3],
  ]);
  // Section 87A: no tax up to ₹12 lakh taxable; just above it, tax is capped at the income over ₹12 lakh.
  if (taxable <= 1200000) tax = 0;
  else tax = Math.min(tax, taxable - 1200000);
  const surchargeRate = taxable > 20000000 ? 0.25 : taxable > 10000000 ? 0.15 : taxable > 5000000 ? 0.1 : 0;
  const withSurcharge = tax * (1 + surchargeRate);
  return withSurcharge * 1.04;
}

function india(g: number): SalaryResult {
  return result(g, [{ label: "Income tax (incl. surcharge & 4% cess)", amount: indiaTax(g) }]);
}

/** Australia 2026-27 resident rates (15% bottom rate from 1 July 2026), LITO and the Medicare levy. */
function australia(g: number): SalaryResult {
  let tax = bandTax(g, [[18200, 0], [45000, 0.15], [135000, 0.3], [190000, 0.37], [Infinity, 0.45]]);
  const lito = g <= 37500 ? 700 : g <= 45000 ? 700 - (g - 37500) * 0.05 : g <= 66667 ? 325 - (g - 45000) * 0.015 : 0;
  tax = pos(tax - lito);
  const low = 27222;
  const medicare = g <= low ? 0 : g <= low * 1.25 ? (g - low) * 0.1 : g * 0.02;
  return result(g, [
    { label: "Income tax (after low income offset)", amount: tax },
    { label: "Medicare levy (2%)", amount: medicare },
  ]);
}

/** Kenya from February 2026: NSSF, SHIF and Housing Levy come off before PAYE; personal relief KSh 2,400/month. */
function kenya(g: number): SalaryResult {
  const m = g / 12;
  const nssf = Math.min(m, 108000) * 0.06;
  const shif = m > 0 ? Math.max(300, m * 0.0275) : 0;
  const housing = m * 0.015;
  const taxable = pos(m - nssf - shif - housing);
  const paye = pos(bandTax(taxable, [[24000, 0.1], [32333, 0.25], [500000, 0.3], [800000, 0.325], [Infinity, 0.35]]) - 2400);
  return result(g, [
    { label: "PAYE", amount: paye * 12 },
    { label: "NSSF", amount: nssf * 12 },
    { label: "SHIF (2.75%)", amount: shif * 12 },
    { label: "Housing levy (1.5%)", amount: housing * 12 },
  ]);
}

export const SALARY_COUNTRIES: SalaryCountry[] = [
  {
    slug: "united-kingdom",
    country: "United Kingdom",
    short: "UK",
    currency: "GBP",
    locale: "en-GB",
    taxYear: "2026/27",
    authority: "HMRC",
    example: 35000,
    covers: "income tax at the England, Wales and Northern Ireland rates (personal allowance tapered above £100,000) and employee Class 1 National Insurance",
    excludes: "Scottish income tax rates, student loan repayments, pension contributions and salary sacrifice",
    calc: uk,
  },
  {
    slug: "united-states",
    country: "United States",
    short: "US",
    currency: "USD",
    locale: "en-US",
    taxYear: "2026",
    authority: "the IRS",
    example: 65000,
    hasFilingStatus: true,
    covers: "federal income tax using the 2026 brackets and standard deduction, Social Security (up to the $184,500 wage base) and Medicare, including the 0.9% additional Medicare tax",
    excludes: "state and city income tax, 401(k) and health insurance deductions, and itemised deductions or credits",
    calc: us,
  },
  {
    slug: "india",
    country: "India",
    short: "India",
    currency: "INR",
    locale: "en-IN",
    taxYear: "FY 2026-27",
    authority: "the Income Tax Department",
    example: 1500000,
    covers: "income tax under the new regime with the ₹75,000 standard deduction, the Section 87A rebate (no tax up to ₹12 lakh taxable income), surcharge and 4% health and education cess",
    excludes: "the old regime, employee provident fund (EPF), professional tax and HRA or other exemptions",
    calc: india,
  },
  {
    slug: "australia",
    country: "Australia",
    short: "Australia",
    currency: "AUD",
    locale: "en-AU",
    taxYear: "2026-27",
    authority: "the ATO",
    example: 90000,
    covers: "resident income tax with the 15% bottom rate that starts on 1 July 2026, the low income tax offset and the 2% Medicare levy with its low-income reduction",
    excludes: "HELP/HECS repayments, the Medicare levy surcharge and salary sacrifice; employer super is paid on top of salary",
    calc: australia,
  },
  {
    slug: "kenya",
    country: "Kenya",
    short: "Kenya",
    currency: "KES",
    locale: "en-KE",
    taxYear: "2026",
    authority: "KRA",
    example: 1200000,
    covers: "PAYE after personal relief, NSSF at 6% (pensionable pay up to KSh 108,000 a month), SHIF at 2.75% and the 1.5% Affordable Housing Levy, all deducted before PAYE",
    excludes: "insurance relief, mortgage interest and pension contributions above NSSF",
    calc: kenya,
  },
];

export const SALARY_EXISTING_PAGES: Record<string, string> = { nigeria: "/tools/paye-calculator-nigeria" };

export function getSalaryCountry(slug: string) {
  return SALARY_COUNTRIES.find((c) => c.slug === slug);
}
