"use client";

import { useState, type FormEvent } from "react";
import SignIn, { fieldClass, sendAsMember, useSignedIn } from "@/components/community/SignIn";
import { LIMITS, TOPICS } from "@/lib/community/rules";

const label = "block text-[14px] font-semibold text-brand-ink";

/** The question form, or the reply form when given a postId. Both need a signed-in member. */
export default function Compose({ postId }: { postId?: number }) {
  const { checking, email } = useSignedIn();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const isReply = postId !== undefined;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const fields = Object.fromEntries(form);
      await sendAsMember(isReply ? "/api/community/replies" : "/api/community/posts", { ...fields, postId, adult: form.get("adult") === "on" });
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("idle");
    }
  }

  if (checking) return <p className="text-[15px] text-brand-muted">Loading…</p>;
  if (!email) return <SignIn prompt={isReply ? "Sign in to reply" : "Sign in to ask a question"} />;
  if (state === "sent") {
    return <p role="status" className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-[15px] text-brand-ink">Thank you. We check every {isReply ? "reply" : "question"} before it goes live, and we&apos;ll email you when it&apos;s up.</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className={label}>Display name (shown publicly)<input name="name" required minLength={LIMITS.name[0]} maxLength={LIMITS.name[1]} autoComplete="nickname" className={fieldClass} /></label>
      {!isReply && (
        <>
          <label className={label}>
            Topic
            <select name="topic" required defaultValue="" className={fieldClass}>
              <option value="" disabled>Choose a topic</option>
              {TOPICS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className={label}>Your question<input name="title" required minLength={LIMITS.title[0]} maxLength={LIMITS.title[1]} className={fieldClass} /></label>
        </>
      )}
      <label className={label}>
        {isReply ? "Your reply" : "More detail"}
        <textarea name="body" required rows={5} minLength={isReply ? LIMITS.reply[0] : LIMITS.body[0]} maxLength={isReply ? LIMITS.reply[1] : LIMITS.body[1]} className={`${fieldClass} py-2`} />
      </label>
      <label className="flex min-h-11 items-start gap-3 text-[14px] text-brand-soft">
        <input type="checkbox" name="adult" required className="mt-1 h-5 w-5 accent-brand-link" />
        <span>I&apos;m 18 or over and I accept the community rules.</span>
      </label>
      {error && <p role="alert" className="text-[14px] text-red-300">{error}</p>}
      <button type="submit" disabled={state === "sending"} className="min-h-12 rounded-full bg-brand-accent px-6 text-[15px] font-semibold text-black disabled:opacity-60">
        {state === "sending" ? "Sending…" : isReply ? "Send reply" : "Send question"}
      </button>
    </form>
  );
}
