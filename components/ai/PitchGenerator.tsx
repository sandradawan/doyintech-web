"use client";

import { useCallback, useEffect, useState } from "react";
import LeadGate, { useLeadUnlocked } from "@/components/ai/LeadGate";

type PitchSlide = {
  id: string;
  kind: "title" | "problem" | "solution" | "product" | "why" | "ask";
  eyebrow: string;
  headline: string;
  subhead?: string;
  bullets?: string[];
  accent?: string;
};

export default function PitchGenerator() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [audience, setAudience] = useState("");
  const [ask, setAsk] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slides, setSlides] = useState<PitchSlide[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [finalUrl, setFinalUrl] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const { unlocked, setUnlocked } = useLeadUnlocked();
  const [pendingReveal, setPendingReveal] = useState(false);

  const total = slides.length;
  const current = slides[index];
  const canShowDeck = slides.length > 0 && unlocked;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => {
        const n = i + dir;
        if (n < 0 || n >= total) return i;
        return n;
      });
    },
    [total]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIndex(0);
    try {
      const res = await fetch("/api/ai/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, description, url, audience, ask }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSlides(data.slides || []);
      setMarkdown(data.markdown || "");
      setScreenshotUrl(data.screenshotUrl || null);
      setFinalUrl(data.finalUrl || null);
      if (!unlocked) setPendingReveal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copyMd() {
    if (!markdown) return;
    void navigator.clipboard.writeText(markdown);
  }

  function printPdf() {
    window.print();
  }

  return (
    <div className="mt-10 space-y-10">
      <form
        onSubmit={generate}
        className="rounded-[28px] border border-white/10 bg-[#141416] p-6 sm:p-8 print:hidden"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-1">
            <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#86868b]">
              Project name *
            </span>
            <input
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="DoyinOps"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]/60"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#86868b]">
              Product URL
            </span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.doyintech.com"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]/60"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#86868b]">
              What does it do? *
            </span>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Helps SMEs track leads, quotes, and cash in one simple workspace."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]/60"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#86868b]">
              Audience
            </span>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="SME owners and operators"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]/60"
            />
          </label>
          <label className="block">
            <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#86868b]">
              The ask
            </span>
            <input
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              placeholder="Pilot customers or seed funding for Q1"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]/60"
            />
          </label>
        </div>
        {error ? <p className="mt-4 text-[14px] text-red-400">{error}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#ff8c14] px-8 py-3.5 text-[15px] font-semibold text-black shadow-[0_8px_28px_rgba(255,140,20,0.35)] transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Designing deck + capturing site..." : "Generate visual pitch deck"}
          </button>
          {canShowDeck ? (
            <>
              <button
                type="button"
                onClick={printPdf}
                className="rounded-full border border-white/20 px-5 py-3 text-[14px] font-semibold text-white"
              >
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={copyMd}
                className="rounded-full border border-white/20 px-5 py-3 text-[14px] font-semibold text-white"
              >
                Copy notes
              </button>
            </>
          ) : null}
        </div>
      </form>

      {pendingReveal && !unlocked ? (
        <div className="print:hidden">
          <LeadGate
            product="SME Pitch Deck"
            unlocked={unlocked}
            onUnlock={() => {
              setUnlocked(true);
              setPendingReveal(false);
            }}
          />
        </div>
      ) : null}

      {canShowDeck && current ? (
        <div className="space-y-5" id="pitch-deck-print">
          <div className="flex items-center justify-between gap-3 print:hidden">
            <p className="text-[13px] font-medium text-[#86868b]">
              Slide {index + 1} of {total} · Use arrow keys
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={index === 0}
                className="h-10 w-10 rounded-full border border-white/15 text-white disabled:opacity-30"
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={index >= total - 1}
                className="h-10 w-10 rounded-full border border-white/15 text-white disabled:opacity-30"
                aria-label="Next slide"
              >
                →
              </button>
            </div>
          </div>

          {/* On-screen single slide */}
          <div
            className="relative overflow-hidden rounded-[24px] border border-white/12 shadow-[0_40px_80px_rgba(0,0,0,0.55)] print:hidden"
            style={{ aspectRatio: "16 / 9" }}
          >
            <SlideCanvas
              slide={current}
              screenshotUrl={screenshotUrl}
              finalUrl={finalUrl}
            />
          </div>

          {/* Print: all slides stacked */}
          <div className="hidden print:block">
            {slides.map((s) => (
              <div
                key={s.id}
                className="relative mb-6 overflow-hidden break-after-page border border-black/10"
                style={{ aspectRatio: "16 / 9", width: "100%" }}
              >
                <SlideCanvas
                  slide={s}
                  screenshotUrl={screenshotUrl}
                  finalUrl={finalUrl}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 print:hidden">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`min-w-[140px] flex-shrink-0 rounded-xl border px-3 py-3 text-left transition ${
                  i === index
                    ? "border-[#ff8c14] bg-[#ff8c14]/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 line-clamp-2 text-[12px] font-semibold text-white">
                  {s.headline}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : !pendingReveal || unlocked ? (
        <div className="flex aspect-[16/9] items-center justify-center rounded-[24px] border border-dashed border-white/15 bg-[#0c0c0e] print:hidden">
          <div className="max-w-md px-6 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ff8c14]">
              Deck preview
            </p>
            <p className="mt-3 font-display text-[28px] font-semibold tracking-tight text-white">
              Your slides will appear here
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#a1a1a6]">
              Generate a 16:9 pitch with typography, color, and a live product screenshot.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SlideCanvas({
  slide,
  screenshotUrl,
  finalUrl,
}: {
  slide: PitchSlide;
  screenshotUrl: string | null;
  finalUrl: string | null;
}) {
  if (slide.kind === "title") {
    return (
      <div className="absolute inset-0 flex flex-col justify-between bg-[#0a0a0c] p-8 sm:p-12 lg:p-14">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #ff8c14 0%, transparent 70%)" }}
        />
        <div className="relative">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#ff8c14] sm:text-[13px]">
            {slide.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-[36px] font-semibold leading-[1.05] tracking-tight text-white sm:text-[48px] lg:text-[56px]">
            {slide.headline}
          </h2>
          {slide.subhead ? (
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6] sm:text-[18px] lg:text-[20px]">
              {slide.subhead}
            </p>
          ) : null}
        </div>
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(slide.bullets || []).map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[12px] font-medium text-[#d1d5db] sm:text-[13px]"
              >
                {b}
              </span>
            ))}
          </div>
          <p className="text-[11px] font-medium tracking-wide text-[#6b7280]">DoyinTech</p>
        </div>
      </div>
    );
  }

  if (slide.kind === "product") {
    return (
      <div className="absolute inset-0 flex bg-[#0a0a0c]">
        <div className="flex w-[38%] flex-col justify-between border-r border-white/10 p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff8c14] sm:text-[12px]">
              {slide.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[24px] font-semibold leading-tight tracking-tight text-white sm:text-[32px] lg:text-[36px]">
              {slide.headline}
            </h2>
            {slide.subhead ? (
              <p className="mt-3 text-[13px] leading-relaxed text-[#a1a1a6] sm:text-[15px]">
                {slide.subhead}
              </p>
            ) : null}
          </div>
          {finalUrl ? (
            <p className="mt-4 truncate text-[12px] font-medium text-[#2997ff]">
              {finalUrl.replace(/^https?:\/\//, "")}
            </p>
          ) : null}
        </div>
        <div className="relative flex flex-1 items-center justify-center bg-[#111114] p-4 sm:p-6">
          {screenshotUrl ? (
            <div className="relative w-full max-w-[92%] overflow-hidden rounded-xl border border-white/15 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#1c1c1f] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <div className="ml-2 flex-1 truncate rounded-md bg-black/40 px-2 py-1 text-[10px] text-[#86868b]">
                  {finalUrl?.replace(/^https?:\/\//, "") || "product"}
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screenshotUrl}
                alt="Product screenshot"
                className="aspect-[16/10] w-full bg-black object-cover object-top"
              />
            </div>
          ) : (
            <div className="flex h-[70%] w-[90%] flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/30 px-6 text-center">
              <p className="text-[15px] font-semibold text-white">Screenshot unavailable</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (slide.kind === "ask") {
    return (
      <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-br from-[#1a1008] via-[#0a0a0c] to-[#0a0a0c] p-8 sm:p-12 lg:p-14">
        <div className="relative">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff8c14]">
            {slide.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-[32px] font-semibold leading-tight tracking-tight text-white sm:text-[44px]">
            {slide.headline}
          </h2>
          {slide.subhead ? (
            <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-[#f5f5f7] sm:text-[22px]">
              {slide.subhead}
            </p>
          ) : null}
        </div>
        <div className="relative grid gap-3 sm:grid-cols-3">
          {(slide.bullets || []).map((b, i) => (
            <div
              key={b}
              className="rounded-2xl border border-[#ff8c14]/25 bg-[#ff8c14]/10 px-4 py-4"
            >
              <p className="text-[11px] font-semibold text-[#ff8c14]">Step {i + 1}</p>
              <p className="mt-2 text-[14px] font-medium leading-snug text-white">{b}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isProblem = slide.kind === "problem";
  return (
    <div className="absolute inset-0 flex bg-[#0a0a0c]">
      <div
        className={`w-2 flex-shrink-0 ${
          isProblem ? "bg-[#ff453a]" : slide.kind === "solution" ? "bg-[#25D366]" : "bg-[#2997ff]"
        }`}
      />
      <div className="flex flex-1 flex-col justify-between p-8 sm:p-12 lg:p-14">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#ff8c14]">
            {slide.eyebrow}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[40px]">
            {slide.headline}
          </h2>
          {slide.subhead ? (
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#a1a1a6] sm:text-[18px]">
              {slide.subhead}
            </p>
          ) : null}
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {(slide.bullets || []).map((b, i) => (
            <div key={b} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[12px] font-bold text-white">
                {i + 1}
              </span>
              <p className="mt-3 text-[14px] font-medium leading-snug text-[#f5f5f7]">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
