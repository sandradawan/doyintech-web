"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { STUDENT_PACKAGES, depositNgn, balanceNgn } from "@/lib/students/packages";

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

  const selected = STUDENT_PACKAGES.find((p) => p.id === packageId);

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
      try {
        // Lets /students/projects/track open automatically after Paystack redirects back.
        localStorage.setItem("dt_student_email", email.trim().toLowerCase());
      } catch {
        /* storage unavailable */
      }
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
          <p className="text-[13px] text-brand-muted">
            <Link href="/students" className="text-brand-link hover:underline">
              Students
            </Link>{" "}
            / Research projects
          </p>
          <h1 className="mt-3 font-display text-[32px] font-semibold tracking-tight text-brand-ink sm:text-[40px]">
            Research project portal
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-brand-muted">
            Choose a package (₦15,000–₦30,000). Pay <strong className="text-brand-ink">50% to start</strong>,
            we work on your project, then pay the <strong className="text-brand-ink">final 50%</strong> to
            unlock your download link.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {STUDENT_PACKAGES.map((p) => {
              const dep = depositNgn(p);
              const bal = balanceNgn(p);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPackageId(p.id)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    packageId === p.id
                      ? "border-brand-link bg-brand-link/10"
                      : "border-brand-ink/10 bg-brand-ink/[0.03] hover:border-brand-ink/20"
                  }`}
                >
                  {p.badge && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-link">
                      {p.badge}
                    </span>
                  )}
                  <p className="mt-1 font-display text-[17px] font-semibold text-brand-ink">
                    {p.name}
                  </p>
                  <p className="mt-1 text-[20px] font-semibold text-brand-ink">
                    ₦{p.priceNgn.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[12px] text-brand-muted">
                    Pay now: ₦{dep.toLocaleString()} · Later: ₦{bal.toLocaleString()}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-brand-muted">
                    {p.blurb}
                  </p>
                </button>
              );
            })}
          </div>

          <form
            onSubmit={submit}
            className="mt-10 space-y-5 rounded-3xl border border-brand-ink/10 bg-brand-ink/[0.03] p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[13px] text-brand-muted">
                Full name *
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link/50"
                />
              </label>
              <label className="block text-[13px] text-brand-muted">
                Email *
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link/50"
                />
              </label>
              <label className="block text-[13px] text-brand-muted">
                Phone / WhatsApp
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link/50"
                />
              </label>
              <label className="block text-[13px] text-brand-muted">
                School / institution
                <input
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link/50"
                />
              </label>
              <label className="block text-[13px] text-brand-muted">
                Level (e.g. HND, BSc, MSc)
                <input
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link/50"
                />
              </label>
              <label className="block text-[13px] text-brand-muted">
                Deadline
                <input
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. 15 Nov 2026"
                  className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link/50"
                />
              </label>
            </div>
            <label className="block text-[13px] text-brand-muted">
              Research topic *
              <textarea
                required
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="State your topic clearly…"
                className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link/50"
              />
            </label>
            <label className="block text-[13px] text-brand-muted">
              Notes (scope, chapter needed, tools)
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-brand-ink/10 bg-brand-well px-3 py-2.5 text-[14px] text-brand-ink outline-none focus:border-brand-link/50"
              />
            </label>

            <input
              type="text"
              name="website"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {selected && (
              <div className="rounded-xl border border-brand-link/30 bg-brand-link/10 px-4 py-3 text-[13px] text-brand-soft">
                <p className="font-semibold text-brand-ink">{selected.name}</p>
                <p className="mt-1">
                  Total ₦{selected.priceNgn.toLocaleString()} · Pay now (50%) ₦
                  {depositNgn(selected).toLocaleString()} · Balance later ₦
                  {balanceNgn(selected).toLocaleString()}
                </p>
                <p className="mt-1 text-[12px] text-brand-muted">
                  Download link unlocks only after the final 50% is paid.
                </p>
              </div>
            )}

            {error && <p className="text-[13px] text-red-400">{error}</p>}
            {requestId && (
              <p className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-3 text-[13px] text-brand-soft">
                Request ID: <strong className="text-brand-ink">{requestId}</strong> —
                save this to track your project.{" "}
                <Link
                  href={`/students/projects/track?id=${requestId}`}
                  className="text-brand-link hover:underline"
                >
                  Open tracker
                </Link>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-accent px-6 py-3.5 text-[15px] font-semibold text-black transition hover:bg-brand-accent-hover disabled:opacity-60 sm:w-auto"
            >
              {loading
                ? "Starting…"
                : selected
                  ? `Pay ₦${depositNgn(selected).toLocaleString()} deposit & get Request ID`
                  : "Pay deposit & get Request ID"}
            </button>
            <p className="text-[12px] text-brand-subtle">
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
