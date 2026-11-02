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

/** Canada 2026, Ontario resident: CPP/CPP2, EI, federal and Ontario tax (CRA T4127, January 2026). */
export function canadaOntario(g: number): SalaryResult {
  const ympe = 74600;
  const cpp = pos(Math.min(g, ympe) - 3500) * 0.0595;
  const cppBase = (cpp * 4.95) / 5.95; // the base part is a tax credit; the enhanced part is a deduction
  const cpp2 = pos(Math.min(g, 85000) - ympe) * 0.04;
  const ei = Math.min(g, 68900) * 0.0163;
  const taxable = pos(g - (cpp - cppBase) - cpp2);

  const bpaf = taxable <= 181440 ? 16452 : taxable >= 258482 ? 14829 : 16452 - ((taxable - 181440) * 1623) / 77042;
  const fedCredits = 0.14 * (bpaf + Math.min(g, 1501) + cppBase + ei);
  const federal = pos(bandTax(taxable, [[58523, 0.14], [117045, 0.205], [181440, 0.26], [258482, 0.29], [Infinity, 0.33]]) - fedCredits);

  const onBasic = pos(bandTax(taxable, [[53891, 0.0505], [107785, 0.0915], [150000, 0.1116], [220000, 0.1216], [Infinity, 0.1316]]) - 0.0505 * (12989 + cppBase + ei));
  const surtax = pos(onBasic - 5818) * 0.2 + pos(onBasic - 7446) * 0.36;
  const withSurtax = onBasic + surtax;
  const reduction = Math.min(withSurtax, pos(2 * 300 - withSurtax));
  const healthPremium =
    taxable <= 20000 ? 0
    : taxable <= 36000 ? Math.min(300, (taxable - 20000) * 0.06)
    : taxable <= 48000 ? Math.min(450, 300 + (taxable - 36000) * 0.06)
    : taxable <= 72000 ? Math.min(600, 450 + (taxable - 48000) * 0.25)
    : taxable <= 200000 ? Math.min(750, 600 + (taxable - 72000) * 0.25)
    : Math.min(900, 750 + (taxable - 200000) * 0.25);

  return result(g, [
    { label: "Federal income tax", amount: federal },
    { label: "Ontario income tax", amount: withSurtax - reduction + healthPremium },
    { label: "CPP and CPP2", amount: cpp + cpp2 },
    { label: "EI (1.63%)", amount: ei },
  ]);
}

/** South Africa 2026/27 (1 March 2026 – 28 February 2027), under 65: PAYE after the primary rebate, plus UIF. */
function southAfrica(g: number): SalaryResult {
  const tax = pos(
    bandTax(g, [[245100, 0.18], [383100, 0.26], [530200, 0.31], [695800, 0.36], [887000, 0.39], [1878600, 0.41], [Infinity, 0.45]]) - 17820,
  );
  const uif = Math.min(g / 12, 17712) * 0.01 * 12;
  return result(g, [
    { label: "Income tax (PAYE)", amount: tax },
    { label: "UIF (1%)", amount: uif },
  ]);
}

/** Ireland 2026, single PAYE employee: income tax after credits, USC, and Class A PRSI at 4.35% (from 1 October 2026). */
function ireland(g: number): SalaryResult {
  const tax = pos(bandTax(g, [[44000, 0.2], [Infinity, 0.4]]) - 4000);
  const usc = g <= 13000 ? 0 : bandTax(g, [[12012, 0.005], [28700, 0.02], [70044, 0.03], [Infinity, 0.08]]);
  const weekly = g / 52;
  const prsiWeek = weekly <= 352 ? 0 : pos(weekly * 0.0435 - (weekly <= 424 ? 12 - (weekly - 352) / 6 : 0));
  return result(g, [
    { label: "Income tax (after €4,000 credits)", amount: tax },
    { label: "USC", amount: usc },
    { label: "PRSI (4.35%)", amount: prsiWeek * 52 },
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
  {
    slug: "canada",
    country: "Canada (Ontario)",
    short: "Canada",
    currency: "CAD",
    locale: "en-CA",
    taxYear: "2026",
    authority: "the CRA",
    example: 70000,
    covers: "federal income tax at the 2026 rates (14% lowest rate), Ontario income tax with surtax, the low-income reduction and Ontario Health Premium, CPP and CPP2, and EI",
    excludes: "other provinces and Quebec, RRSP and union dues, and benefits or credits you claim on your return",
    calc: canadaOntario,
  },
  {
    slug: "south-africa",
    country: "South Africa",
    short: "South Africa",
    currency: "ZAR",
    locale: "en-ZA",
    taxYear: "2026/27",
    authority: "SARS",
    example: 400000,
    covers: "income tax at the 2026/27 SARS rates less the R17,820 primary rebate (under 65) and UIF at 1% up to R177.12 a month",
    excludes: "the age rebates for 65 and over, retirement fund contributions and the medical tax credit",
    calc: southAfrica,
  },
  {
    slug: "ireland",
    country: "Ireland",
    short: "Ireland",
    currency: "EUR",
    locale: "en-IE",
    taxYear: "2026",
    authority: "Revenue",
    example: 50000,
    covers: "income tax for a single person (20% up to €44,000, 40% above, less the €2,000 personal and €2,000 employee credits), USC, and Class A PRSI at 4.35% with the low-pay PRSI credit",
    excludes: "married or one-parent bands and credits, pension contributions and other tax credits",
    calc: ireland,
  },
];

export const SALARY_EXISTING_PAGES: Record<string, string> = { nigeria: "/tools/paye-calculator-nigeria" };

export function getSalaryCountry(slug: string) {
  return SALARY_COUNTRIES.find((c) => c.slug === slug);
}
