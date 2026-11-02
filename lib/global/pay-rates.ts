/** Pay-rate maths: converting between pay periods, and pricing freelance work. Pure functions. */

export type PayUnit = "hour" | "day" | "week" | "month" | "year";
export const PAY_UNITS: { unit: PayUnit; label: string }[] = [
  { unit: "hour", label: "Hourly" },
  { unit: "day", label: "Daily" },
  { unit: "week", label: "Weekly" },
  { unit: "month", label: "Monthly" },
  { unit: "year", label: "Yearly" },
];

export type Schedule = { hoursPerWeek: number; daysPerWeek: number; weeksPerYear: number };

/** How many hours one of each unit stands for under a work schedule. */
export function hoursIn(unit: PayUnit, s: Schedule): number {
  const year = s.hoursPerWeek * s.weeksPerYear;
  switch (unit) {
    case "hour":
      return 1;
    case "day":
      return s.daysPerWeek > 0 ? s.hoursPerWeek / s.daysPerWeek : 0;
    case "week":
      return s.hoursPerWeek;
    case "month":
      return year / 12;
    case "year":
      return year;
  }
}

/** The same pay expressed in every unit. */
export function convertPay(amount: number, from: PayUnit, s: Schedule): Record<PayUnit, number> {
  const fromHours = hoursIn(from, s);
  const perHour = fromHours > 0 ? amount / fromHours : 0;
  return Object.fromEntries(PAY_UNITS.map(({ unit }) => [unit, perHour * hoursIn(unit, s)])) as Record<PayUnit, number>;
}

export type FreelanceInput = {
  /** What you want to keep after tax and costs, per year. */
  targetIncome: number;
  /** Business costs per year: software, equipment, internet, insurance, workspace. */
  expenses: number;
  /** Estimated share of profit lost to income tax and social contributions, 0–90. */
  taxPercent: number;
  /** Hours a week you can actually bill clients for. */
  billableHoursPerWeek: number;
  /** Holidays, sick days and quiet weeks you won't bill. */
  weeksOff: number;
  hoursPerDay: number;
};

export type FreelanceResult = {
  hourly: number;
  daily: number;
  revenueNeeded: number;
  billableHours: number;
  workingWeeks: number;
};

/** The rate that covers tax and costs and still leaves the target income. */
export function freelanceRate(i: FreelanceInput): FreelanceResult {
  const tax = Math.min(Math.max(i.taxPercent, 0), 90) / 100;
  const workingWeeks = Math.max(0, 52 - i.weeksOff);
  const billableHours = Math.max(0, i.billableHoursPerWeek) * workingWeeks;
  const revenueNeeded = Math.max(0, i.targetIncome) / (1 - tax) + Math.max(0, i.expenses);
  const hourly = billableHours > 0 ? revenueNeeded / billableHours : 0;
  return { hourly, daily: hourly * Math.max(0, i.hoursPerDay), revenueNeeded, billableHours, workingWeeks };
}
