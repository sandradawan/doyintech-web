/**
 * Pure calculations behind the "business bottleneck" tools: power, imports, cash flow,
 * staff cost, procurement and compliance. Kept free of React so they can be unit-checked.
 */

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

/* ---------------------------------------------------------------- Power: solar vs generator */

export type PowerInput = {
  loadWatts: number; // average running load
  hoursPerDay: number; // hours the generator runs today
  fuelPrice: number; // ₦ per litre
  litresPerHour: number;
  genMaintenanceMonthly: number; // servicing, oil, repairs
  genPrice: number; // replacement/new generator price
  sunHours: number; // peak sun hours per day
  autonomyHours: number; // hours of battery backup needed at night
  pricePerPanelWatt: number;
  pricePerBatteryKwh: number;
  pricePerInverterKva: number;
  installPct: number; // installation, cabling, protection as % of equipment
  solarQuote?: number; // if the user has a real quote, use it instead of the estimate
};

export type PowerResult = {
  dailyKwh: number;
  fuelMonthly: number;
  genMonthly: number;
  genYearly: number;
  panelWatts: number;
  batteryKwh: number;
  inverterKva: number;
  solarCost: number;
  solarMaintenanceYearly: number;
  paybackMonths: number | null;
  fiveYearGen: number;
  fiveYearSolar: number;
  fiveYearSaving: number;
  co2TonnesYearly: number;
};

const DAYS_PER_MONTH = 30.4;
const KG_CO2_PER_LITRE_PETROL = 2.31;

export function solarVsGenerator(i: PowerInput): PowerResult {
  const load = pos(i.loadWatts);
  const dailyKwh = (load * pos(i.hoursPerDay)) / 1000;
  const litresMonthly = pos(i.litresPerHour) * pos(i.hoursPerDay) * DAYS_PER_MONTH;
  const fuelMonthly = litresMonthly * pos(i.fuelPrice);
  const genMonthly = fuelMonthly + pos(i.genMaintenanceMonthly);
  const genYearly = genMonthly * 12;

  // Size panels to replace the generator's daily energy, allowing ~25% system losses.
  const panelWatts = Math.ceil(((dailyKwh * 1000) / (pos(i.sunHours) || 5) / 0.75) / 50) * 50;
  // Battery covers the night-time hours at 80% usable depth of discharge (lithium).
  const batteryKwh = Math.round(((load * pos(i.autonomyHours)) / 1000 / 0.8) * 10) / 10;
  // Inverter sized at 1.25× running load, in whole kVA (power factor 0.8).
  const inverterKva = Math.max(1, Math.ceil((load * 1.25) / 800));

  const equipment = panelWatts * pos(i.pricePerPanelWatt) + batteryKwh * pos(i.pricePerBatteryKwh) + inverterKva * pos(i.pricePerInverterKva);
  const estimate = equipment * (1 + pos(i.installPct) / 100);
  const solarCost = pos(i.solarQuote ?? 0) || estimate;
  const solarMaintenanceYearly = solarCost * 0.01; // panel cleaning, checks

  const monthlySaving = genMonthly - solarMaintenanceYearly / 12;
  const paybackMonths = monthlySaving > 0 ? Math.ceil(solarCost / monthlySaving) : null;

  // Over five years the generator is usually replaced once; solar needs no battery swap yet (lithium ~8–10 years).
  const fiveYearGen = genYearly * 5 + pos(i.genPrice);
  const fiveYearSolar = solarCost + solarMaintenanceYearly * 5;

  return {
    dailyKwh,
    fuelMonthly,
    genMonthly,
    genYearly,
    panelWatts,
    batteryKwh,
    inverterKva,
    solarCost,
    solarMaintenanceYearly,
    paybackMonths,
    fiveYearGen,
    fiveYearSolar,
    fiveYearSaving: fiveYearGen - fiveYearSolar,
    co2TonnesYearly: (litresMonthly * 12 * KG_CO2_PER_LITRE_PETROL) / 1000,
  };
}

/* ---------------------------------------------------------------- Imports: landed cost */

export type ImportInput = {
  fobUsd: number;
  freightUsd: number;
  insuranceUsd?: number; // blank → 1.5% of FOB, the usual customs assumption
  rate: number; // customs exchange rate ₦/$
  dutyPct: number; // ECOWAS CET band: 0, 5, 10, 20 or 35
  levyPct: number; // any extra import adjustment tax / levy on CIF
  surchargePct: number; // % of duty
  etlsPct: number; // % of CIF
  cissPct: number; // % of FOB
  vatPct: number;
  localCharges: number; // ₦ clearing agent, terminal, shipping line, haulage
  quantity: number;
  marginPct: number;
};

