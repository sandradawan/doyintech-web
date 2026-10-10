"use client";

import { useState } from "react";

type Slide = { title: string; body: string };

export default function PitchGenerator() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [audience, setAudience] = useState("");
  const [ask, setAsk] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
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
      setPageTitle(data.pageTitle || null);
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

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={generate}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
      >
        <label className="block">
          <span className="text-[12px] font-medium text-[#a1a1a6]">Project name *</span>
          <input
            required
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="DoyinOps"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-[12px] font-medium text-[#a1a1a6]">
            What does it do? *
          </span>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Helps SMEs track leads, quotes, and cash in one simple workspace."
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-[12px] font-medium text-[#a1a1a6]">
            Product URL (for live screenshot)
          </span>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.doyintech.com"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-[12px] font-medium text-[#a1a1a6]">Audience</span>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="SME owners and operators"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-[12px] font-medium text-[#a1a1a6]">The ask</span>
          <input
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            placeholder="Pilot customers or seed funding for Q1"
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
          />
        </label>
        {error ? <p className="mt-3 text-[13px] text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-[#ff8c14] py-3 text-[14px] font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Building pitch + snapshot..." : "Generate pitch deck"}
        </button>
        <p className="mt-3 text-[12px] text-[#6b7280]">
          Screenshots use Microlink (free tier limits apply). Some sites block capture.
        </p>
      </form>

      <div className="space-y-4">
        {screenshotUrl ? (
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <p className="border-b border-white/10 bg-white/[0.03] px-4 py-2 text-[12px] text-[#a1a1a6]">
              Live snapshot{pageTitle ? ` · ${pageTitle}` : ""}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={screenshotUrl} alt="Website snapshot" className="w-full bg-black" />
          </div>
        ) : null}

        {slides.map((s, i) => (
          <div
            key={s.title + i}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#ff8c14]">
              Slide {i + 1}
            </p>
            <h3 className="mt-1 text-[18px] font-semibold text-white">{s.title}</h3>
            <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-[#d1d5db]">
              {s.body}
            </p>
          </div>
        ))}

        {markdown ? (
          <button
            type="button"
            onClick={copyMd}
            className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Copy full markdown
          </button>
        ) : (
          <p className="text-[14px] text-[#a1a1a6]">
            Your professional slides will appear here after you generate.
          </p>
        )}
      </div>
    </div>
  );
}
