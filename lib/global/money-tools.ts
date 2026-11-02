/** Discount and late-payment interest maths. Pure functions, any currency. */

/** Applies discounts one after another (20% then 10% is 28% off, not 30%). */
export function applyDiscounts(price: number, percents: number[]) {
  const sale = percents.reduce((p, d) => p * (1 - Math.min(Math.max(d, 0), 100) / 100), Math.max(price, 0));
  const saved = Math.max(price, 0) - sale;
  return { sale, saved, effectivePercent: price > 0 ? (saved / price) * 100 : 0 };
}

/** The price before a discount, from the price after it. */
export function originalPrice(sale: number, percent: number) {
  const keep = 1 - Math.min(Math.max(percent, 0), 100) / 100;
  return keep > 0 ? sale / keep : 0;
}

/** Whole days from due date to payment date; 0 when paid on time. Dates are yyyy-mm-dd. */
export function daysLate(due: string, paid: string) {
  const a = Date.parse(due + "T00:00:00Z");
  const b = Date.parse(paid + "T00:00:00Z");
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86400000));
}

/** Simple daily interest, as UK statutory interest and most contracts work it. */
export function lateInterest(amount: number, annualRatePercent: number, days: number) {
  const daily = (Math.max(amount, 0) * Math.max(annualRatePercent, 0)) / 100 / 365;
  return { daily, interest: daily * days };
}

/** UK fixed compensation per late invoice (Late Payment of Commercial Debts Regulations). */
export function ukCompensation(amount: number) {
  if (amount <= 0) return 0;
  return amount < 1000 ? 40 : amount < 10000 ? 70 : 100;
}
