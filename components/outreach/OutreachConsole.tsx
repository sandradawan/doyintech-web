"use client";

import { useEffect, useMemo, useState } from "react";
import { OUTREACH_TEMPLATES } from "@/lib/outreach-templates";

const SECRET_KEY = "doyin_admin_leads_secret";

function phoneToWaDigits(phone: string): string | null {
  let d = phone.replace(/\D/g, "");
  if (!d) return null;
  // Nigeria local 0xxxxxxxxxx → 234
  if (d.startsWith("0") && d.length === 11) d = "234" + d.slice(1);
  if (d.length < 10) return null;
  return d;
}

function applyVars(
  body: string,
  vars: Record<string, string>
) {
  let out = body;
  for (const [key, val] of Object.entries(vars)) {
    const re = new RegExp(`\\[${key}\\]`, "gi");
    out = out.replace(re, val || `[${key}]`);
  }
  return out;
}

function extractSubject(body: string): { subject: string; body: string } {
  const lines = body.split("\n");
  const first = lines[0] || "";
  if (first.toLowerCase().startsWith("subject:")) {
    return {
      subject: first.replace(/^subject:\s*/i, "").trim() || "Quick note",
      body: lines.slice(1).join("\n").replace(/^\n+/, ""),
    };
  }
  return { subject: "Quick note from DoyinTech", body };
}

const field =
  "w-full rounded-xl border border-white/10 bg-[#0c1220] px-3 py-2.5 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#ff8c14]/60";

