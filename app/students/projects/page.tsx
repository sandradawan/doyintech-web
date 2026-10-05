"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { STUDENT_PACKAGES } from "@/lib/students/packages";

export default function StudentProjectsPage() {
  const [packageId, setPackageId] = useState(
    STUDENT_PACKAGES[2]?.id || "student-full"
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [level, setLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/students/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          name,
          email,
          phone,
          school,
          level,
          topic,
          deadline,
          notes,
          website: "",
        }),
      });
      const data = await res.json();
      if (!res.ok && !data.requestId) {
        setError(data.error || "Could not create request");
        return;
      }
      if (data.requestId) setRequestId(data.requestId);
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      if (data.whatsapp) {
        window.open(data.whatsapp, "_blank");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1020px] px-5 sm:px-6">
          <p className="text-[13px] text-[#a1a1a6]">
            <Link href="/students" className="text-[#2997ff] hover:underline">
              Students
            </Link>{" "}
            / Research projects
          </p>
          <h1 className="mt-3 font-display text-[32px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[40px]">
            Research project portal
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#a1a1a6]">
            Tell us your topic, choose a package (₦15,000–₦30,000), pay the start
            fee, and get a Request ID to track stages and send feedback.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {STUDENT_PACKAGES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPackageId(p.id)}
                className={`rounded-2xl border p-5 text-left transition ${
                  packageId === p.id
                    ? "border-[#ff8c14] bg-[#ff8c14]/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                {p.badge && (
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ff8c14]">
                    {p.badge}
                  </span>
                )}
                <p className="mt-1 font-display text-[17px] font-semibold text-white">
                  {p.name}
                </p>
                <p className="mt-1 text-[20px] font-semibold text-[#f5f5f7]">
                  ₦{p.priceNgn.toLocaleString()}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#a1a1a6]">
                  {p.blurb}
                </p>
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-10 space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[13px] text-[#a1a1a6]">
                Full name *
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                Email *
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                Phone / WhatsApp
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                School / institution
                <input
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                Level (e.g. HND, BSc, MSc)
                <input
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                />
              </label>
              <label className="block text-[13px] text-[#a1a1a6]">
                Deadline
                <input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. 15 Nov 2026"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                />
              </label>
            </div>
            <label className="block text-[13px] text-[#a1a1a6]">
              Research topic *
              <textarea
                required
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="State your topic clearly…"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
              />
            </label>
            <label className="block text-[13px] text-[#a1a1a6]">
              Notes (scope, chapter needed, tools)
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
              />
            </label>

            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {error && <p className="text-[13px] text-red-400">{error}</p>}
            {requestId && (
              <p className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-3 text-[13px] text-[#e8e8ed]">
                Request ID: <strong className="text-white">{requestId}</strong> —
                save this to track your project.{" "}
                <Link
                  href={`/students/projects/track?id=${requestId}`}
                  className="text-[#2997ff] hover:underline"
                >
                  Open tracker
                </Link>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#ff8c14] px-6 py-3.5 text-[15px] font-semibold text-black transition hover:bg-[#ffa03a] disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Starting…" : "Pay & get Request ID"}
            </button>
            <p className="text-[12px] text-[#86868b]">
              Academic integrity: deliverables are research support drafts. Follow
              your school’s rules and supervisor guidance.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
