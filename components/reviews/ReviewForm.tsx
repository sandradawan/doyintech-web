"use client";

import { useState } from "react";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [permission, setPermission] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErr("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business, rating, body, permission }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setName("");
      setBusiness("");
      setBody("");
      setRating(5);
    } catch (ex) {
      setStatus("err");
      setErr(ex instanceof Error ? ex.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-[18px] font-semibold text-white">Thank you</p>
        <p className="mt-2 text-[15px] text-[#a1a1a6]">
          Your review was received. We may feature it on the site with your permission.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-card space-y-4 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[12px] font-medium text-[#a1a1a6]">Your name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#2997ff]/50"
            placeholder="Ada O."
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-medium text-[#a1a1a6]">Business (optional)</span>
          <input
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#2997ff]/50"
            placeholder="Ada Beauty Studio"
          />
        </label>
      </div>

      <div>
        <span className="text-[12px] font-medium text-[#a1a1a6]">Rating</span>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`h-10 w-10 rounded-full text-[15px] font-semibold transition ${
                n <= rating
                  ? "bg-[#ff8c14] text-black"
                  : "border border-white/15 text-[#a1a1a6]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-[12px] font-medium text-[#a1a1a6]">Your experience</span>
        <textarea
          required
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#2997ff]/50"
          placeholder="What did we build? What changed for your business?"
          minLength={20}
        />
      </label>

      <label className="flex items-start gap-3 text-[13px] text-[#a1a1a6]">
        <input
          type="checkbox"
          checked={permission}
          onChange={(e) => setPermission(e.target.checked)}
          className="mt-1"
        />
        You may show my name and review on doyintech.com
      </label>

      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      {err && <p className="text-[13px] text-red-400">{err}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="apple-btn apple-btn-primary w-full sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "Submit review"}
      </button>
    </form>
  );
}