export type ImportResult = {
  fob: number;
  freight: number;
  insurance: number;
  cif: number;
  duty: number;
  levy: number;
  surcharge: number;
  etls: number;
  ciss: number;
  vat: number;
  totalTaxes: number;
  landed: number;
  perUnit: number;
  sellPerUnit: number;
  taxShare: number;
};

export function importLandedCost(i: ImportInput): ImportResult {
  const rate = pos(i.rate);
  const fob = pos(i.fobUsd) * rate;
  const freight = pos(i.freightUsd) * rate;
  const insurance = (i.insuranceUsd != null && Number.isFinite(i.insuranceUsd) && i.insuranceUsd > 0 ? i.insuranceUsd : pos(i.fobUsd) * 0.015) * rate;
  const cif = fob + freight + insurance;
  const duty = cif * (pos(i.dutyPct) / 100);
  const levy = cif * (pos(i.levyPct) / 100);
  const surcharge = duty * (pos(i.surchargePct) / 100);
  const etls = cif * (pos(i.etlsPct) / 100);
  const ciss = fob * (pos(i.cissPct) / 100);
  const vat = (cif + duty + levy + surcharge + etls + ciss) * (pos(i.vatPct) / 100);
  const totalTaxes = duty + levy + surcharge + etls + ciss + vat;
  const landed = cif + totalTaxes + pos(i.localCharges);
  const qty = Math.max(1, Math.floor(pos(i.quantity)) || 1);
  const perUnit = landed / qty;
  const m = Math.min(pos(i.marginPct), 95) / 100;
  return {
    fob,
    freight,
    insurance,
    cif,
    duty,
    levy,
    surcharge,
    etls,
    ciss,
    vat,
    totalTaxes,
    landed,
    perUnit,
    sellPerUnit: perUnit / (1 - m),
    taxShare: landed > 0 ? totalTaxes / landed : 0,
  };
}

/* ---------------------------------------------------------------- Cash flow: 13 weeks */

export type CashLine = {
  label: string;
  kind: "in" | "out";
  amount: number;
  freq: "weekly" | "monthly" | "once";
  week: number; // once: the week it lands; monthly: week of the month (1–4); weekly: first week
};

export type CashWeek = { week: number; opening: number; inflow: number; outflow: number; closing: number };

export const FORECAST_WEEKS = 13;

/** Week numbers (1-based) a line lands in across a 13-week forecast. Months start in weeks 1, 5 and 9. */
export function lineWeeks(l: CashLine): number[] {
  const w = Math.max(1, Math.floor(l.week) || 1);
  if (l.freq === "once") return w <= FORECAST_WEEKS ? [w] : [];
  if (l.freq === "weekly") return Array.from({ length: FORECAST_WEEKS }, (_, k) => k + 1).filter((k) => k >= w);
  const inMonth = Math.min(w, 4);
  return [0, 4, 8].map((s) => s + inMonth);
}

export function cashForecast(opening: number, lines: CashLine[]) {
  const weeks: CashWeek[] = [];
  let bal = Number.isFinite(opening) ? opening : 0;
  for (let w = 1; w <= FORECAST_WEEKS; w++) {
    let inflow = 0;
    let outflow = 0;
    for (const l of lines) {
      if (!lineWeeks(l).includes(w)) continue;
      if (l.kind === "in") inflow += pos(l.amount);
      else outflow += pos(l.amount);
    }
    const closing = bal + inflow - outflow;
    weeks.push({ week: w, opening: bal, inflow, outflow, closing });
    bal = closing;
  }
  const lowest = weeks.reduce((a, b) => (b.closing < a.closing ? b : a), weeks[0]);
  const firstNegative = weeks.find((w) => w.closing < 0) ?? null;
  const totalIn = weeks.reduce((s, w) => s + w.inflow, 0);
  const totalOut = weeks.reduce((s, w) => s + w.outflow, 0);
  return { weeks, lowest, firstNegative, totalIn, totalOut, closing: bal };
}

/* ---------------------------------------------------------------- Staff: true employer cost */

export type StaffCostInput = {
  basic: number; // monthly
  housing: number;
  transport: number;
  other: number;
  employerPensionPct: number; // statutory minimum 10% of basic + housing + transport
  nsitfPct: number; // 1% of monthly payroll (Employee's Compensation Act 2010)
  itfPct: number; // 1% of annual payroll if 5+ staff or turnover ≥ ₦50m
  itfApplies: boolean;
  hmoMonthly: number;
  groupLifeYearly: number;
  thirteenthMonth: boolean;
  leaveAllowancePct: number; // % of annual basic
  oneOffYearly: number; // recruitment, laptop, uniform, training in year one
  workingDays: number; // per year
};

