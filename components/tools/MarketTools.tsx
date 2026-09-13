"use client";

import { useMemo, useState } from "react";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-xs text-gray-500">
      {label}
      <input
        {...rest}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#00C3F7]/50"
      />
    </label>
  );
}

const DISCLAIMER = (
  <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-[12px] leading-relaxed text-amber-100/90">
    <strong>Educational only — not financial advice.</strong> Markets involve risk of loss.
    Nothing here places real trades or guarantees profit.
  </p>
);

/* ——— 1. Position size & risk ——— */
export function PositionRiskTool() {
  const [account, setAccount] = useState("500000");
  const [riskPct, setRiskPct] = useState("1");
  const [entry, setEntry] = useState("100");
  const [stop, setStop] = useState("95");

  const result = useMemo(() => {
    const eq = Number(account) || 0;
    const rp = Number(riskPct) || 0;
    const e = Number(entry) || 0;
    const s = Number(stop) || 0;
    const riskAmount = eq * (rp / 100);
    const perUnit = Math.abs(e - s);
    if (perUnit <= 0 || eq <= 0) {
      return { riskAmount: 0, units: 0, notional: 0, invalid: true };
    }
    const units = riskAmount / perUnit;
    return {
      riskAmount,
      units,
      notional: units * e,
      invalid: false,
    };
  }, [account, riskPct, entry, stop]);

  return (
    <div className="space-y-4">
      {DISCLAIMER}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Account equity (₦)"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          inputMode="decimal"
        />
        <Field
          label="Risk per trade (%)"
          value={riskPct}
          onChange={(e) => setRiskPct(e.target.value)}
          inputMode="decimal"
        />
        <Field
          label="Entry price"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          inputMode="decimal"
        />
        <Field
          label="Stop-loss price"
          value={stop}
          onChange={(e) => setStop(e.target.value)}
          inputMode="decimal"
        />
      </div>
      <Card title="Suggested size (risk-based)">
        {result.invalid ? (
          <p className="text-sm text-gray-400">Enter valid entry and stop (must differ).</p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              Max loss if stopped:{" "}
              <strong className="text-white">
                ₦{result.riskAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>
            </li>
            <li>
              Position size (units):{" "}
              <strong className="text-white">{result.units.toFixed(4)}</strong>
            </li>
            <li>
              Approx. notional:{" "}
              <strong className="text-white">
                ₦{result.notional.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>
            </li>
          </ul>
        )}
        <p className="mt-3 text-[11px] text-gray-500">
          Rule of thumb: many educators suggest risking only 0.5–2% of equity per trade.
        </p>
      </Card>
    </div>
  );
}

/* ——— 2. Paper trading journal ——— */
type PaperTrade = {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  entry: number;
  exit: number;
  notes: string;
  at: string;
};

export function PaperJournalTool() {
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [qty, setQty] = useState("10");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [notes, setNotes] = useState("");
  const [trades, setTrades] = useState<PaperTrade[]>([]);

  function addTrade(e: React.FormEvent) {
    e.preventDefault();
    const t: PaperTrade = {
      id: String(Date.now()),
      symbol: symbol.toUpperCase() || "N/A",
      side,
      qty: Number(qty) || 0,
      entry: Number(entry) || 0,
      exit: Number(exit) || 0,
      notes,
      at: new Date().toISOString().slice(0, 10),
    };
    setTrades((prev) => [t, ...prev]);
    setNotes("");
  }

  const stats = useMemo(() => {
    let pnl = 0;
    let wins = 0;
    for (const t of trades) {
      const diff = (t.exit - t.entry) * t.qty * (t.side === "buy" ? 1 : -1);
      pnl += diff;
      if (diff > 0) wins++;
    }
    return {
      pnl,
      wins,
      count: trades.length,
      winRate: trades.length ? (wins / trades.length) * 100 : 0,
    };
  }, [trades]);

  return (
    <div className="space-y-4">
      {DISCLAIMER}
      <p className="text-sm text-gray-400">
        Log <strong className="text-gray-200">simulated</strong> trades only. Data stays in this
        browser session (refresh clears unless you export).
      </p>
      <form onSubmit={addTrade} className="grid gap-3 sm:grid-cols-2">
        <Field label="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. AAPL or DANGCEM" />
        <label className="block text-xs text-gray-500">
          Side
          <select
            value={side}
            onChange={(e) => setSide(e.target.value as "buy" | "sell")}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white"
          >
            <option value="buy">Buy (long)</option>
            <option value="sell">Sell (short)</option>
          </select>
        </label>
        <Field label="Qty" value={qty} onChange={(e) => setQty(e.target.value)} />
        <Field label="Entry" value={entry} onChange={(e) => setEntry(e.target.value)} />
        <Field label="Exit" value={exit} onChange={(e) => setExit(e.target.value)} />
        <Field label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button
          type="submit"
          className="sm:col-span-2 rounded-full bg-white py-3 text-sm font-semibold text-black"
        >
          Add paper trade
        </button>
      </form>
      <Card title="Session stats">
        <p className="text-sm text-gray-300">
          Trades: {stats.count} · Win rate: {stats.winRate.toFixed(0)}% · Paper P&L:{" "}
          <span className={stats.pnl >= 0 ? "text-emerald-400" : "text-red-400"}>
            {stats.pnl.toFixed(2)}
          </span>
        </p>
      </Card>
      <div className="space-y-2">
        {trades.map((t) => {
          const diff = (t.exit - t.entry) * t.qty * (t.side === "buy" ? 1 : -1);
          return (
            <div
              key={t.id}
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-gray-300"
            >
              <span className="font-semibold text-white">{t.symbol}</span> {t.side} {t.qty} @{" "}
              {t.entry} → {t.exit}{" "}
              <span className={diff >= 0 ? "text-emerald-400" : "text-red-400"}>
                ({diff >= 0 ? "+" : ""}
                {diff.toFixed(2)})
              </span>
              {t.notes && <p className="text-xs text-gray-500">{t.notes}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ——— 3. Educational signal explainer ——— */
export function SignalExplainerTool() {
  const [price, setPrice] = useState("100");
  const [maFast, setMaFast] = useState("102");
  const [maSlow, setMaSlow] = useState("98");

  const signal = useMemo(() => {
    const p = Number(price);
    const f = Number(maFast);
    const s = Number(maSlow);
    if ([p, f, s].some((x) => Number.isNaN(x))) return null;
    if (f > s && p > f) return { label: "Bullish stack (example)", color: "text-emerald-400", tip: "Fast MA above slow MA and price above fast — often taught as strength, not a guarantee." };
    if (f < s && p < f) return { label: "Bearish stack (example)", color: "text-red-400", tip: "Fast MA below slow MA and price below fast — often taught as weakness, not a guarantee." };
    return { label: "Mixed / no clear stack", color: "text-amber-300", tip: "Indicators disagree or price is between averages — many traders wait or reduce size." };
  }, [price, maFast, maSlow]);

  return (
    <div className="space-y-4">
      {DISCLAIMER}
      <p className="text-sm text-gray-400">
        Enter example moving-average values to see how a <em>textbook</em> reading is described.
        This does not fetch live market data or place orders.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Last price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Field label="Fast MA" value={maFast} onChange={(e) => setMaFast(e.target.value)} />
        <Field label="Slow MA" value={maSlow} onChange={(e) => setMaSlow(e.target.value)} />
      </div>
      {signal && (
        <Card title="Educational reading">
          <p className={`text-lg font-semibold ${signal.color}`}>{signal.label}</p>
          <p className="mt-2 text-sm text-gray-400">{signal.tip}</p>
        </Card>
      )}
    </div>
  );
}

/* ——— 4. Pre-trade checklist ——— */
const CHECKS = [
  "I know why I am entering (thesis in one sentence)",
  "I defined entry, stop-loss, and target before clicking",
  "Position size matches my max risk % (see Risk Calculator)",
  "I am not trading revenge after a loss",
  "News / events that could gap the price are considered",
  "This is money I can afford to lose",
  "I will journal the trade (paper or live)",
];

export function TradeChecklistTool() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const score = CHECKS.filter((_, i) => done[i]).length;

  return (
    <div className="space-y-4">
      {DISCLAIMER}
      <p className="text-sm text-gray-400">
        Tick every item before a real trade. Green when complete — still not a profit guarantee.
      </p>
      <ul className="space-y-2">
        {CHECKS.map((c, i) => (
          <li key={c}>
            <label className="flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-gray-200">
              <input
                type="checkbox"
                checked={!!done[i]}
                onChange={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                className="mt-0.5"
              />
              <span>{c}</span>
            </label>
          </li>
        ))}
      </ul>
      <p
        className={`text-sm font-semibold ${
          score === CHECKS.length ? "text-emerald-400" : "text-gray-400"
        }`}
      >
        {score}/{CHECKS.length} ready
        {score === CHECKS.length ? " — checklist complete" : ""}
      </p>
    </div>
  );
}