export default function OutreachConsole() {
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [templateId, setTemplateId] = useState(OUTREACH_TEMPLATES[0]?.id || "");
  const [recipient, setRecipient] = useState("");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [city, setCity] = useState("");
  const [industry, setIndustry] = useState("");
  const [issue, setIssue] = useState("");
  const [url, setUrl] = useState("");
  const [area, setArea] = useState("");
  const [customBody, setCustomBody] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [adminSecret, setAdminSecret] = useState("");

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(SECRET_KEY);
      if (s) setAdminSecret(s);
    } catch {
      /* ignore */
    }
  }, []);

  const template = useMemo(
    () => OUTREACH_TEMPLATES.find((t) => t.id === templateId) || OUTREACH_TEMPLATES[0],
    [templateId]
  );

  const vars = useMemo(
    () => ({
      Name: name,
      "First name": name.split(" ")[0] || name,
      Business: business,
      City: city,
      industry: industry,
      Area: area || city,
      "specific issue": issue,
      "specific issue — e.g. the site is hard to use on mobile / no clear way to book": issue,
      "website URL": url,
      URL: url,
      source: "online",
    }),
    [name, business, city, industry, area, issue, url]
  );

  const rendered = useMemo(() => {
    const raw = customBody !== null ? customBody : template?.body || "";
    return applyVars(raw, vars);
  }, [customBody, template, vars]);

  const { subject, body: emailBody } = useMemo(() => extractSubject(rendered), [rendered]);

  function onTemplateChange(id: string) {
    setTemplateId(id);
    setCustomBody(null);
    setStatus(null);
  }

  async function handleSend() {
    setStatus(null);
    if (!recipient.trim()) {
      setStatus("Enter a WhatsApp number or email.");
      return;
    }
    if (!rendered.trim()) {
      setStatus("Message is empty.");
      return;
    }

    if (channel === "whatsapp") {
      const digits = phoneToWaDigits(recipient);
      if (!digits) {
        setStatus("Enter a valid phone (e.g. 0803… or +234…)." );
        return;
      }
      const href = `https://wa.me/${digits}?text=${encodeURIComponent(rendered)}`;
      window.open(href, "_blank", "noopener,noreferrer");
      setStatus("WhatsApp opened with your message. Tap Send in WhatsApp to deliver.");
      return;
    }

    // Email
    if (!recipient.includes("@")) {
      setStatus("Enter a valid email address.");
      return;
    }

    if (!adminSecret.trim()) {
      setStatus("Enter admin secret (same as lead inbox) to send email via API.");
      return;
    }

    try {
      sessionStorage.setItem(SECRET_KEY, adminSecret.trim());
    } catch {
      /* ignore */
    }

    setBusy(true);
    try {
      const res = await fetch("/api/outreach/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret.trim(),
        },
        body: JSON.stringify({
          to: recipient.trim(),
          subject,
          message: emailBody,
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("Email sent via Resend.");
      } else if (data.code === "NO_RESEND") {
        const mailto = `mailto:${encodeURIComponent(recipient.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailto;
        setStatus(
          "Resend not configured — opened your mail app. Set RESEND_API_KEY + CONTACT_FROM_EMAIL on Vercel for one-click send."
        );
      } else if (data.code === "UNAUTHORIZED") {
        setStatus("Wrong admin secret. Use the same ADMIN_LEADS_SECRET as /admin/leads.");
      } else {
        const mailto = `mailto:${encodeURIComponent(recipient.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailto;
        setStatus(data.error || "API failed — opened mail app instead.");
      }
    } catch {
      const mailto = `mailto:${encodeURIComponent(recipient.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailto;
      setStatus("Network error — opened mail app instead.");
    } finally {
      setBusy(false);
    }
  }

  function openMailtoOnly() {
    if (!recipient.includes("@")) {
      setStatus("Enter an email for mailto.");
      return;
    }
    const mailto = `mailto:${encodeURIComponent(recipient.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailto;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Outreach console</h1>
        <p className="mt-2 text-sm text-white/50">
          Pick a template, fill placeholders, send via WhatsApp or email. WhatsApp opens with the message ready — you confirm Send.
          Email API is locked to your admin secret (same as lead inbox).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0c1220] p-5">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-white/40">Channel</label>
            <div className="flex gap-2">
              {(["whatsapp", "email"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium capitalize ${
                    channel === c
                      ? "bg-[#ff8c14] text-black"
                      : "border border-white/10 bg-white/5 text-white/70"
                  }`}
                >
                  {c === "whatsapp" ? "WhatsApp" : "Email"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-white/40">
              {channel === "whatsapp" ? "Recipient WhatsApp number" : "Recipient email"}
            </label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={channel === "whatsapp" ? "0803… or +234…" : "client@example.com"}
              className={field}
            />
          </div>

          {channel === "email" && (
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-white/40">
                Admin secret (required for API email)
              </label>
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="Same as /admin/leads"
                className={field}
                autoComplete="off"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-white/40">
              Message template
            </label>
            <select
              value={templateId}
              onChange={(e) => onTemplateChange(e.target.value)}
              className={field}
            >
              {OUTREACH_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.channel} — {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] text-white/40">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada" className={field} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-white/40">Business</label>
              <input value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Glow Salon" className={field} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-white/40">City / Area</label>
              <input value={city} onChange={(e) => { setCity(e.target.value); setArea(e.target.value); }} placeholder="Jos" className={field} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-white/40">Industry</label>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="salon" className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] text-white/40">Specific issue</label>
              <input
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="no WhatsApp button on mobile"
                className={field}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[11px] text-white/40">Website URL</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={field} />
            </div>
          </div>

          {/* honeypot */}
          <input
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            aria-hidden
          />

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              disabled={busy}
              onClick={handleSend}
              className="rounded-xl bg-[#ff8c14] px-5 py-3 text-sm font-semibold text-black disabled:opacity-50"
            >
              {busy ? "Sending…" : channel === "whatsapp" ? "Open WhatsApp & send" : "Send email"}
            </button>
            {channel === "email" && (
              <button type="button" onClick={openMailtoOnly} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                Open mail app
              </button>
            )}
          </div>

          {status && (
            <p className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] text-white/70">{status}</p>
          )}
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0c1220] p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Preview</h2>
            {channel === "email" && (
              <span className="text-[11px] text-white/40">Subject: {subject}</span>
            )}
          </div>
          <textarea
            value={rendered}
            onChange={(e) => setCustomBody(e.target.value)}
            rows={18}
            className={`${field} min-h-[320px] font-mono text-[13px] leading-relaxed`}
          />
          <p className="text-[11px] text-white/35">
            Edit the preview to personalize further. Placeholders like [Name] update when you fill the fields (unless you edited the body).
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-[12px] text-amber-100/80">
        <strong className="text-amber-200">Note:</strong> Browsers cannot silently send WhatsApp messages — WhatsApp opens with text filled; you tap Send.
        Email API requires <code className="text-amber-100">ADMIN_LEADS_SECRET</code> + <code className="text-amber-100">RESEND_API_KEY</code>.
      </div>
    </div>
  );
}
