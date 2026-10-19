"use client";

import { useState } from "react";
import PaidGate, { printHtml } from "./PaidGate";

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }
) {
  const { label, className, ...rest } = props;
  return (
    <label className="block text-sm text-gray-300">
      <span className="mb-1 block text-xs text-gray-500">{label}</span>
      <input
        {...rest}
        className={`w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none ${className || ""}`}
      />
    </label>
  );
}

function Area(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
) {
  const { label, ...rest } = props;
  return (
    <label className="block text-sm text-gray-300">
      <span className="mb-1 block text-xs text-gray-500">{label}</span>
      <textarea
        {...rest}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none"
      />
    </label>
  );
}

async function runStudio(mode: string, payload: Record<string, string>) {
  const res = await fetch("/api/ai/studio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, useLlm: true, ...payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Generation failed");
  return data as { text: string; llm?: boolean };
}

function StudioShell({
  toolSlug,
  title,
  children,
  onGenerate,
  result,
  loading,
  error,
  llm,
}: {
  toolSlug: string;
  title: string;
  children: React.ReactNode;
  onGenerate: () => void;
  result: string;
  loading: boolean;
  error: string;
  llm?: boolean;
}) {
  return (
    <PaidGate
      toolSlug={toolSlug}
      preview={
        <p className="text-sm text-gray-500">
          Preview locked. Unlock to generate full AI documents.
        </p>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-[#86868b]">
          DoyinTech AI Studio · uses OpenAI when OPENAI_API_KEY is set
        </p>
        {children}
        <button
          type="button"
          disabled={loading}
          onClick={onGenerate}
          className="w-full rounded-full bg-[#ff8c14] py-3 text-sm font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Generating…" : `Generate ${title}`}
        </button>
        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        {result ? (
          <div className="space-y-3">
            <p className="text-xs text-[#86868b]">
              {llm ? "AI-enhanced output" : "Template draft (set OPENAI_API_KEY for full AI)"}
            </p>
            <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-gray-200">
              {result}
            </pre>
            <button
              type="button"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
              onClick={() => {
                navigator.clipboard?.writeText(result);
                printHtml(
                  title,
                  `<pre style="white-space:pre-wrap;font-family:system-ui">${result
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")}</pre>`
                );
              }}
            >
              Copy & print
            </button>
          </div>
        ) : null}
      </div>
    </PaidGate>
  );
}

function useStudio() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [llm, setLlm] = useState(false);
  async function gen(mode: string, payload: Record<string, string>) {
    setLoading(true);
    setError("");
    try {
      const data = await runStudio(mode, payload);
      setResult(data.text);
      setLlm(Boolean(data.llm));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }
  return { result, loading, error, llm, gen };
}

export function AiSopWriterTool() {
  const [businessName, setBusinessName] = useState("");
  const [processName, setProcessName] = useState("");
  const [owner, setOwner] = useState("");
  const [stepsHint, setStepsHint] = useState("");
  const s = useStudio();
  return (
    <StudioShell toolSlug="ai-sop-writer" title="SOP" onGenerate={() => s.gen("sop", { businessName, processName, owner, stepsHint })} result={s.result} loading={s.loading} error={s.error} llm={s.llm}>
      <Field label="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
      <Field label="Process name" value={processName} onChange={(e) => setProcessName(e.target.value)} placeholder="e.g. Order fulfilment" />
      <Field label="Process owner" value={owner} onChange={(e) => setOwner(e.target.value)} />
      <Area label="Steps / notes (optional)" rows={4} value={stepsHint} onChange={(e) => setStepsHint(e.target.value)} />
    </StudioShell>
  );
}

export function AiSocialCalendarTool() {
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState("");
  const [platforms, setPlatforms] = useState("WhatsApp Status, Instagram");
  const [weeks, setWeeks] = useState("2");
  const s = useStudio();
  return (
    <StudioShell toolSlug="ai-social-calendar" title="calendar" onGenerate={() => s.gen("social_calendar", { businessName, niche, platforms, weeks })} result={s.result} loading={s.loading} error={s.error} llm={s.llm}>
      <Field label="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
      <Field label="Niche / offer" value={niche} onChange={(e) => setNiche(e.target.value)} />
      <Field label="Platforms" value={platforms} onChange={(e) => setPlatforms(e.target.value)} />
      <Field label="Weeks" value={weeks} onChange={(e) => setWeeks(e.target.value)} />
    </StudioShell>
  );
}

export function AiProductCopyTool() {
  const [productName, setProductName] = useState("");
  const [audience, setAudience] = useState("");
  const [benefits, setBenefits] = useState("");
  const [priceHint, setPriceHint] = useState("");
  const s = useStudio();
  return (
    <StudioShell toolSlug="ai-product-copy" title="product copy" onGenerate={() => s.gen("product_copy", { productName, audience, benefits, priceHint })} result={s.result} loading={s.loading} error={s.error} llm={s.llm}>
      <Field label="Product / service" value={productName} onChange={(e) => setProductName(e.target.value)} />
      <Field label="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
      <Field label="Key benefits" value={benefits} onChange={(e) => setBenefits(e.target.value)} />
      <Field label="Price hint (optional)" value={priceHint} onChange={(e) => setPriceHint(e.target.value)} />
    </StudioShell>
  );
}

export function AiJobDescTool() {
  const [roleTitle, setRoleTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Lagos / Hybrid");
  const [mustHaves, setMustHaves] = useState("");
  const s = useStudio();
  return (
    <StudioShell toolSlug="ai-job-desc" title="job description" onGenerate={() => s.gen("job_desc", { roleTitle, company, location, mustHaves })} result={s.result} loading={s.loading} error={s.error} llm={s.llm}>
      <Field label="Role title" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
      <Field label="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
      <Field label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <Area label="Must-haves" rows={3} value={mustHaves} onChange={(e) => setMustHaves(e.target.value)} />
    </StudioShell>
  );
}

export function AiMeetingActionsTool() {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");
  const s = useStudio();
  return (
    <StudioShell toolSlug="ai-meeting-actions" title="actions" onGenerate={() => s.gen("meeting_actions", { meetingTitle, attendees, notes })} result={s.result} loading={s.loading} error={s.error} llm={s.llm}>
      <Field label="Meeting title" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} />
      <Field label="Attendees" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
      <Area label="Raw notes" rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste messy notes…" />
    </StudioShell>
  );
}

export function AiFaqPackTool() {
  const [businessName, setBusinessName] = useState("");
  const [productOrService, setProductOrService] = useState("");
  const [objections, setObjections] = useState("");
  const s = useStudio();
  return (
    <StudioShell toolSlug="ai-faq-pack" title="FAQ pack" onGenerate={() => s.gen("faq_pack", { businessName, productOrService, objections })} result={s.result} loading={s.loading} error={s.error} llm={s.llm}>
      <Field label="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
      <Field label="Product / service" value={productOrService} onChange={(e) => setProductOrService(e.target.value)} />
      <Area label="Common objections" rows={3} value={objections} onChange={(e) => setObjections(e.target.value)} />
    </StudioShell>
  );
}

export function AiContentRepurposeTool() {
  const [brand, setBrand] = useState("");
  const [sourceText, setSourceText] = useState("");
  const s = useStudio();
  return (
    <StudioShell toolSlug="ai-content-repurpose" title="repurpose pack" onGenerate={() => s.gen("content_repurpose", { brand, sourceText })} result={s.result} loading={s.loading} error={s.error} llm={s.llm}>
      <Field label="Brand name" value={brand} onChange={(e) => setBrand(e.target.value)} />
      <Area label="Source article / notes" rows={8} value={sourceText} onChange={(e) => setSourceText(e.target.value)} />
    </StudioShell>
  );
}

export function AiCopyStudioTool() {
  const [productName, setProductName] = useState("");
  const [audience, setAudience] = useState("");
  const [benefits, setBenefits] = useState("");
  const s = useStudio();
  return (
    <StudioShell toolSlug="ai-copy" title="copy pack" onGenerate={() => s.gen("business_copy", { productName, audience, benefits })} result={s.result} loading={s.loading} error={s.error} llm={s.llm}>
      <Field label="Product / service" value={productName} onChange={(e) => setProductName(e.target.value)} />
      <Field label="Audience" value={audience} onChange={(e) => setAudience(e.target.value)} />
      <Field label="Benefits" value={benefits} onChange={(e) => setBenefits(e.target.value)} />
    </StudioShell>
  );
}
