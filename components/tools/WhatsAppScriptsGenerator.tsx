"use client";

import { useState } from "react";

const BUSINESS_TYPES = [
  "Salon / makeup",
  "Clinic / hospital",
  "Property / real estate",
  "Restaurant / cafe",
  "Gaming lounge",
  "Coach / consultant",
  "Shop / retail",
  "Other service business",
] as const;

type Biz = (typeof BUSINESS_TYPES)[number];

function buildScripts(biz: Biz, name: string) {
  const brand = name.trim() || "our business";
  return [
    {
      title: "Price enquiry",
      text: `Hi! Thanks for messaging ${brand} 👋\n\nOur prices depend on the exact service you need. Quick options:\n• Reply with what you want (e.g. bridal, consultation, booking)\n• Or visit our site for packages\n\nWhat can we help you with today?`,
    },
    {
      title: "After-hours auto reply",
      text: `Thanks for contacting ${brand}.\n\nWe're offline right now. We reply every day between 9am–6pm.\n\nLeave your name + what you need — we'll get back as soon as we're online.\n\nUrgent? Call us or check our website.`,
    },
    {
      title: "Website / booking enquiry",
      text: `Hi! Yes — you can book or see services on our website, or tell me here:\n\n1) What service?\n2) Preferred day/time?\n3) Any special request?\n\nI'll confirm availability for ${brand}.`,
    },
    {
      title: "Soft close (ready to buy)",
      text: `Perfect — we can lock that in for you.\n\nTo confirm:\n• Service: [fill]\n• Date/time: [fill]\n• Location / delivery: [fill]\n\nReply YES to hold the slot and I'll send payment details / next step for ${brand}.`,
    },
    {
      title: "Review request",
      text: `Thank you for choosing ${brand}! 🙏\n\nIf we made your day easier, a short Google or WhatsApp review helps other customers find us.\n\nReply REVIEW and I'll send the link. Appreciate you!`,
    },
  ].map((s) => ({
    ...s,
    text:
      biz === "Gaming lounge"
        ? s.text.replace("service", "station / tournament").replace("booking", "reservation")
        : s.text,
  }));
}

export default function WhatsAppScriptsGenerator() {
  const [biz, setBiz] = useState<Biz>("Salon / makeup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"form" | "scripts">("form");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const scripts = buildScripts(biz, name);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Scripts user",
          phone: phone.trim() || "whatsapp",
          product: "WhatsApp reply scripts generator",
          type: "lead-magnet",
          source: "whatsapp-scripts-tool",
          message: `Business type: ${biz}\nPhone: ${phone}\nBusiness name: ${name}`,
        }),
      });
    } catch {
      /* ignore */
    }
    setSending(false);
    setStep("scripts");
  }

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  }

  if (step === "scripts") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-[14px] font-semibold text-emerald-300">Your 5 scripts are ready</p>
          <p className="mt-1 text-[13px] text-[#a1a1a6]">
            Copy into WhatsApp Business → Settings → Away / greeting messages, or save as Quick
            replies.
          </p>
        </div>

        {scripts.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-white/10 bg-[#141a28] p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-white">{s.title}</h3>
              <button
                type="button"
                onClick={() => copy(s.text, s.title)}
                className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-[#ff8c14]"
              >
                {copied === s.title ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-[#c7cdd8]">
              {s.text}
            </pre>
          </div>
        ))}

        <div className="rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-6">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[#ff8c14]">
            Next step that actually grows sales
          </p>
          <h3 className="mt-2 text-[20px] font-semibold text-white">
            Put these scripts on a real website
          </h3>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            Scripts help. A fixed-price site with one-tap WhatsApp turns strangers into booked
            clients. Landing page ₦100k · Local business site ₦250k.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/hire"
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black"
            >
              Hire — pay deposit
            </a>
            <a
              href="/free-audit"
              className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              Free site audit
            </a>
            <a
              href="/products"
              className="rounded-full px-5 py-2.5 text-[13px] font-semibold text-[#2997ff]"
            >
              Full WhatsApp growth pack →
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStep("form")}
          className="text-[13px] text-[#86868b] hover:text-white"
        >
          ← Generate for another business
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onGenerate} className="rounded-2xl border border-white/10 bg-[#141a28] p-6">
      <label className="block text-[13px] font-medium text-[#f5f5f7]">
        Business type
        <select
          value={biz}
          onChange={(e) => setBiz(e.target.value as Biz)}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]/50"
        >
          {BUSINESS_TYPES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block text-[13px] font-medium text-[#f5f5f7]">
        Business name (used in scripts)
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. JennyGlams"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none placeholder:text-[#555] focus:border-[#ff8c14]/50"
        />
      </label>

      <label className="mt-4 block text-[13px] font-medium text-[#f5f5f7]">
        WhatsApp number (so we can send tips)
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="080… or +234…"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none placeholder:text-[#555] focus:border-[#ff8c14]/50"
        />
      </label>

      <button
        type="submit"
        disabled={sending}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-[16px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {sending ? "Generating…" : "Get my 5 free scripts"}
      </button>
      <p className="mt-3 text-center text-[12px] text-[#86868b]">
        Free. Instant. Optional WhatsApp for follow-up tips — no spam list.
      </p>
    </form>
  );
}