export function employerCost(i: StaffCostInput) {
  const monthlyGross = pos(i.basic) + pos(i.housing) + pos(i.transport) + pos(i.other);
  const pensionable = pos(i.basic) + pos(i.housing) + pos(i.transport);
  const annualGross = monthlyGross * 12;
  const thirteenth = i.thirteenthMonth ? monthlyGross : 0;
  const leave = pos(i.basic) * 12 * (pos(i.leaveAllowancePct) / 100);
  const cashPay = annualGross + thirteenth + leave;
  const pension = pensionable * 12 * (pos(i.employerPensionPct) / 100);
  const nsitf = cashPay * (pos(i.nsitfPct) / 100);
  const itf = i.itfApplies ? cashPay * (pos(i.itfPct) / 100) : 0;
  const hmo = pos(i.hmoMonthly) * 12;
  const groupLife = pos(i.groupLifeYearly);
  const statutory = pension + nsitf + itf + groupLife;
  const total = cashPay + statutory + hmo + pos(i.oneOffYearly);
  const days = pos(i.workingDays) || 260;
  return {
    monthlyGross,
    annualGross,
    thirteenth,
    leave,
    cashPay,
    pension,
    nsitf,
    itf,
    hmo,
    groupLife,
    statutory,
    oneOff: pos(i.oneOffYearly),
    total,
    monthly: total / 12,
    perDay: total / days,
    perHour: total / days / 8,
    multiplier: annualGross > 0 ? total / annualGross : 0,
  };
}

/* ---------------------------------------------------------------- Procurement: bid evaluation */

export type Criterion = { name: string; max: number };
export type Bidder = { name: string; price: number; scores: number[] };
export type BidMethod = "qcbs" | "lowest";

export type BidRow = {
  name: string;
  price: number;
  technical: number; // %
  passed: boolean;
  financial: number | null; // %
  combined: number | null;
  rank: number | null;
};

/**
 * QCBS: technical % against the pass mark; only passing bids are scored on price
 * (lowest passing price = 100) and combined by the weights.
 * Lowest: passing bids are ranked by price alone (lowest evaluated responsive bid).
 */
export function evaluateBids(criteria: Criterion[], bidders: Bidder[], method: BidMethod, techWeight: number, passMark: number): BidRow[] {
  const maxTotal = criteria.reduce((s, c) => s + pos(c.max), 0);
  const tw = Math.min(100, pos(techWeight)) / 100;
  const rows: BidRow[] = bidders.map((b) => {
    const got = criteria.reduce((s, c, k) => s + Math.min(pos(b.scores[k] ?? 0), pos(c.max)), 0);
    const technical = maxTotal > 0 ? (got / maxTotal) * 100 : 0;
    return { name: b.name, price: pos(b.price), technical, passed: technical >= pos(passMark) && pos(b.price) > 0, financial: null, combined: null, rank: null };
  });
  const passing = rows.filter((r) => r.passed);
  const lowest = passing.length ? Math.min(...passing.map((r) => r.price)) : 0;
  for (const r of passing) {
    r.financial = (lowest / r.price) * 100;
    r.combined = method === "qcbs" ? r.technical * tw + r.financial * (1 - tw) : r.financial;
  }
  const ordered = [...passing].sort((a, b) => (b.combined ?? 0) - (a.combined ?? 0) || a.price - b.price);
  ordered.forEach((r, k) => (r.rank = k + 1));
  return rows;
}

/* ---------------------------------------------------------------- Compliance calendar */

export type EntityKind = "company" | "business-name" | "ngo" | "individual";

export type ComplianceInput = {
  kind: EntityKind;
  hasStaff: boolean;
  staffCount: number;
  vatRegistered: boolean;
  deductsWht: boolean;
  yearEndMonth: number; // 1–12, company accounting year end
  registeredOn: string; // YYYY-MM-DD, CAC registration date
};

export type Deadline = { date: string; title: string; agency: string; note: string };

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Nth working day (Mon–Fri) of a month. Public holidays are not known here, so the note tells people to check. */
function nthWorkingDay(y: number, m: number, n: number) {
  const d = new Date(y, m, 1);
  let count = 0;
  for (;;) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) count++;
    if (count === n) return new Date(d);
    d.setDate(d.getDate() + 1);
  }
}

