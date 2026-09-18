"use client";

import { useState } from "react";

export default function FreeAuditForm() {
  const [url, setUrl] = useState("");
  const [business, setBusiness] = useState("");
  const [goal, setGoal] = useState("more WhatsApp enquiries");
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);

  function buildWa() {
    const text = [
      "Hi DoyinTech, I want a FREE 3-minute website audit.",
      "",
      `My website URL: ${url.trim() || "(none yet)"}`,
      `Business type: ${business.trim() || "(not specified)"}`,
      `Main goal: ${goal}`,
      name.trim() ? `Name: ${name.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return `https://wa.me/2348085343926?text=${encodeURIComponent(text)}`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);

    // Best-effort lead log (does not block WhatsApp)
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Audit lead",
          phone: "whatsapp",
          product: "Free website audit",
          type: "lead-magnet",
          message: `URL: ${url}\nBusiness: ${business}\nGoal: ${goal}`,
        }),
      });
    } catch {
      /* ignore */
    }

    window.open(buildWa(), "_blank", "noopener,noreferrer");
    setSending(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/10 bg-[#141a28] p-6 text-left shadow-xl"
    >
      <label className="block text-[13px] font-medium text-[#f5f5f7]">
        Website URL
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://yourbusiness.com"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none placeholder:text-[#555] focus:border-[#ff8c14]/50"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-[13px] font-medium text-[#f5f5f7]">
          Business type
          <input
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="Salon, clinic, property, coach…"
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none placeholder:text-[#555] focus:border-[#ff8c14]/50"
          />
        </label>
        <label className="block text-[13px] font-medium text-[#f5f5f7]">
          Your name (optional)
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none placeholder:text-[#555] focus:border-[#ff8c14]/50"
          />
        </label>
      </div>

      <label className="mt-4 block text-[13px] font-medium text-[#f5f5f7]">
        Main goal
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]/50"
        >
          <option value="more WhatsApp enquiries">More WhatsApp enquiries</option>
          <option value="more phone calls">More phone calls</option>
          <option value="more sales / bookings">More sales / bookings</option>
          <option value="look more professional">Look more professional</option>
          <option value="not sure — tell me what is broken">Not sure — tell me what is broken</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={sending}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-[16px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {sending ? "Opening WhatsApp…" : "Send my URL on WhatsApp"}
      </button>
      <p className="mt-3 text-center text-[12px] text-[#86868b]">
        Opens WhatsApp with your details filled in. No password. No spam list.
      </p>
    </form>
  );
}
