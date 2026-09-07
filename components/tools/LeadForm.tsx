"use client";

import { useState } from "react";
import { trackToolEvent } from "@/lib/tools/analytics";
import { whatsappUrl } from "@/lib/tools/config";
import { useToast } from "@/components/ui/Toast";

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
  const { toast } = useToast();

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
      toast("Message sent. We will respond shortly.", "success");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
      setError("Could not send. Try WhatsApp instead.");
      toast("Could not send form. Try WhatsApp.", "error");
    }
  }

  const wa = whatsappUrl(
    defaultMessage ||
      `Hi DoyinTech, I used your ${tool} tool${resultSummary ? ` (${resultSummary})` : ""} and would like help.`,
  );

  const field =
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition focus:border-primary/50";

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
        <form onSubmit={onSubmit} className="mt-4 grid gap-3" noValidate>
          <input name="company_website" className="hidden" tabIndex={-1} autoComplete="off" />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-gray-500">
              Your name
              <input name="name" required placeholder="Ada Okafor" className={`mt-1 ${field}`} />
            </label>
            <label className="block text-xs text-gray-500">
              Email
              <input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className={`mt-1 ${field}`}
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-gray-500">
              WhatsApp / Phone
              <input name="phone" placeholder="+234…" className={`mt-1 ${field}`} />
            </label>
            <label className="block text-xs text-gray-500">
              Business name (optional)
              <input name="businessName" placeholder="Your company" className={`mt-1 ${field}`} />
            </label>
          </div>
          <label className="block text-xs text-gray-500">
            How can we help?
            <textarea
              name="message"
              rows={3}
              defaultValue={defaultMessage}
              placeholder="Tell us about your project…"
              className={`mt-1 resize-none ${field}`}
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex-1 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Get Free Consultation"}
            </button>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackToolEvent("whatsapp_clicked", { tool })}
              className="flex-1 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 py-3 text-center text-xs font-bold uppercase tracking-wider text-[#25D366] transition hover:bg-[#25D366]/20"
            >
              WhatsApp
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
