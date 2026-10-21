"use client";

import { useEffect, useMemo, useState } from "react";

const box = "rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8 space-y-4";
const input =
  "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50";
const labelCls = "block text-xs text-gray-500 mb-1";
const btn =
  "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50";
const btnGhost =
  "rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:border-primary/50";

function Field({
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input {...rest} className={input} />
    </label>
  );
}

function useLocalJson<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved value after hydration (localStorage is client-only)
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}

export function PomodoroTimerTool() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [running, setRunning] = useState(false);
  const [streak, setStreak] = useLocalJson("dt_pomodoro_streak", {
    count: 0,
    lastDate: "",
  });

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setRunning(false);
          if (mode === "work") {
            const today = new Date().toISOString().slice(0, 10);
            setStreak((prev) => {
              if (prev.lastDate === today) return prev;
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              const y = yesterday.toISOString().slice(0, 10);
              const next = prev.lastDate === y ? prev.count + 1 : 1;
              return { count: next, lastDate: today };
            });
            setMode("break");
            return breakMin * 60;
          }
          setMode("work");
          return workMin * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, mode, workMin, breakMin, setStreak]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  function reset() {
    setRunning(false);
    setMode("work");
    setSecondsLeft(workMin * 60);
  }

  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Focus timer with a daily streak saved on this device. Come back tomorrow to keep it going.
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-primary">
          Streak: {streak.count} day{streak.count === 1 ? "" : "s"}
        </span>
        <span className="rounded-full border border-white/15 px-3 py-1 text-gray-300">
          {mode === "work" ? "Focus session" : "Break"}
        </span>
      </div>
      <p className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl">
        {mm}:{ss}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Work minutes"
          type="number"
          min={1}
          max={90}
          value={workMin}
          onChange={(e) => {
            const v = Math.max(1, Number(e.target.value) || 25);
            setWorkMin(v);
            if (!running && mode === "work") setSecondsLeft(v * 60);
          }}
        />
        <Field
          label="Break minutes"
          type="number"
          min={1}
          max={30}
          value={breakMin}
          onChange={(e) => setBreakMin(Math.max(1, Number(e.target.value) || 5))}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btn} onClick={() => setRunning((r) => !r)}>
          {running ? "Pause" : "Start"}
        </button>
        <button type="button" className={btnGhost} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export function DailyChecklistTool() {
  const today = new Date().toISOString().slice(0, 10);
  const [items, setItems] = useLocalJson<
    { id: string; text: string; done: boolean; date: string }[]
  >("dt_daily_checklist", []);
  const [text, setText] = useState("");

  const todayItems = useMemo(() => items.filter((i) => i.date === today), [items, today]);

  function add() {
    const t = text.trim();
    if (!t) return;
    setItems((prev) => [...prev, { id: String(Date.now()), text: t, done: false, date: today }]);
    setText("");
  }

  function toggle(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const done = todayItems.filter((i) => i.done).length;

  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Your checklist for {today}. Saved in this browser — open the site anytime to continue.
      </p>
      <p className="text-sm text-emerald-300">
        {done}/{todayItems.length} done today
      </p>
      <div className="flex gap-2">
        <input
          className={input}
          placeholder="Add a task…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button type="button" className={btn} onClick={add}>
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todayItems.map((i) => (
          <li
            key={i.id}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2"
          >
            <input type="checkbox" checked={i.done} onChange={() => toggle(i.id)} className="h-4 w-4" />
            <span className={"flex-1 text-sm " + (i.done ? "text-gray-500 line-through" : "text-white")}>
              {i.text}
            </span>
            <button type="button" className="text-xs text-red-300" onClick={() => remove(i.id)}>
              Remove
            </button>
          </li>
        ))}
        {todayItems.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks yet. Add one above.</p>
        ) : null}
      </ul>
    </div>
  );
}

