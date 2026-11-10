"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";

export default function CoverLetterPage() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [tone, setTone] = useState("professional");
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
        body: JSON.stringify({ mode: "cover_letter", fullName, role, company, experience, skills, tone }),
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

  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[720px] px-5 sm:px-6">
          <p className="text-[13px] text-brand-muted">
            <Link href="/students" className="text-brand-link hover:underline">Students</Link> / Cover letter
          </p>
          <h1 className="mt-3 font-display text-[32px] font-semibold text-brand-ink">AI cover letter</h1>
          <p className="mt-3 text-[15px] text-brand-muted">
            Draft a clear cover letter for internships and graduate roles. Pair with the{" "}
            <Link href="/tools/cv-builder" className="text-brand-link hover:underline">CV builder</Link>.
          </p>
          <form onSubmit={onSubmit} className="mt-10 space-y-4 rounded-3xl border border-brand-ink/10 bg-brand-ink/[0.03] p-6">
            <label className="block text-[12px] font-medium text-brand-muted">Your full name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink" />
            </label>
            <label className="block text-[12px] font-medium text-brand-muted">Role / job title *
              <input value={role} onChange={(e) => setRole(e.target.value)} required className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink" />
            </label>
            <label className="block text-[12px] font-medium text-brand-muted">Company *
              <input value={company} onChange={(e) => setCompany(e.target.value)} required className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink" />
            </label>
            <label className="block text-[12px] font-medium text-brand-muted">Experience highlight
              <textarea value={experience} onChange={(e) => setExperience(e.target.value)} rows={3} placeholder="Final-year project on… internship at…" className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink" />
            </label>
            <label className="block text-[12px] font-medium text-brand-muted">Skills to emphasise
              <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Python, research, communication" className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink" />
            </label>
            <label className="block text-[12px] font-medium text-brand-muted">Tone
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink">
                <option value="professional">Professional</option>
                <option value="confident">Confident</option>
                <option value="warm">Warm</option>
              </select>
            </label>
            {error && <p className="text-[13px] text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="rounded-full bg-brand-accent px-6 py-3 text-[14px] font-semibold text-black disabled:opacity-60">
              {loading ? "Drafting…" : "Generate cover letter"}
            </button>
          </form>
          {output && (
            <div className="mt-8 rounded-2xl border border-brand-ink/10 bg-brand-well p-6">
              <div className="flex justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-muted">Draft</p>
                <button type="button" onClick={copyOut} className="text-[12px] font-semibold text-brand-link">{copied ? "Copied" : "Copy"}</button>
              </div>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-[14px] leading-relaxed text-brand-soft">{output}</pre>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
