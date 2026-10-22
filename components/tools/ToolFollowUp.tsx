"use client";

import { useEffect, useState, type FormEvent } from "react";
import { readReferralCode } from "@/lib/referrals";
import { TRACK_EVENT } from "@/lib/analytics/client";

/**
 * Sits under a free tool: puts the user on the "tools" email sequence. After they save a PDF
 * it lights up, since that's when they're most likely to want the tools again.
 */
export default function ToolFollowUp({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    const onTrack = (e: Event) => {
      if ((e as CustomEvent<{ name: string }>).detail?.name !== "tool_download") return;
      setNudge(true);
    };
    window.addEventListener(TRACK_EVENT, onTrack);
    return () => window.removeEventListener(TRACK_EVENT, onTrack);
  }, []);

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
          sequence: "tools",
          website: trap,
          referral: readReferralCode() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not sign you up");
      setState("done");
      setMessage("Done. Check your inbox for the tools link.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Could not sign you up");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-[14px] text-emerald-200">
        {message}
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`mt-6 rounded-2xl border p-5 transition sm:p-6 ${
        nudge ? "border-[#ff8c14]/60 bg-[#ff8c14]/10 shadow-[0_0_0_4px_rgba(255,140,20,0.12)]" : "border-white/10 bg-[#141a28]"
      }`}
    >
      <p className="text-[15px] font-semibold text-white">
        {nudge ? "Got your document? Keep this tool for next time" : "Keep these free tools handy"}
      </p>
      <p className="mt-1 text-[13px] text-[#a1a1a6]">
        We&apos;ll email you the links, plus a few short tips on getting paid faster and the e-invoicing changes coming for small businesses. Unsubscribe any time.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          aria-label="Email address"
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-black/40 px-4 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          aria-hidden
        />
        <button
          type="submit"
          disabled={state === "busy"}
          className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black disabled:opacity-60"
        >
          {state === "busy" ? "Sending…" : "Email me the tools"}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-[12px] text-red-400">{message}</p>}
    </form>
  );
}
