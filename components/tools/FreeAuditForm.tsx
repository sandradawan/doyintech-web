"use client";

import { useState } from "react";

export default function FreeAuditForm() {
  const [url, setUrl] = useState("");
  const [business, setBusiness] = useState("");
  const [goal, setGoal] = useState("more WhatsApp enquiries");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  function buildWa() {
    const text = [
      "Hi DoyinTech, I want a FREE 3-minute website audit.",
      "",
      `My website URL: ${url.trim() || "(none yet)"}`,
      `Business type: ${business.trim() || "(not specified)"}`,
      `Main goal: ${goal}`,
      name.trim() ? `Name: ${name.trim()}` : "",
      email.trim() ? `Email: ${email.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Audit lead",
          email: email.trim() || undefined,
          phone: "whatsapp",
          product: "Free website audit",
          type: "audit",
          source: "free-audit",
          message: `URL: ${url}\nBusiness: ${business}\nGoal: ${goal}`,
        }),
      });
    } catch {
      /* still open WhatsApp */
    }

    window.open(buildWa(), "_blank", "noopener,noreferrer");
    setSending(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-6 text-left shadow-xl"
    >
      <label className="block text-[13px] font-medium text-brand-ink">
        Website URL
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourbusiness.com"
          className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-4 py-3 text-[15px] text-brand-ink outline-none placeholder:text-[#555] focus:border-brand-link/50"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-[13px] font-medium text-brand-ink">
          Business type
          <input
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Salon, clinic, property, coach…"
            className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-4 py-3 text-[15px] text-brand-ink outline-none placeholder:text-[#555] focus:border-brand-link/50"
          />
        </label>
        <label className="block text-[13px] font-medium text-brand-ink">
          Your name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-4 py-3 text-[15px] text-brand-ink outline-none placeholder:text-[#555] focus:border-brand-link/50"
          />
        </label>
      </div>

      <label className="block text-[13px] font-medium text-brand-ink mt-4">
        Email{" "}
        <span className="font-normal text-brand-subtle">
          (so we can send the audit notes if WhatsApp is busy)
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-4 py-3 text-[15px] text-brand-ink outline-none placeholder:text-[#555] focus:border-brand-link/50"
        />
      </label>

      <label className="mt-4 block text-[13px] font-medium text-brand-ink">
        Main goal
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-4 py-3 text-[15px] text-brand-ink outline-none focus:border-brand-link/50"
        >
          <option value="more WhatsApp enquiries">More WhatsApp enquiries</option>
          <option value="more phone calls">More phone calls</option>
          <option value="more sales / bookings">More sales / bookings</option>
          <option value="look more professional">Look more professional</option>
          <option value="not sure — tell me what is broken">
            Not sure — tell me what is broken
          </option>
        </select>
      </label>

      <button
        type="submit"
        disabled={sending}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-[16px] font-semibold text-black transition hover:brightness-110 disabled:opacity-60"
      >
        {sending ? "Opening WhatsApp…" : "Send my URL on WhatsApp"}
      </button>
      <p className="mt-3 text-center text-[12px] text-brand-subtle">
        Opens WhatsApp with your details. Email is optional but helps us follow up with fixes.
      </p>
    </form>
  );
}
