"use client";

import { useState } from "react";
import { trackToolEvent } from "@/lib/tools/analytics";
import { whatsappUrl } from "@/lib/tools/config";

export default function LeadForm({
  tool,
  resultSummary,
  defaultMessage,
}: {
  tool: string;
  resultSummary?: string;
  defaultMessage?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    trackToolEvent("lead_form_started", { tool });

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      businessName: String(fd.get("businessName") || ""),
      message: String(fd.get("message") || ""),
      tool,
      resultSummary: resultSummary || "",
      company_website: String(fd.get("company_website") || ""),
    };

    try {
      const res = await fetch("/api/tools/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed");
      }
      trackToolEvent("lead_submitted", { tool });
      setStatus("ok");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
      setError("Could not send. Try WhatsApp instead.");
    }
  }

  const wa = whatsappUrl(
    defaultMessage ||
      `Hi DoyinTech, I used your ${tool} tool${resultSummary ? ` (${resultSummary})` : ""} and would like help.`,
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 md:p-6">
      <h3 className="font-display text-lg font-bold text-white">
        Want help improving your results?
      </h3>
      <p className="mt-1 text-sm text-gray-400">
        Talk to DoyinTech — free consultation, no obligation.
      </p>

      {status === "ok" ? (
        <p className="mt-4 rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-200">
          Message sent. We will respond shortly.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input name="company_website" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Your name"
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="phone"
              placeholder="WhatsApp / Phone"
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
            />
            <input
              name="businessName"
              placeholder="Business name (optional)"
              className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
            />
          </div>
          <textarea
            name="message"
            rows={3}
            defaultValue={defaultMessage}
            placeholder="How can we help?"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50 resize-none"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex-1 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Get Free Consultation"}
            </button>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackToolEvent("whatsapp_clicked", { tool })}
              className="flex-1 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#25D366]"
            >
              WhatsApp
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
