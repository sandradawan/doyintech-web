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

/** Profit, margin (share of price) and markup (share of cost) from cost and selling price. */
export function marginFromPrices(cost: number, price: number) {
  const profit = price - cost;
  return { profit, margin: price > 0 ? (profit / price) * 100 : 0, markup: cost > 0 ? (profit / cost) * 100 : 0 };
}

/** Selling price that gives a target margin; 0 when the margin is 100% or more. */
export function priceForMargin(cost: number, marginPercent: number) {
  return marginPercent < 100 ? cost / (1 - marginPercent / 100) : 0;
}

/** Selling price from a markup on cost. */
export function priceForMarkup(cost: number, markupPercent: number) {
  return cost * (1 + markupPercent / 100);
}

/** Units and revenue needed to cover fixed costs (plus an optional profit target). */
export function breakEven(fixed: number, price: number, variable: number, targetProfit = 0) {
  const contribution = price - variable;
  if (contribution <= 0) return null;
  const units = Math.ceil((Math.max(fixed, 0) + Math.max(targetProfit, 0)) / contribution);
  return { contribution, contributionRatio: price > 0 ? (contribution / price) * 100 : 0, units, revenue: units * price };
}

/** Fixed monthly repayment on an amortising loan, with the yearly breakdown. */
export function loanSchedule(principal: number, annualRatePercent: number, months: number) {
  const p = Math.max(principal, 0);
  const n = Math.max(1, Math.round(months));
  const r = Math.max(annualRatePercent, 0) / 100 / 12;
  const payment = r === 0 ? p / n : (p * r) / (1 - Math.pow(1 + r, -n));
  const years: { year: number; principal: number; interest: number; balance: number }[] = [];
  let balance = p;
  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    const paid = Math.min(payment - interest, balance);
    balance -= paid;
    if (m % 12 === 1) years.push({ year: years.length + 1, principal: 0, interest: 0, balance: 0 });
    const y = years[years.length - 1];
    y.principal += paid;
    y.interest += interest;
    y.balance = Math.max(balance, 0);
  }
  return { payment, total: payment * n, interest: payment * n - p, years };
}
