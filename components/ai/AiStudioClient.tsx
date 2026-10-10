"use client";

import { useMemo, useState } from "react";

type Sector = "education" | "finance" | "sme" | "real_estate" | "sales";

type ModeDef = {
  mode: string;
  label: string;
  fields: { key: string; label: string; placeholder?: string; required?: boolean }[];
};

const SECTOR_MODES: Record<Sector, ModeDef[]> = {
  education: [
    {
      mode: "lesson_plan",
      label: "Lesson plan",
      fields: [
        { key: "subject", label: "Subject", placeholder: "Mathematics", required: true },
        { key: "topic", label: "Topic", placeholder: "Quadratic equations", required: true },
        { key: "level", label: "Level", placeholder: "SS2 / undergraduate" },
        { key: "duration", label: "Duration", placeholder: "45 minutes" },
      ],
    },
    {
      mode: "study_plan",
      label: "Study plan",
      fields: [
        { key: "examOrGoal", label: "Exam or goal", placeholder: "Final exams", required: true },
        { key: "subjects", label: "Subjects", placeholder: "Math, English, Economics" },
        { key: "weeks", label: "Weeks", placeholder: "4" },
      ],
    },
  ],
  finance: [
    {
      mode: "payment_reminder",
      label: "Payment reminder",
      fields: [
        { key: "clientName", label: "Client name", required: true },
        { key: "amount", label: "Amount", placeholder: "$320", required: true },
        { key: "dueDate", label: "Due date", placeholder: "15 Oct 2026" },
        { key: "invoiceRef", label: "Invoice ref", placeholder: "INV-1042" },
        { key: "tone", label: "Tone", placeholder: "professional | friendly | firm" },
      ],
    },
    {
      mode: "cashflow_checklist",
      label: "Cash-flow checklist",
      fields: [{ key: "businessType", label: "Business type", placeholder: "Salon / agency / shop" }],
    },
    {
      mode: "pricing_note",
      label: "Pricing worksheet",
      fields: [
        { key: "offer", label: "Offer / service", required: true },
        { key: "costHint", label: "Cost notes", placeholder: "Hours, materials, tools" },
        { key: "market", label: "Market", placeholder: "Local SMEs" },
      ],
    },
  ],
  sme: [
    {
      mode: "business_plan",
      label: "Business plan outline",
      fields: [
        { key: "businessName", label: "Business name", required: true },
        { key: "industry", label: "Industry", placeholder: "Retail / services / tech" },
        { key: "goal", label: "12-month goal", placeholder: "Hit monthly revenue target" },
      ],
    },
    {
      mode: "elevator_pitch",
      label: "Elevator pitch",
      fields: [
        { key: "businessName", label: "Business name", required: true },
        { key: "whoFor", label: "Who it is for", placeholder: "Busy clinic owners" },
        { key: "problem", label: "Problem", placeholder: "Missed WhatsApp bookings" },
        { key: "outcome", label: "Outcome", placeholder: "More confirmed appointments" },
      ],
    },
    {
      mode: "swot",
      label: "SWOT worksheet",
      fields: [
        { key: "businessName", label: "Business name", required: true },
        { key: "context", label: "Context", placeholder: "Expanding to a second city" },
      ],
    },
  ],
  real_estate: [
    {
      mode: "listing",
      label: "Listing description",
      fields: [
        { key: "propertyType", label: "Property type", placeholder: "3-bed flat", required: true },
        { key: "location", label: "Location", required: true },
        { key: "beds", label: "Beds / size", placeholder: "3 bed / 2 bath" },
        {
          key: "features",
          label: "Features (comma-separated)",
          placeholder: "POP, prepaid meter, gated",
        },
        { key: "price", label: "Price", placeholder: "85000 USD" },
      ],
    },
    {
      mode: "viewing_followup",
      label: "Viewing follow-up",
      fields: [
        { key: "clientName", label: "Client name", required: true },
        { key: "propertyLabel", label: "Property", required: true },
        { key: "agentName", label: "Your name / agency" },
      ],
    },
    {
      mode: "buyer_qualifier",
      label: "Buyer qualifier",
      fields: [{ key: "market", label: "Market", placeholder: "residential / commercial" }],
    },
  ],
  sales: [
    {
      mode: "sales_outreach",
      label: "Outreach scripts",
      fields: [
        { key: "product", label: "Product / offer", required: true },
        { key: "audience", label: "Audience", required: true },
        { key: "channel", label: "Channel", placeholder: "WhatsApp / Email / LinkedIn" },
        { key: "pain", label: "Pain point", placeholder: "Slow follow-ups" },
      ],
    },
    {
      mode: "proposal_outline",
      label: "Proposal outline",
      fields: [
        { key: "client", label: "Client", required: true },
        { key: "project", label: "Project", required: true },
        { key: "outcome", label: "Desired outcome" },
      ],
    },
    {
      mode: "objection_handlers",
      label: "Objection handlers",
      fields: [{ key: "offer", label: "Offer", placeholder: "Website package" }],
    },
  ],
};

