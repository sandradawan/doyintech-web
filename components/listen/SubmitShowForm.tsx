"use client";

import { useState } from "react";

const field = "mt-1 min-h-12 w-full rounded-xl border border-brand-ink/15 bg-brand-deep px-3 text-[16px] text-brand-ink";

/** Podcasters ask to be listed or featured here; every show is checked by hand before it goes up. */
export default function SubmitShowForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/listen/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return <p role="status" className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-[15px] text-brand-ink">Thank you. We&apos;ll listen to your show and reply by email.</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-[14px] font-semibold text-brand-ink">Your name<input name="name" required maxLength={80} autoComplete="name" className={field} /></label>
        <label className="block text-[14px] font-semibold text-brand-ink">Email<input name="email" type="email" required maxLength={120} autoComplete="email" className={field} /></label>
      </div>
      <label className="block text-[14px] font-semibold text-brand-ink">Podcast name<input name="show" required maxLength={120} className={field} /></label>
      <label className="block text-[14px] font-semibold text-brand-ink">Link to the show or its RSS feed<input name="link" type="url" required maxLength={300} placeholder="https://" className={field} /></label>
      <label className="block text-[14px] font-semibold text-brand-ink">
        What would you like?
        <select name="plan" className={field} defaultValue="listing">
          <option value="listing">Free listing</option>
          <option value="featured">Paid featured spot (send me the price)</option>
          <option value="suggestion">I&apos;m a listener suggesting a show</option>
        </select>
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {error && <p role="alert" className="text-[14px] text-red-300">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="min-h-12 rounded-full bg-brand-accent px-6 text-[15px] font-semibold text-black disabled:opacity-60">{state === "sending" ? "Sending…" : "Send"}</button>
    </form>
  );
}
