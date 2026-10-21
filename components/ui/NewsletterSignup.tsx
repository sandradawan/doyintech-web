"use client";

import { useState, type FormEvent } from "react";
import { readReferralCode } from "@/lib/referrals";

/** Email list signup (welcome email + short automated sequence via /api/newsletter). */
export default function NewsletterSignup({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source,
          website: trap,
          referral: readReferralCode() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not sign you up");
      setState("done");
      setMessage(data.message || "You're in.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Could not sign you up");
    }
  }

  if (state === "done") {
    return <p className="text-[14px] text-emerald-300">{message}</p>;
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <p className="text-[14px] font-semibold text-[#f5f5f7]">Get one practical growth idea every week or two</p>
      <p className="mt-1 text-[12px] text-[#86868b]">
        Plus free WhatsApp reply scripts straight away. Unsubscribe any time.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
          className="hidden"
          aria-hidden
        />
        <button
          type="submit"
          disabled={state === "busy"}
          className="shrink-0 rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black disabled:opacity-60"
        >
          {state === "busy" ? "Joining…" : "Join"}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-[12px] text-red-400">{message}</p>}
    </form>
  );
}
