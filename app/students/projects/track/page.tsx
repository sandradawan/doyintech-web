"use client";

import {
  useCallback,
  useEffect,
  useState,
  Suspense,
  type FormEvent,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { PROJECT_STAGES } from "@/lib/students/packages";

type Project = {
  request_id: string;
  package_name: string;
  amount_ngn?: number;
  deposit_ngn?: number;
  balance_ngn?: number;
  amount_paid_ngn?: number;
  stage: string;
  stage_label?: string;
  status: string;
  topic: string;
  name: string;
  email: string;
  school?: string;
  deadline?: string;
  delivery_url?: string | null;
  delivery_unlocked?: boolean;
  can_pay_balance?: boolean;
};

type Msg = { id?: string; author: string; body: string; created_at: string };
type Ev = { stage: string; note?: string; created_at: string };

function TrackInner() {
  const sp = useSearchParams();
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [events, setEvents] = useState<Ev[]>([]);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [paying, setPaying] = useState(false);
  const [okMsg, setOkMsg] = useState("");

  useEffect(() => {
    const q = sp.get("id");
    if (q) setId(q.toUpperCase());
  }, [sp]);

  const load = useCallback(async () => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    setOkMsg("");
    try {
      const q = new URLSearchParams({ id: id.trim().toUpperCase() });
      if (email.trim()) q.set("email", email.trim());
      const res = await fetch(`/api/students/projects/track?${q}`);
      const data = await res.json();
      if (!res.ok) {
        setProject(null);
        setError(data.error || "Not found");
        return;
      }
      setProject(data.project);
      setMessages(data.messages || []);
      setEvents(data.events || []);
      if (sp.get("paid") === "1") {
        setOkMsg("Deposit payment received (or processing). Refresh if status still shows pending.");
      }
      if (sp.get("balance") === "1") {
        setOkMsg("Final payment received (or processing). Download unlocks when confirmed.");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [id, email, sp]);

  useEffect(() => {
    if (sp.get("id")) load();
  }, [sp, load]);

  async function sendFeedback(e: FormEvent) {
    e.preventDefault();
    if (!project) return;
    setSending(true);
    setOkMsg("");
    setError("");
    try {
      const res = await fetch("/api/students/projects/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: project.request_id,
          email: email || project.email,
          message: feedback,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send");
        return;
      }
      setFeedback("");
      setOkMsg("Feedback sent. We will review and update the stage.");
      await load();
    } catch {
      setError("Network error");
    } finally {
      setSending(false);
    }
  }

  async function payBalance() {
    if (!project) return;
    setPaying(true);
    setError("");
    setOkMsg("");
    try {
      const res = await fetch("/api/students/projects/pay-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: project.request_id,
          email: email || project.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start payment");
        return;
      }
      if (data.alreadyPaid) {
        setOkMsg(data.message || "Already paid");
        await load();
        return;
      }
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }
      if (data.whatsapp) {
        window.open(data.whatsapp, "_blank");
      }
    } catch {
      setError("Network error");
    } finally {
      setPaying(false);
    }
  }

  const total = Number(project?.amount_ngn || 0);
  const deposit = Number(
    project?.deposit_ngn ?? (total ? Math.round(total / 2) : 0)
  );
  const balance = Number(
    project?.balance_ngn ?? (total ? total - deposit : 0)
  );
  const paid = Number(project?.amount_paid_ngn || 0);

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto max-w-[720px] px-5 sm:px-6">
        <p className="text-[13px] text-[#a1a1a6]">
          <Link href="/students" className="text-[#2997ff] hover:underline">
            Students
          </Link>{" "}
          / Track project
        </p>
        <h1 className="mt-3 font-display text-[28px] font-semibold tracking-tight text-[#f5f5f7] sm:text-[34px]">
          Track your research project
        </h1>
        <p className="mt-2 text-[14px] text-[#a1a1a6]">
          Enter your Request ID (DT-PRJ-YYYY-NNNN). Optional email helps confirm
          ownership.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={id}
            onChange={(e) => setId(e.target.value.toUpperCase())}
            placeholder="DT-PRJ-2026-0001"
            className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            type="email"
            className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
          />
          <button
            type="button"
            onClick={load}
            disabled={loading || !id.trim()}
            className="rounded-full bg-[#ff8c14] px-6 py-2.5 text-[14px] font-semibold text-black hover:bg-[#ffa03a] disabled:opacity-60"
          >
            {loading ? "Loading…" : "Track"}
          </button>
        </div>

        {error && <p className="mt-4 text-[13px] text-red-400">{error}</p>}
        {okMsg && (
          <p className="mt-4 text-[13px] text-[#25D366]">{okMsg}</p>
        )}

        {project && (
          <div className="mt-10 space-y-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#ff8c14]">
                    {project.request_id}
                  </p>
                  <h2 className="mt-1 font-display text-[20px] font-semibold text-white">
                    {project.package_name}
                  </h2>
                  <p className="mt-1 text-[14px] text-[#a1a1a6]">
                    {project.topic}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] text-[#a1a1a6]">Stage</p>
                  <p className="text-[16px] font-semibold text-white">
                    {project.stage_label || project.stage}
                  </p>
                  <p className="text-[12px] text-[#86868b]">{project.status}</p>
                </div>
              </div>

              {/* Payment summary */}
              <div className="mt-5 grid gap-2 rounded-xl border border-white/10 bg-black/30 p-4 text-[13px] sm:grid-cols-3">
                <div>
                  <p className="text-[11px] uppercase text-[#86868b]">Total</p>
                  <p className="font-semibold text-white">
                    ₦{total.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-[#86868b]">
                    Paid so far
                  </p>
                  <p className="font-semibold text-[#25D366]">
                    ₦{paid.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-[#86868b]">
                    Balance due
                  </p>
                  <p className="font-semibold text-white">
                    ₦
                    {project.delivery_unlocked
                      ? "0"
                      : Math.max(0, balance).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-[13px] text-[#a1a1a6] sm:grid-cols-2">
                <p>Name: {project.name}</p>
                <p>
                  Deposit (50%): ₦{deposit.toLocaleString()} · Final (50%): ₦
                  {balance.toLocaleString()}
                </p>
                {project.school && <p>School: {project.school}</p>}
                {project.deadline && <p>Deadline: {project.deadline}</p>}
              </div>

              {/* Download / pay balance */}
              <div className="mt-5 space-y-3">
                {project.delivery_unlocked && project.delivery_url ? (
                  <a
                    href={project.delivery_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-black hover:bg-[#2ee86f]"
                  >
                    Download your files
                  </a>
                ) : project.delivery_unlocked ? (
                  <p className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-3 text-[13px] text-[#e8e8ed]">
                    Payment complete. Your download link will appear here once
                    we attach the delivery file.
                  </p>
                ) : project.can_pay_balance ? (
                  <div className="rounded-xl border border-[#ff8c14]/40 bg-[#ff8c14]/10 px-4 py-4">
                    <p className="text-[14px] font-semibold text-white">
                      Project ready — pay final 50% to unlock download
                    </p>
                    <p className="mt-1 text-[13px] text-[#a1a1a6]">
                      Balance: ₦{balance.toLocaleString()}. Link stays locked
                      until this payment clears.
                    </p>
                    <button
                      type="button"
                      onClick={payBalance}
                      disabled={paying}
                      className="mt-3 rounded-full bg-[#ff8c14] px-5 py-2.5 text-[13px] font-semibold text-black hover:bg-[#ffa03a] disabled:opacity-60"
                    >
                      {paying
                        ? "Opening Paystack…"
                        : `Pay ₦${balance.toLocaleString()} balance`}
                    </button>
                  </div>
                ) : project.status === "pending_payment" ? (
                  <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[13px] text-[#e8e8ed]">
                    Awaiting 50% deposit (₦{deposit.toLocaleString()}). Complete
                    payment to start the project.
                  </p>
                ) : (
                  <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] text-[#a1a1a6]">
                    Work in progress. When the draft is ready, you can pay the
                    final 50% here to unlock download.
                  </p>
                )}
              </div>

              <div className="mt-6">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#a1a1a6]">
                  Pipeline
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PROJECT_STAGES.map((s) => {
                    const active = s.code === project.stage;
                    const past =
                      PROJECT_STAGES.findIndex((x) => x.code === project.stage) >=
                      PROJECT_STAGES.findIndex((x) => x.code === s.code);
                    return (
                      <span
                        key={s.code}
                        className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                          active
                            ? "bg-[#ff8c14] text-black"
                            : past
                              ? "bg-white/10 text-white"
                              : "bg-white/5 text-[#86868b]"
                        }`}
                      >
                        {s.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {events.length > 0 && (
              <div>
                <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#a1a1a6]">
                  Timeline
                </h3>
                <ul className="mt-3 space-y-2 text-[13px] text-[#a1a1a6]">
                  {events.map((ev, i) => (
                    <li key={i}>
                      {new Date(ev.created_at).toLocaleString()} — {ev.stage}
                      {ev.note ? `: ${ev.note}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[#a1a1a6]">
                Feedback & corrections
              </h3>
              <div className="mt-3 space-y-3">
                {messages.length === 0 && (
                  <p className="text-[13px] text-[#86868b]">No messages yet.</p>
                )}
                {messages.map((m, i) => (
                  <div
                    key={m.id || i}
                    className={`rounded-xl border px-4 py-3 text-[13px] ${
                      m.author === "student"
                        ? "border-white/10 bg-white/[0.04] text-[#e8e8ed]"
                        : "border-[#2997ff]/20 bg-[#2997ff]/10 text-[#e8e8ed]"
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase text-[#a1a1a6]">
                      {m.author} · {new Date(m.created_at).toLocaleString()}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={sendFeedback} className="mt-4 space-y-3">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  required
                  placeholder="Describe corrections or questions…"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-white/5 disabled:opacity-60"
                >
                  {sending ? "Sending…" : "Send feedback"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function TrackPage() {
  return (
    <>
      <Suspense
        fallback={
          <main className="px-5 pb-24 pt-28 text-[#a1a1a6]">Loading…</main>
        }
      >
        <TrackInner />
      </Suspense>
      <Footer />
    </>
  );
}