/** Deadlines in the 12 months from `from`, sorted by date. */
export function complianceCalendar(i: ComplianceInput, from: Date): Deadline[] {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
  const out: Deadline[] = [];
  const add = (d: Date, title: string, agency: string, note: string) => {
    if (d >= start && d < end) out.push({ date: iso(d), title, agency, note });
  };
  const monthName = (m: number) => new Date(2000, m, 1).toLocaleString("en-GB", { month: "long" });

  for (let k = 0; k <= 12; k++) {
    const y = start.getFullYear();
    const m = start.getMonth() + k;
    const prev = monthName((((m - 1) % 12) + 12) % 12);
    if (i.hasStaff) {
      add(new Date(y, m, 10), `PAYE remittance for ${prev}`, "State Internal Revenue Service", "Tax deducted from staff salaries last month.");
      add(nthWorkingDay(y, m, 7), `Pension contributions for ${prev}`, "Your staff's PFAs (PenCom)", "Employee 8% + employer 10%, within 7 working days of paying salaries (assumes month-end payday).");
    }
    if (i.vatRegistered) add(new Date(y, m, 21), `VAT return for ${prev}`, "Nigeria Revenue Service (NRS)", "File and pay output VAT less input VAT, even if nil.");
    if (i.deductsWht) add(new Date(y, m, 21), `Withholding tax remittance for ${prev}`, "NRS / State IRS", "WHT deducted from supplier payments last month; issue credit notes to suppliers.");
  }

  for (const y of [start.getFullYear(), start.getFullYear() + 1]) {
    if (i.hasStaff) add(new Date(y, 0, 31), `Employer annual PAYE return (Form H1) for ${y - 1}`, "State Internal Revenue Service", "Schedule of every employee's pay and tax for the previous year.");
    if (i.hasStaff && i.staffCount >= 5) add(new Date(y, 3, 1), `ITF 1% training contribution for ${y - 1}`, "Industrial Training Fund", "1% of annual payroll, for employers with 5+ staff or ₦50m+ turnover.");
    if (i.kind === "individual" || i.kind === "business-name") add(new Date(y, 2, 31), `Personal income tax self-assessment for ${y - 1}`, "State Internal Revenue Service", "Sole proprietors and freelancers declare last year's income.");
    if (i.registeredOn) {
      const r = new Date(i.registeredOn + "T12:00:00");
      if (!Number.isNaN(r.getTime())) {
        const anniv = new Date(y, r.getMonth(), r.getDate());
        if (i.kind === "company") {
          const due = new Date(anniv);
          due.setDate(due.getDate() + 42);
          add(due, "CAC annual return", "Corporate Affairs Commission", "Due within 42 days after the anniversary of incorporation (CAMA 2020).");
        } else if (i.kind === "business-name" || i.kind === "ngo") {
          add(anniv, "CAC annual return reminder", "Corporate Affairs Commission", "File this year's annual return on the CAC portal; check the due date shown for your registration.");
        }
      }
    }
  }
  if (i.kind === "company") {
    const ye = Math.min(Math.max(Math.floor(i.yearEndMonth) || 12, 1), 12);
    // Due six months after each accounting year end (last day of that month).
    for (const yy of [start.getFullYear() - 1, start.getFullYear(), start.getFullYear() + 1]) {
      add(new Date(yy, ye + 6, 0), `Company income tax return (year ended ${monthName(ye - 1)} ${yy})`, "Nigeria Revenue Service (NRS)", "Self-assessment with audited accounts, within 6 months of the year end. Small companies still file (at 0%).");
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}

/** iCalendar file with one all-day event per deadline, so it imports into Google/Outlook/Apple calendars. */
export function deadlinesToIcs(items: Deadline[], orgName: string) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const escIcs = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const ev = items.map((d, k) => {
    const day = d.date.replace(/-/g, "");
    const next = new Date(d.date + "T12:00:00");
    next.setDate(next.getDate() + 1);
    return [
      "BEGIN:VEVENT",
      `UID:${day}-${k}@doyintech.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${day}`,
      `DTEND;VALUE=DATE:${iso(next).replace(/-/g, "")}`,
      `SUMMARY:${escIcs(d.title)}`,
      `DESCRIPTION:${escIcs(`${d.agency}. ${d.note}`)}`,
      "BEGIN:VALARM",
      "TRIGGER:-P3D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escIcs(d.title)}`,
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DoyinTech//Compliance Calendar//EN", `X-WR-CALNAME:${escIcs(orgName || "Compliance deadlines")}`, ...ev, "END:VCALENDAR"].join("\r\n");
}