const SECTOR_LABELS: Record<Sector, string> = {
  education: "Education",
  finance: "Finance",
  sme: "SME / Business",
  real_estate: "Real estate",
  sales: "Sales",
};

export default function AiStudioClient() {
  const [sector, setSector] = useState<Sector>("sme");
  const modes = SECTOR_MODES[sector];
  const [mode, setMode] = useState(modes[0].mode);
  const active = useMemo(
    () => modes.find((m) => m.mode === mode) || modes[0],
    [modes, mode]
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [useLlm, setUseLlm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [llmUsed, setLlmUsed] = useState(false);

  function switchSector(s: Sector) {
    setSector(s);
    setMode(SECTOR_MODES[s][0].mode);
    setValues({});
    setError("");
    setOutput("");
  }

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: active.mode, useLlm, ...values }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOutput(data.text || "");
      setLlmUsed(Boolean(data.llm));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copyOut() {
    if (!output) return;
    void navigator.clipboard.writeText(output);
  }

  return (
    <div className="mt-14">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(SECTOR_LABELS) as Sector[]).map((s) => (
          <button
            key={s}
            type="button"
            id={s}
            onClick={() => switchSector(s)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
              sector === s
                ? "bg-[#ff8c14] text-black"
                : "border border-white/15 text-white hover:border-white/30"
            }`}
          >
            {SECTOR_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.mode}
            type="button"
            onClick={() => {
              setMode(m.mode);
              setValues({});
              setOutput("");
            }}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${
              active.mode === m.mode
                ? "bg-white/15 text-white"
                : "text-[#a1a1a6] hover:text-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-[18px] font-semibold text-white">{active.label}</h2>
          <div className="mt-4 space-y-3">
            {active.fields.map((f) => (
              <label key={f.key} className="block">
                <span className="text-[12px] font-medium text-[#a1a1a6]">
                  {f.label}
                  {f.required ? " *" : ""}
                </span>
                <input
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                  placeholder={f.placeholder}
                  value={values[f.key] || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                />
              </label>
            ))}
          </div>

          <label className="mt-4 flex items-center gap-2 text-[13px] text-[#a1a1a6]">
            <input
              type="checkbox"
              checked={useLlm}
              onChange={(e) => setUseLlm(e.target.checked)}
              className="rounded border-white/20"
            />
            Polish with OpenAI when key is configured
          </label>

          {error ? <p className="mt-3 text-[13px] text-red-400">{error}</p> : null}

          <button
            type="button"
            disabled={loading}
            onClick={generate}
            className="mt-5 w-full rounded-full bg-[#ff8c14] py-3 text-[14px] font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[14px] font-semibold text-white">Output</h3>
            <div className="flex items-center gap-2">
              {llmUsed ? (
                <span className="rounded-full bg-[#2997ff]/20 px-2 py-0.5 text-[11px] text-[#2997ff]">
                  LLM polished
                </span>
              ) : null}
              <button
                type="button"
                onClick={copyOut}
                disabled={!output}
                className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-white disabled:opacity-40"
              >
                Copy
              </button>
            </div>
          </div>
          <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-[#d1d5db]">
            {output || "Your generated draft will appear here."}
          </pre>
        </div>
      </div>

      {sector === "education" ? (
        <p className="mt-6 text-[13px] text-[#a1a1a6]">
          For full research projects (outlines, chapters, analyzer, citations), use the{" "}
          <a href="/students" className="text-[#2997ff] hover:underline">
            Student tools hub
          </a>
          .
        </p>
      ) : null}
    </div>
  );
}
