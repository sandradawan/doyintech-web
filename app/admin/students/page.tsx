"use client";

import { useEffect, useMemo, useState } from "react";
import { PROJECT_STAGES, stageLabel } from "@/lib/students/packages";

const SECRET_KEY = "doyin_admin_leads_secret";

type Project = {
  id: string;
  request_id: string;
  package_name: string;
  stage: string;
  status: string;
  name: string;
  email: string;
  phone?: string | null;
  topic: string;
  amount_ngn: number;
  deposit_ngn?: number | null;
  balance_ngn?: number | null;
  amount_paid_ngn?: number | null;
  delivery_url?: string | null;
  delivery_unlocked?: boolean | null;
  school?: string | null;
  level?: string | null;
  deadline?: string | null;
  notes?: string | null;
  admin_notes?: string | null;
  created_at: string;
};

const STATUSES = [
  "pending_payment",
  "deposit_paid",
  "in_progress",
  "awaiting_balance",
  "fully_paid",
  "completed",
  "cancelled",
  "paid",
] as const;

export default function AdminStudentsPage() {
  const [secret, setSecret] = useState("");
  const [rows, setRows] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [q, setQ] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [sendingLink, setSendingLink] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deliveryDraft, setDeliveryDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(SECRET_KEY);
      if (s) setSecret(s);
    } catch {
      /* ignore */
    }
  }, []);

  async function load(override?: string) {
    const s = override ?? secret;
    if (!s) return;
    setLoading(true);
    setError("");
    try {
      sessionStorage.setItem(SECRET_KEY, s);
    } catch {
      /* ignore */
    }
    try {
      const res = await fetch("/api/students/projects/admin", {
        headers: { "x-admin-secret": s },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unauthorized");
        setRows([]);
        return;
      }
      setRows(data.projects || []);
      if (data.note) setError(data.note);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function patch(
    id: string,
    body: {
      stage?: string;
      status?: string;
      admin_notes?: string;
      delivery_url?: string;
    }
  ) {
    setUpdating(id);
    setError("");
    setOkMsg("");
    try {
      const res = await fetch("/api/students/projects/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ id, ...body }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Update failed");
        return;
      }
      const data = await res.json();
      if (data.balanceEmailSent) {
        setOkMsg("Stage updated · balance-due email sent to student");
      }
      await load();
    } catch {
      setError("Update failed");
    } finally {
      setUpdating(null);
    }
  }

  async function sendPaymentLink(id: string) {
    setSendingLink(id);
    setError("");
    setOkMsg("");
    try {
      const res = await fetch("/api/students/projects/admin/send-payment-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send payment link");
        return;
      }
      const phaseLabel = data.phase === "deposit" ? "deposit" : "balance";
      setOkMsg(
        data.emailed
          ? `Payment link (${phaseLabel}, ₦${Number(data.amountNgn).toLocaleString()}) emailed to ${data.email}`
          : `Link created but email may have failed. Copy: ${data.authorizationUrl}`
      );
      await load();
    } catch {
      setError("Network error sending payment link");
    } finally {
      setSendingLink(null);
    }
  }

  const filtered = useMemo(() => {
    let list = rows;
    if (filterStatus) list = list.filter((r) => r.status === filterStatus);
    if (filterStage) list = list.filter((r) => r.stage === filterStage);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.request_id.toLowerCase().includes(t) ||
          r.name.toLowerCase().includes(t) ||
          r.email.toLowerCase().includes(t) ||
          (r.topic || "").toLowerCase().includes(t)
      );
    }
    return list;
  }, [rows, filterStatus, filterStage, q]);

  const counts = useMemo(() => {
    const c = {
      total: rows.length,
      pending_payment: 0,
      deposit_paid: 0,
      awaiting_balance: 0,
      fully_paid: 0,
    };
    for (const r of rows) {
      if (r.status === "pending_payment") c.pending_payment++;
      if (
        r.status === "deposit_paid" ||
        r.status === "in_progress" ||
        r.status === "paid"
      )
        c.deposit_paid++;
      if (r.status === "awaiting_balance") c.awaiting_balance++;
      if (
        r.status === "fully_paid" ||
        r.status === "completed" ||
        r.delivery_unlocked
      )
        c.fully_paid++;
    }
    return c;
  }, [rows]);

  function waLink(p: Project) {
    const phone = (p.phone || "").replace(/\D/g, "");
    if (!phone) return null;
    const text = encodeURIComponent(
      `Hi ${p.name}, re your DoyinTech project ${p.request_id} (${p.package_name}).`
    );
    const n = phone.startsWith("234") ? phone : phone.replace(/^0/, "234");
    return `https://wa.me/${n}?text=${text}`;
  }

  function canSendPaymentLink(p: Project) {
    if (p.delivery_unlocked) return false;
    if (p.status === "fully_paid" || p.status === "completed") return false;
    if (p.status === "cancelled") return false;
    return true;
  }

  function paymentLinkLabel(p: Project) {
    if (p.status === "pending_payment") return "Send deposit link";
    return "Send balance link";
  }

  return (
    <main className="pb-20 pt-8 lg:pt-10">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#ff8c14]">
              Pipeline
            </p>
            <h1 className="mt-1 font-display text-[26px] font-semibold text-white sm:text-[30px]">
              Student projects
            </h1>
            <p className="mt-1 text-[13px] text-[#a1a1a6]">
              50% deposit → work → mark Delivered → send payment link → unlock
              download.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="min-w-[160px] rounded-xl border border-white/15 bg-[#141a28] px-4 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
            />
            <button
              type="button"
              onClick={() => load()}
              disabled={loading || !secret}
              className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load"}
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {okMsg && <p className="mt-4 text-sm text-emerald-400">{okMsg}</p>}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniKpi label="Total" value={counts.total} />
          <MiniKpi
            label="Awaiting deposit"
            value={counts.pending_payment}
            accent
          />
          <MiniKpi label="Deposit paid" value={counts.deposit_paid} />
          <MiniKpi label="Awaiting balance" value={counts.awaiting_balance} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ID, name, email, topic…"
            className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white"
          >
            <option value="">All stages</option>
            {PROJECT_STAGES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 space-y-3">
          {filtered.length === 0 && !loading && (
            <p className="rounded-2xl border border-white/10 bg-[#141416] px-5 py-8 text-center text-[13px] text-[#86868b]">
              No projects yet.
            </p>
          )}
          {filtered.map((p) => {
            const open = expanded === p.id;
            const wa = waLink(p);
            const dep =
              p.deposit_ngn ?? Math.round(Number(p.amount_ngn || 0) / 2);
            const bal = p.balance_ngn ?? Number(p.amount_ngn || 0) - dep;
            const paid = Number(p.amount_paid_ngn || 0);
            return (
              <div
                key={p.id}
                className="rounded-2xl border border-white/10 bg-[#141416] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[13px] font-semibold text-[#ff8c14]">
                        {p.request_id}
                      </span>
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[#a1a1a6]">
                        {p.status}
                      </span>
                      <span className="rounded-full border border-[#ff8c14]/30 bg-[#ff8c14]/10 px-2 py-0.5 text-[10px] text-[#ff8c14]">
                        {stageLabel(p.stage)}
                      </span>
                      {p.delivery_unlocked && (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                          unlocked
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[15px] font-medium text-white">
                      {p.name} · {p.package_name}
                    </p>
                    <p className="mt-0.5 truncate text-[13px] text-[#a1a1a6]">
                      {p.topic}
                    </p>
                    <p className="mt-1 text-[12px] text-[#86868b]">
                      Total ₦{Number(p.amount_ngn || 0).toLocaleString()} · Paid
                      ₦{paid.toLocaleString()} · Dep ₦{dep.toLocaleString()} ·
                      Bal ₦{bal.toLocaleString()} · {p.email}
                      {p.phone ? ` · ${p.phone}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-emerald-500/40 px-3 py-1.5 text-[12px] text-emerald-400 hover:bg-emerald-500/10"
                      >
                        WhatsApp
                      </a>
                    )}
                    {canSendPaymentLink(p) && (
                      <button
                        type="button"
                        disabled={sendingLink === p.id || !secret}
                        onClick={() => sendPaymentLink(p.id)}
                        className="rounded-full border border-[#ff8c14]/50 bg-[#ff8c14]/15 px-3 py-1.5 text-[12px] font-medium text-[#ff8c14] hover:bg-[#ff8c14]/25 disabled:opacity-50"
                      >
                        {sendingLink === p.id
                          ? "Sending…"
                          : paymentLinkLabel(p)}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setExpanded(open ? null : p.id);
                        if (!open && p.delivery_url) {
                          setDeliveryDraft((d) => ({
                            ...d,
                            [p.id]: p.delivery_url || "",
                          }));
                        }
                      }}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-[#a1a1a6] hover:text-white"
                    >
                      {open ? "Close" : "Manage"}
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] uppercase tracking-wide text-[#86868b]">
                        Stage
                      </label>
                      <select
                        value={p.stage}
                        disabled={updating === p.id}
                        onChange={(e) =>
                          patch(p.id, { stage: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                      >
                        {PROJECT_STAGES.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[11px] text-[#86868b]">
                        Set to &quot;Ready — pay balance&quot; when work is done,
                        then use <strong>Send balance link</strong>.
                      </p>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wide text-[#86868b]">
                        Status
                      </label>
                      <select
                        value={p.status}
                        disabled={updating === p.id}
                        onChange={(e) =>
                          patch(p.id, { status: e.target.value })
                        }
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {canSendPaymentLink(p) && (
                      <div className="sm:col-span-2 rounded-xl border border-[#ff8c14]/25 bg-[#ff8c14]/5 px-4 py-3">
                        <p className="text-[13px] font-medium text-white">
                          Email Paystack payment link
                        </p>
                        <p className="mt-1 text-[12px] text-[#a1a1a6]">
                          {p.status === "pending_payment"
                            ? `Sends 50% deposit link (₦${dep.toLocaleString()}) to ${p.email}`
                            : `Sends final 50% balance link (₦${bal.toLocaleString()}) to ${p.email}`}
                        </p>
                        <button
                          type="button"
                          disabled={sendingLink === p.id || !secret}
                          onClick={() => sendPaymentLink(p.id)}
                          className="mt-3 rounded-full bg-[#ff8c14] px-4 py-2 text-[12px] font-semibold text-black hover:bg-[#ffa03a] disabled:opacity-50"
                        >
                          {sendingLink === p.id
                            ? "Creating & sending…"
                            : paymentLinkLabel(p)}
                        </button>
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="text-[11px] uppercase tracking-wide text-[#86868b]">
                        Delivery URL (Google Drive / Dropbox link)
                      </label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <input
                          value={
                            deliveryDraft[p.id] ?? p.delivery_url ?? ""
                          }
                          onChange={(e) =>
                            setDeliveryDraft((d) => ({
                              ...d,
                              [p.id]: e.target.value,
                            }))
                          }
                          placeholder="https://drive.google.com/..."
                          className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#ff8c14]"
                        />
                        <button
                          type="button"
                          disabled={updating === p.id}
                          onClick={() =>
                            patch(p.id, {
                              delivery_url:
                                deliveryDraft[p.id] ?? p.delivery_url ?? "",
                            })
                          }
                          className="rounded-full border border-white/15 px-4 py-2 text-[12px] text-white hover:bg-white/5"
                        >
                          Save link
                        </button>
                      </div>
                      <p className="mt-1 text-[11px] text-[#86868b]">
                        Student only sees this after final 50% is paid.
                      </p>
                    </div>
                    {(p.school || p.level || p.deadline || p.notes) && (
                      <div className="sm:col-span-2 rounded-xl border border-white/5 bg-black/30 px-3 py-2 text-[12px] text-[#a1a1a6]">
                        {p.school && <p>School: {p.school}</p>}
                        {p.level && <p>Level: {p.level}</p>}
                        {p.deadline && <p>Deadline: {p.deadline}</p>}
                        {p.notes && <p className="mt-1">Notes: {p.notes}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function MiniKpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 ${
        accent
          ? "border-[#ff8c14]/40 bg-[#ff8c14]/10"
          : "border-white/10 bg-[#141416]"
      }`}
    >
      <p className="text-[22px] font-semibold text-white">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-[#86868b]">
        {label}
      </p>
    </div>
  );
}
