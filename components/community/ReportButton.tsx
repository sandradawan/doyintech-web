"use client";

import { useState, type FormEvent } from "react";
import { fieldClass } from "@/components/community/SignIn";

export default function ReportButton({ kind, id }: { kind: "post" | "reply"; id: number }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const reason = new FormData(e.currentTarget).get("reason");
    const res = await fetch("/api/community/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, id, reason }) }).catch(() => null);
    if (res?.ok) return setDone(true);
    const data = (await res?.json().catch(() => ({}))) as { error?: string } | undefined;
    setError(data?.error || "We couldn't send your report. Please try again.");
  }

  if (done) return <p role="status" className="mt-1 text-[13px] text-brand-muted">Thanks. We&apos;ll take a look.</p>;
  if (!open) return <button type="button" onClick={() => setOpen(true)} className="mt-1 min-h-11 text-[13px] text-brand-muted underline">Report</button>;

  return (
    <form onSubmit={submit} className="mt-2 max-w-md">
      <label className="block text-[13px] font-semibold text-brand-ink">What&apos;s wrong?<input name="reason" required minLength={3} maxLength={300} className={fieldClass} /></label>
      {error && <p role="alert" className="mt-1 text-[13px] text-red-300">{error}</p>}
      <button type="submit" className="mt-2 min-h-11 rounded-full border border-brand-ink/20 px-4 text-[14px] font-semibold text-brand-ink">Send report</button>
    </form>
  );
}
