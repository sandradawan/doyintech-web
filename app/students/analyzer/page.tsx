"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

type AnalysisResult = {
  rowCount: number;
  columnCount: number;
  narrative: string;
  tablesMarkdown: string;
  columns: {
    name: string;
    kind: string;
    n: number;
    mean?: number;
    sd?: number;
    frequencies?: { value: string; count: number; pct: number }[];
  }[];
};

export default function AnalyzerPage() {
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setCsvText(await file.text());
  }

  async function runAnalysis(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/students/analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed");
        return;
      }
      setResult(data.result);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[900px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/students" className="text-[#2997ff] hover:underline">Students</Link>
            {" "}/ Analyzer
          </p>
          <h1 className="mt-3 font-display text-[32px] font-semibold text-white">Questionnaire analyzer</h1>
          <p className="mt-3 text-[15px] text-[#a1a1a6]">Upload or paste CSV questionnaire responses.</p>

          <form onSubmit={runAnalysis} className="mt-10 space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-white/20 px-4 py-10 text-center">
              <span className="text-[14px] font-semibold text-white">{fileName || "Choose CSV file"}</span>
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
            </label>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={6}
              placeholder="Or paste CSV here..."
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 font-mono text-[12px] text-white"
            />
            {error && <p className="text-[13px] text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading || !csvText.trim()}
              className="rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Run analysis"}
            </button>
          </form>

          {result && (
            <div className="mt-10 space-y-6">
              <p className="text-[14px] text-[#a1a1a6]">{result.rowCount} rows · {result.columnCount} variables</p>
              <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/40 p-6 text-[14px] text-[#e8e8ed]">{result.narrative}</pre>
              <Link href="/students/projects" className="inline-block text-[14px] font-semibold text-[#25D366] hover:underline">
                Need full statistical project support? Open portal
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
