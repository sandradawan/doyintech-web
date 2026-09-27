"use client";

import { useState } from "react";

type Props = {
  source?: string;
  product?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  downloadHref?: string;
  downloadLabel?: string;
};

export default function EmailCapture({
  source = "email-capture",
  product = "SME tips list",
  title = "Get the free pack + weekly SME tips",
  subtitle = "Email only. No spam. Unsubscribe anytime.",
  ctaLabel = "Send me the pack",
  downloadHref,
  downloadLabel = "Download now",
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Subscriber",
          email: clean,
          product,
          type: "lead-magnet",
          source,
          message: downloadHref ? `Requested: ${downloadHref}` : "Email list signup",
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Could not save. Try WhatsApp instead.");
      }
      setStatus("ok");
      if (downloadHref) {
        window.open(downloadHref, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 p-6 text-center">
        <p className="text-[16px] font-semibold text-white">You’re in.</p>
        <p className="mt-2 text-[14px] text-[#a1a1a6]">
          {downloadHref
            ? "Your download should open in a new tab. Check spam if the email tip doesn’t land."
            : "We’ll send practical SME tips — kits and website offers only when useful."}
        </p>
        {downloadHref && (
          <a
            href={downloadHref}
            download
            className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black"
          >
            {downloadLabel}
          </a>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-[13px]">
          <a href="/products" className="text-[#ff8c14] hover:underline">
            Browse kits
          </a>
          <a href="/hire" className="text-[#2997ff] hover:underline">
            Hire / deposit
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/10 bg-[#141a28] p-6"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
        Free · email list
      </p>
      <h3 className="mt-2 text-[18px] font-semibold text-white">{title}</h3>
      <p className="mt-1 text-[13px] text-[#a1a1a6]">{subtitle}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-[12px] font-medium text-[#f5f5f7]">
          Name (optional)
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
          />
        </label>
        <label className="block text-[12px] font-medium text-[#f5f5f7]">
          Email *
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@business.com"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
          />
        </label>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      {error && <p className="mt-2 text-[12px] text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 w-full rounded-full bg-[#ff8c14] py-3 text-[14px] font-semibold text-black disabled:opacity-60"
      >
        {status === "loading" ? "Saving…" : ctaLabel}
      </button>
      <p className="mt-2 text-center text-[11px] text-[#86868b]">
        Stored securely for follow-up tips and product offers.{" "}
        <a href="/privacy" className="underline">
          Privacy
        </a>
      </p>
    </form>
  );
}
