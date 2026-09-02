"use client";

import { useMemo, useState } from "react";
import {
  BUSINESS_TYPES,
  WEBSITE_TYPES,
  FEATURES,
  calculateWebsitePrice,
  formatNgn,
  type CalculatorInput,
} from "@/lib/tools/pricing";
import { trackToolEvent } from "@/lib/tools/analytics";
import LeadForm from "./LeadForm";
import ShareActions from "./ShareActions";

const STEPS = ["Business", "Website", "Features", "Details", "Result"];

export default function WebsiteCalculator() {
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState("Professional service");
  const [websiteTypeId, setWebsiteTypeId] = useState("business");
  const [featureIds, setFeatureIds] = useState<string[]>(["responsive", "contact", "whatsapp"]);
  const [pages, setPages] = useState(8);
  const [needsMobileApp, setNeedsMobileApp] = useState(false);
  const [needsMaintenance, setNeedsMaintenance] = useState(false);
  const [needsHosting, setNeedsHosting] = useState(true);
  const [expectedUsers, setExpectedUsers] =
    useState<CalculatorInput["expectedUsers"]>("medium");
  const [timeline, setTimeline] =
    useState<CalculatorInput["timeline"]>("standard");

  const result = useMemo(
    () =>
      calculateWebsitePrice({
        businessType,
        websiteTypeId,
        featureIds,
        pages,
        needsMobileApp,
        needsMaintenance,
        needsHosting,
        expectedUsers,
        timeline,
      }),
    [
      businessType,
      websiteTypeId,
      featureIds,
      pages,
      needsMobileApp,
      needsMaintenance,
      needsHosting,
      expectedUsers,
      timeline,
    ],
  );

  function toggleFeature(id: string) {
    setFeatureIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function next() {
    if (step === 3) trackToolEvent("calculator_completed");
    setStep((s) => Math.min(4, s + 1));
  }

  const shareText = `My DoyinTech website estimate: ${formatNgn(result.min)} – ${formatNgn(result.max)} (${result.packageName}). Try the free calculator: https://doyintech.vercel.app/tools/website-calculator`;

  return (
    <div className="rounded-3xl border border-white/10 bg-surface/80 p-5 md:p-8">
      <div className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
              i === step
                ? "bg-primary text-white"
                : i < step
                  ? "bg-primary/20 text-primary"
                  : "bg-white/5 text-gray-500"
            }`}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-white">Business type</h2>
          <p className="mt-1 text-sm text-gray-400">What kind of business is this website for?</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BUSINESS_TYPES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBusinessType(b)}
                className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                  businessType === b
                    ? "border-primary bg-primary/15 text-white"
                    : "border-white/10 text-gray-300 hover:border-white/25"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="font-display text-xl font-bold text-white">Website type</h2>
          <p className="mt-1 text-sm text-gray-400">Choose the closest match.</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {WEBSITE_TYPES.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWebsiteTypeId(w.id)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  websiteTypeId === w.id
                    ? "border-primary bg-primary/15 text-white"
                    : "border-white/10 text-gray-300 hover:border-white/25"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-display text-xl font-bold text-white">Features</h2>
          <p className="mt-1 text-sm text-gray-400">Select all that apply.</p>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {FEATURES.map((f) => {
              const on = featureIds.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFeature(f.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                    on
                      ? "border-primary bg-primary/15 text-white"
                      : "border-white/10 text-gray-300 hover:border-white/25"
                  }`}
                >
                  {on ? "✓ " : ""}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h2 className="font-display text-xl font-bold text-white">Project details</h2>
          <label className="block text-sm text-gray-300">
            Number of pages: <span className="text-white font-semibold">{pages}</span>
            <input
              type="range"
              min={1}
              max={40}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle
              label="Need a mobile app too?"
              on={needsMobileApp}
              set={setNeedsMobileApp}
            />
            <Toggle
              label="Ongoing maintenance?"
              on={needsMaintenance}
              set={setNeedsMaintenance}
            />
            <Toggle label="Hosting / domain help?" on={needsHosting} set={setNeedsHosting} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select
              label="Expected users"
              value={expectedUsers}
              onChange={(v) => setExpectedUsers(v as CalculatorInput["expectedUsers"])}
              options={[
                { v: "low", l: "Low (<1k/month)" },
                { v: "medium", l: "Medium" },
                { v: "high", l: "High / scale" },
              ]}
            />
            <Select
              label="Timeline preference"
              value={timeline}
              onChange={(v) => setTimeline(v as CalculatorInput["timeline"])}
              options={[
                { v: "standard", l: "Standard" },
                { v: "rush", l: "Faster (rush)" },
                { v: "flexible", l: "Flexible" },
              ]}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6" id="calculator-result">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Estimated Project Range
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">
              {formatNgn(result.min)} – {formatNgn(result.max)}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Final pricing depends on project requirements and technical complexity.
              This is not a guaranteed quotation.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ResultTile label="Recommended package" value={result.packageName} />
            <ResultTile
              label="Estimated timeline"
              value={`${result.weeksMin}–${result.weeksMax} weeks`}
            />
            <ResultTile label="Business type" value={businessType} />
          </div>

          {result.features.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-white">Selected features</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.features.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.notes.length > 0 && (
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-400">
              {result.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}

          <ShareActions
            tool="website-calculator"
            shareText={shareText}
            onRestart={() => setStep(0)}
          />

          <LeadForm
            tool="Website Price Calculator"
            resultSummary={`${formatNgn(result.min)}-${formatNgn(result.max)}`}
            defaultMessage={`Hi DoyinTech, I used the Website Price Calculator. Business: ${businessType}. Estimated range: ${formatNgn(result.min)} – ${formatNgn(result.max)}. I would like to discuss my project.`}
          />
        </div>
      )}

      {step < 4 && (
        <div className="mt-8 flex justify-between gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white"
          >
            {step === 3 ? "See estimate" : "Continue"}
          </button>
        </div>
      )}
    </div>
  );
}

function Toggle({
  label,
  on,
  set,
}: {
  label: string;
  on: boolean;
  set: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      className={`rounded-xl border px-4 py-3 text-left text-sm ${
        on ? "border-primary bg-primary/15 text-white" : "border-white/10 text-gray-300"
      }`}
    >
      {on ? "✓ " : ""}
      {label}
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <label className="block text-sm text-gray-300">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v} className="bg-black">
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-[11px] uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}
