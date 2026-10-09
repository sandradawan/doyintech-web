"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { RESEARCH_TEMPLATES, templatePriceLabel } from "@/lib/students/research-templates";

type Tab = "outline" | "chapter" | "abstract" | "demo" | "templates";

export default function AiProjectStudioPage() {
  const [tab, setTab] = useState<Tab>("outline");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [topic, setTopic] = useState("");
  const [field, setField] = useState("");
  const [level, setLevel] = useState("undergraduate");
  const [methodology, setMethodology] = useState("");
  const [objectives, setObjectives] = useState("");
  const [chapter, setChapter] = useState("1");
  const [notes, setNotes] = useState("");
  const [method, setMethod] = useState("");
  const [keyFinding, setKeyFinding] = useState("");
  const [demoStep, setDemoStep] = useState(0);

  const tabs: { id: Tab; label: string }[] = [
    { id: "outline", label: "Outline" },
    { id: "chapter", label: "Chapter draft" },
    { id: "abstract", label: "Abstract" },
    { id: "demo", label: "Interactive demo" },
    { id: "templates", label: "Templates" },
  ];

  async function runStudio(mode: string, body: Record<string, unknown>) {
    setLoading(true);
    setError("");
    setOutput("");
    setCopied(false);
    try {
      const res = await fetch("/api/students/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ...body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setOutput(data.text || "");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function copyOut() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const demoSteps = [
    { title: "1 · Enter your topic", body: "Example: Effect of mobile banking on SME performance." },
    { title: "2 · Generate outline", body: "Get Chapters 1–5 structure in seconds." },
    { title: "3 · Draft a chapter", body: "Expand any chapter into academic scaffold text." },
    { title: "4 · Analyse survey data", body: "Upload CSV on the Analyzer for tables + narrative." },
    { title: "5 · Full project support", body: "Pay 50% to start a managed project with Request ID." },
  ];

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white";
  const labelCls = "block text-[12px] font-medium text-[#a1a1a6]";

  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1020px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/students" className="text-[#2997ff] hover:underline">
              Students
            </Link>{" "}
            / AI Project Studio
          </p>
          <h1 className="mt-3 font-display text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">
            AI Project Studio
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#a1a1a6]">
            Generate research outlines, chapter scaffolds, abstracts, and academic templates.
            Pair with the analyzer and project portal when you need full support.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                  tab === t.id
                    ? "bg-[#ff8c14] text-black"
                    : "border border-white/15 bg-white/[0.04] text-[#e8e8ed] hover:border-white/30"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              {tab === "outline" && (
                <form
                  onSubmit={(e: FormEvent) => {
                    e.preventDefault();
                    runStudio("outline", { topic, field, level, methodology, objectives });
                  }}
                  className="space-y-4"
                >
                  <label className={labelCls}>
                    Research topic *
                    <input value={topic} onChange={(e) => setTopic(e.target.value)} required className={inputCls} />
                  </label>
                  <label className={labelCls}>
                    Field / discipline
                    <input value={field} onChange={(e) => setField(e.target.value)} placeholder="Business, Education, CS" className={inputCls} />
                  </label>
                  <label className={labelCls}>
                    Level
                    <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="postgraduate">Postgraduate</option>
                      <option value="phd">PhD</option>
                    </select>
                  </label>
                  <label className={labelCls}>
                    Methodology
                    <input value={methodology} onChange={(e) => setMethodology(e.target.value)} className={inputCls} />
                  </label>
                  <label className={labelCls}>
                    Objectives
                    <input value={objectives} onChange={(e) => setObjectives(e.target.value)} className={inputCls} />
                  </label>
                  <button type="submit" disabled={loading} className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60">
                    {loading ? "Generating…" : "Generate outline"}
                  </button>
                </form>
              )}

              {tab === "chapter" && (
                <form
                  onSubmit={(e: FormEvent) => {
                    e.preventDefault();
                    runStudio("chapter", { topic, field, chapter, notes });
                  }}
                  className="space-y-4"
                >
                  <label className={labelCls}>
                    Research topic *
                    <input value={topic} onChange={(e) => setTopic(e.target.value)} required className={inputCls} />
                  </label>
                  <label className={labelCls}>
                    Field
                    <input value={field} onChange={(e) => setField(e.target.value)} className={inputCls} />
                  </label>
                  <label className={labelCls}>
                    Chapter
                    <select value={chapter} onChange={(e) => setChapter(e.target.value)} className={inputCls}>
                      <option value="1">Chapter 1 — Introduction</option>
                      <option value="2">Chapter 2 — Literature</option>
                      <option value="3">Chapter 3 — Methodology</option>
                      <option value="4">Chapter 4 — Results</option>
                      <option value="5">Chapter 5 — Conclusion</option>
                    </select>
                  </label>
                  <label className={labelCls}>
                    Notes
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputCls} />
                  </label>
                  <button type="submit" disabled={loading} className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60">
                    {loading ? "Generating…" : "Draft chapter scaffold"}
                  </button>
                </form>
              )}

              {tab === "abstract" && (
                <form
                  onSubmit={(e: FormEvent) => {
                    e.preventDefault();
                    runStudio("abstract", { topic, field, method, keyFinding });
                  }}
                  className="space-y-4"
                >
                  <label className={labelCls}>
                    Research topic *
                    <input value={topic} onChange={(e) => setTopic(e.target.value)} required className={inputCls} />
                  </label>
                  <label className={labelCls}>
                    Field
                    <input value={field} onChange={(e) => setField(e.target.value)} className={inputCls} />
                  </label>
                  <label className={labelCls}>
                    Method
                    <input value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls} />
                  </label>
                  <label className={labelCls}>
                    Key finding
                    <input value={keyFinding} onChange={(e) => setKeyFinding(e.target.value)} className={inputCls} />
                  </label>
                  <button type="submit" disabled={loading} className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60">
                    {loading ? "Generating…" : "Generate abstract"}
                  </button>
                </form>
              )}

              {tab === "demo" && (
                <div className="space-y-4">
                  <p className="text-[14px] text-[#a1a1a6]">Walk through how students use the studio.</p>
                  {demoSteps.map((s, i) => (
                    <button
                      key={s.title}
                      type="button"
                      onClick={() => setDemoStep(i)}
                      className={`w-full rounded-2xl border p-4 text-left ${
                        demoStep === i ? "border-[#ff8c14]/50 bg-[#ff8c14]/10" : "border-white/10 bg-black/20"
                      }`}
                    >
                      <p className="text-[14px] font-semibold text-white">{s.title}</p>
                      <p className="mt-1 text-[13px] text-[#a1a1a6]">{s.body}</p>
                    </button>
                  ))}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link href="/students/analyzer" className="rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black">
                      Open analyzer
                    </Link>
                    <Link href="/students/projects" className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white">
                      Project portal
                    </Link>
                  </div>
                </div>
              )}

              {tab === "templates" && (
                <div className="space-y-4">
                  {RESEARCH_TEMPLATES.map((t) => (
                    <div key={t.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-[14px] font-semibold text-white">{t.name}</p>
                          <p className="mt-1 text-[13px] text-[#a1a1a6]">{t.blurb}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#ff8c14]">
                          {templatePriceLabel(t)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOutput(t.fullMarkdown)}
                        className="mt-3 text-[13px] font-semibold text-[#2997ff] hover:underline"
                      >
                        Preview / copy →
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {error && <p className="mt-4 text-[13px] text-red-400">{error}</p>}
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold uppercase tracking-wider text-[#a1a1a6]">Output</p>
                {output && (
                  <button type="button" onClick={copyOut} className="rounded-full border border-white/15 px-3 py-1 text-[12px] font-semibold text-white">
                    {copied ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
              {output ? (
                <pre className="mt-4 max-h-[70vh] overflow-auto whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-[#e8e8ed]">{output}</pre>
              ) : (
                <p className="mt-8 text-[14px] text-[#6b7280]">Your generated content appears here.</p>
              )}
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Link href="/students/analyzer" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-[#ff8c14]/40">
              <p className="text-[15px] font-semibold text-white">Questionnaire analyzer</p>
              <p className="mt-1 text-[13px] text-[#a1a1a6]">CSV → tables + narrative</p>
            </Link>
            <Link href="/students/citations" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-[#ff8c14]/40">
              <p className="text-[15px] font-semibold text-white">Citation formatter</p>
              <p className="mt-1 text-[13px] text-[#a1a1a6]">APA · MLA · Chicago · Harvard</p>
            </Link>
            <Link href="/students/cover-letter" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-[#ff8c14]/40">
              <p className="text-[15px] font-semibold text-white">Cover letter AI</p>
              <p className="mt-1 text-[13px] text-[#a1a1a6]">Job-ready draft in seconds</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