export function BusinessNameGeneratorTool() {
  const [keyword, setKeyword] = useState("pay");
  const [industry, setIndustry] = useState("tech");
  const [names, setNames] = useState<string[]>([]);

  const prefixes = ["Nova", "Swift", "Prime", "Apex", "Nexa", "Bold", "True", "Bright", "Core", "Flux"];
  const suffixes = ["Labs", "Hub", "Works", "Studio", "NG", "Digital", "Systems", "Co", "HQ", "Pro"];

  function generate() {
    const k = keyword.trim() || "biz";
    const base = k.charAt(0).toUpperCase() + k.slice(1).toLowerCase();
    const out: string[] = [];
    for (let i = 0; i < 12; i++) {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const s = suffixes[Math.floor(Math.random() * suffixes.length)];
      const patterns = [
        p + base,
        base + s,
        p + base + s,
        base + " " + industry.charAt(0).toUpperCase() + industry.slice(1),
        k.toLowerCase() + s.toLowerCase(),
      ];
      out.push(patterns[i % patterns.length]);
    }
    setNames(Array.from(new Set(out)));
  }

  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Generate brandable name ideas from a keyword. Refresh for new sets anytime.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <Field label="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
      </div>
      <button type="button" className={btn} onClick={generate}>
        Generate names
      </button>
      <ul className="grid gap-2 sm:grid-cols-2">
        {names.map((n) => (
          <li key={n} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NotePadTool() {
  const [notes, setNotes] = useLocalJson("dt_notepad", "");
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Quick notes saved only in this browser. Handy for client calls and ideas — comes back when you return.
      </p>
      <textarea
        className={input + " min-h-[220px]"}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type notes here…"
      />
      <p className="text-xs text-gray-500">{notes.length} characters · auto-saved</p>
    </div>
  );
}

export function CountdownTimerTool() {
  const [target, setTarget] = useLocalJson("dt_countdown_target", "");
  const [label, setLabel] = useLocalJson("dt_countdown_label", "Launch day");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = useMemo(() => {
    if (!target) return null;
    const t = new Date(target).getTime();
    if (Number.isNaN(t)) return null;
    const diff = Math.max(0, t - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, done: diff === 0 };
  }, [target, now]);

  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Set a deadline (product launch, payment, exam). Saved here so you can check progress anytime.
      </p>
      <Field label="Event name" value={label} onChange={(e) => setLabel(e.target.value)} />
      <Field
        label="Date and time"
        type="datetime-local"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />
      {remaining ? (
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            ["Days", remaining.d],
            ["Hours", remaining.h],
            ["Min", remaining.m],
            ["Sec", remaining.s],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded-xl border border-white/10 bg-black/30 p-3">
              <p className="font-display text-2xl font-bold text-white">{v}</p>
              <p className="text-xs text-gray-500">{k}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Pick a date to start the countdown.</p>
      )}
      {remaining?.done ? <p className="text-sm text-emerald-300">{label} is here!</p> : null}
    </div>
  );
}

export function MeetingCostCalculatorTool() {
  const [people, setPeople] = useState("4");
  const [rate, setRate] = useState("5000");
  const [mins, setMins] = useState("30");
  const p = Math.max(0, Number(people) || 0);
  const r = Math.max(0, Number(rate) || 0);
  const m = Math.max(0, Number(mins) || 0);
  const cost = (p * r * m) / 60;
  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        See the real Naira cost of a meeting from headcount, hourly rate, and duration.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="People" value={people} onChange={(e) => setPeople(e.target.value)} inputMode="numeric" />
        <Field label="Avg hourly rate (NGN)" value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" />
        <Field label="Minutes" value={mins} onChange={(e) => setMins(e.target.value)} inputMode="numeric" />
      </div>
      <div className="rounded-xl border border-white/10 bg-black/30 p-4">
        <p className="text-xs text-gray-500">Estimated cost</p>
        <p className="mt-1 font-display text-3xl font-bold text-emerald-300">
          NGN {cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
}

export function SavingsGoalTrackerTool() {
  const [goal, setGoal] = useLocalJson("dt_savings_goal", "500000");
  const [saved, setSaved] = useLocalJson("dt_savings_saved", "0");
  const [add, setAdd] = useState("");
  const g = Math.max(0, Number(goal) || 0);
  const s = Math.max(0, Number(saved) || 0);
  const pct = g > 0 ? Math.min(100, (s / g) * 100) : 0;

  function deposit() {
    const n = Number(add) || 0;
    if (n <= 0) return;
    setSaved(String(s + n));
    setAdd("");
  }

  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Track a savings target on this device. Update deposits whenever you visit.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Goal (NGN)" value={goal} onChange={(e) => setGoal(e.target.value)} inputMode="decimal" />
        <Field label="Saved so far (NGN)" value={saved} onChange={(e) => setSaved(e.target.value)} inputMode="decimal" />
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: pct + "%" }} />
      </div>
      <p className="text-sm text-gray-300">
        {pct.toFixed(1)}% · NGN {s.toLocaleString()} / {g.toLocaleString()}
      </p>
      <div className="flex gap-2">
        <input
          className={input}
          placeholder="Add deposit"
          value={add}
          onChange={(e) => setAdd(e.target.value)}
          inputMode="decimal"
        />
        <button type="button" className={btn} onClick={deposit}>
          Add
        </button>
      </div>
    </div>
  );
}

export function RandomPickerTool() {
  const [raw, setRaw] = useState("Redesign site\nRun ads\nCall client\nWrite proposal");
  const [pick, setPick] = useState("");
  const options = raw
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);

  function spin() {
    if (!options.length) return;
    setPick(options[Math.floor(Math.random() * options.length)]);
  }

  return (
    <div className={box}>
      <p className="text-sm text-gray-400">
        Stuck choosing? List options (one per line) and spin. Great for prioritising work.
      </p>
      <textarea className={input + " min-h-[140px]"} value={raw} onChange={(e) => setRaw(e.target.value)} />
      <button type="button" className={btn} onClick={spin} disabled={!options.length}>
        Pick one
      </button>
      {pick ? (
        <p className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-lg font-semibold text-white">
          {pick}
        </p>
      ) : null}
    </div>
  );
}
