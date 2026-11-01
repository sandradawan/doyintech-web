"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { sendSignInLink, useCloudState } from "@/lib/tools/cloud-save";

/** Under a tool that saves its data: where the work is kept, and a one-field sign-in to keep it on every device. */
export default function CloudSaveBar() {
  const c = useCloudState();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!c.active) return null;

  if (c.signedIn) {
    const text = c.status === "saving" ? "Saving to your account…" : c.status === "error" ? "Couldn't save to your account. Your work is still on this device." : "Saved to your account";
    return (
      <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-[#a1a1a6]" role="status">
        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.status === "error" ? "#ff6b6b" : "#3ddc97"} strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
        <span>{text}{c.email ? ` (${c.email})` : ""}.</span>
        <Link href="/account" className="text-white underline underline-offset-2">Your saved tools</Link>
      </p>
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const err = await sendSignInLink(email);
    setBusy(false);
    if (err) setError(err);
    else setSent(true);
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-[#141a28] p-4">
      {sent ? (
        <p className="text-[14px] text-white" role="status">Check {email} for your sign-in link. It brings you back here with your work saved to your account.</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-[13px] text-[#c7cdd8]">
            Your work is saved on this device only. Sign in to keep it on every device, free.
            <input type="email" required autoComplete="email" placeholder="you@business.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]" />
          </label>
          <button type="submit" disabled={busy} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black disabled:opacity-60">
            {busy ? "Sending…" : "Email me a sign-in link"}
          </button>
        </form>
      )}
      {error && <p className="mt-2 text-[13px] text-[#ff6b6b]">{error}</p>}
    </div>
  );
}
