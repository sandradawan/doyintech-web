"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

export default function CitationsPage() {
  const [style, setStyle] = useState("apa");
  const [type, setType] = useState("journal");
  const [authors, setAuthors] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [journal, setJournal] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");
  const [url, setUrl] = useState("");
  const [accessed, setAccessed] = useState("");
  const [place, setPlace] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCopied(false);
    try {
      const res = await fetch("/api/students/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "citation",
          style,
          type,
          authors,
          title,
          year,
          publisher,
          journal,
          volume,
          issue,
          pages,
          url,
          accessed,
          place,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
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

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white";

  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[720px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/students" className="text-[#2997ff] hover:underline">
              Students
            </Link>{" "}
            / Citations
          </p>
          <h1 className="mt-3 font-display text-[32px] font-semibold text-white">Citation formatter</h1>
          <p className="mt-3 text-[15px] text-[#a1a1a6]">
            Format references in APA, MLA, Chicago, or Harvard. Free — no signup.
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[12px] font-medium text-[#a1a1a6]">
                Style
                <select value={style} onChange={(e) => setStyle(e.target.value)} className={inputCls}>
                  <option value="apa">APA</option>
                  <option value="mla">MLA</option>
                  <option value="chicago">Chicago</option>
                  <option value="harvard">Harvard</option>
                </select>
              </label>
              <label className="block text-[12px] font-medium text-[#a1a1a6]">
                Source type
                <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
                  <option value="journal">Journal article</option>
                  <option value="book">Book</option>
                  <option value="website">Website</option>
                  <option value="thesis">Thesis</option>
                </select>
              </label>
            </div>
            <label className="block text-[12px] font-medium text-[#a1a1a6]">
              Authors *
              <input value={authors} onChange={(e) => setAuthors(e.target.value)} required placeholder="Smith, J. A., & Doe, R." className={inputCls} />
            </label>
            <label className="block text-[12px] font-medium text-[#a1a1a6]">
              Title *
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[12px] font-medium text-[#a1a1a6]">
                Year
                <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className={inputCls} />
              </label>
              <label className="block text-[12px] font-medium text-[#a1a1a6]">
                Pages
                <input value={pages} onChange={(e) => setPages(e.target.value)} placeholder="12–28" className={inputCls} />
              </label>
            </div>
            {type === "journal" && (
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-[12px] font-medium text-[#a1a1a6]">Journal
                  <input value={journal} onChange={(e) => setJournal(e.target.value)} className={inputCls} />
                </label>
                <label className="block text-[12px] font-medium text-[#a1a1a6]">Volume
                  <input value={volume} onChange={(e) => setVolume(e.target.value)} className={inputCls} />
                </label>
                <label className="block text-[12px] font-medium text-[#a1a1a6]">Issue
                  <input value={issue} onChange={(e) => setIssue(e.target.value)} className={inputCls} />
                </label>
              </div>
            )}
            {(type === "book" || type === "thesis") && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[12px] font-medium text-[#a1a1a6]">Publisher / Institution
                  <input value={publisher} onChange={(e) => setPublisher(e.target.value)} className={inputCls} />
                </label>
                <label className="block text-[12px] font-medium text-[#a1a1a6]">Place
                  <input value={place} onChange={(e) => setPlace(e.target.value)} className={inputCls} />
                </label>
              </div>
            )}
            {(type === "website" || type === "journal") && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[12px] font-medium text-[#a1a1a6]">URL
                  <input value={url} onChange={(e) => setUrl(e.target.value)} className={inputCls} />
                </label>
                <label className="block text-[12px] font-medium text-[#a1a1a6]">Accessed
                  <input value={accessed} onChange={(e) => setAccessed(e.target.value)} placeholder="10 Oct 2026" className={inputCls} />
                </label>
              </div>
            )}
            {error && <p className="text-[13px] text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60">
              {loading ? "Formatting…" : "Format citation"}
            </button>
          </form>

          {output && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6">
              <div className="flex justify-between gap-3">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#a1a1a6]">Formatted</p>
                <button type="button" onClick={copyOut} className="text-[12px] font-semibold text-[#2997ff]">
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-[#e8e8ed]">{output}</p>
            </div>
          )}

          <p className="mt-8 text-[13px] text-[#a1a1a6]">
            Also try the{" "}
            <Link href="/students/studio" className="text-[#2997ff] hover:underline">
              AI Project Studio
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
