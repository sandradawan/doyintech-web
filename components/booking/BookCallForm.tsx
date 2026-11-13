"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

const TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
const WHATSAPP = "2348085343926";
const input = "mt-1 w-full rounded-xl border border-brand-ink/15 bg-brand-well px-3 py-2.5 text-[15px] text-brand-ink outline-none focus:border-brand-link";
const label = "block text-[13px] font-medium text-brand-muted";

/** The next 12 working days (Monday to Saturday), starting tomorrow. */
function nextDays(): Date[] {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < 12) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(new Date(d));
  }
  return out;
}

/** Pick a day and time for a free call. We get the request by email and confirm it on WhatsApp. */
export default function BookCallForm() {
  const inBrowser = useSyncExternalStore(() => () => {}, () => true, () => false);
  const days = useMemo(() => (inBrowser ? nextDays() : []), [inBrowser]);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  if (!days.length) return <div className="min-h-[420px] rounded-2xl border border-brand-ink/10 bg-brand-surface" aria-busy="true" />;

  const dayLabel = days[day].toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" });
  const slot = time ? `${dayLabel} at ${time} (Nigeria time)` : "";
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi DoyinTech, I'm ${name || "a new client"}. I requested a discovery call on ${slot}.`)}`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!time) return setError("Choose a time.");
    const data = new FormData(e.currentTarget);
    setState("busy");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || ""),
          phone: String(data.get("phone") || ""),
          email: String(data.get("email") || ""),
          product: "Discovery call",
          type: "quote",
          source: "book-call",
          message: `Requested call: ${slot}.\nAbout: ${String(data.get("topic") || "Not given")}`,
          website: String(data.get("website") || ""),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error || "That didn't send. Please try again.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That didn't send. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-2xl border border-brand-link/40 bg-brand-link/10 p-6">
        <p className="text-[20px] font-semibold text-brand-ink">Request sent for {slot}.</p>
        <p className="mt-2 text-[15px] text-brand-muted">This is a request, not a confirmed booking yet. We will confirm the time with you on WhatsApp or by phone.</p>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#25D366] px-6 text-[15px] font-semibold text-black">
          Confirm faster on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-5 sm:p-6">
      <fieldset>
        <legend className="text-[15px] font-semibold text-brand-ink">1. Choose a day</legend>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {days.map((d, i) => (
            <button
              key={d.toISOString()}
              type="button"
              aria-pressed={day === i}
              onClick={() => setDay(i)}
              className={`min-h-14 rounded-xl border px-2 py-2 text-center text-[13px] transition ${day === i ? "border-brand-accent bg-brand-accent font-semibold text-black" : "border-brand-ink/15 text-brand-ink hover:border-brand-link"}`}
            >
              <span className="block text-[11px] uppercase tracking-wide opacity-80">{d.toLocaleDateString("en-NG", { weekday: "short" })}</span>
              {d.toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="text-[15px] font-semibold text-brand-ink">2. Choose a time (Nigeria time)</legend>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {TIMES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={time === t}
              onClick={() => setTime(t)}
              className={`min-h-11 rounded-xl border text-[14px] transition ${time === t ? "border-brand-accent bg-brand-accent font-semibold text-black" : "border-brand-ink/15 text-brand-ink hover:border-brand-link"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6 grid gap-4 sm:grid-cols-2">
        <legend className="mb-3 text-[15px] font-semibold text-brand-ink">3. Your details</legend>
        <label className={label}>
          Name
          <input name="name" required maxLength={120} autoComplete="name" className={input} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className={label}>
          WhatsApp or phone number
          <input name="phone" required type="tel" maxLength={40} autoComplete="tel" className={input} />
        </label>
        <label className={label}>
          Email (optional)
          <input name="email" type="email" maxLength={200} autoComplete="email" className={input} />
        </label>
        <label className={label}>
          What is the call about? (optional)
          <input name="topic" maxLength={300} placeholder="A website for my shop" className={input} />
        </label>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      </fieldset>

      {error && <p role="alert" className="mt-4 text-[14px] text-red-300">{error}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === "busy"} className="min-h-12 rounded-full bg-brand-accent px-7 text-[15px] font-semibold text-black disabled:opacity-60">
          {state === "busy" ? "Sending…" : "Request this time"}
        </button>
        {slot && <p className="text-[14px] text-brand-muted">{slot}</p>}
      </div>
    </form>
  );
}
