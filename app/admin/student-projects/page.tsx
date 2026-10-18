"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

type Project = {
  id: string;
  request_id: string;
  package_name: string;
  stage: string;
  status: string;
  name: string;
  email: string;
  amount_ngn: number;
  created_at: string;
  topic?: string;
};

export default function AdminStudentProjectsPage() {
  const session = useAdminSession();
  const [rows, setRows] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/students/projects/admin", {
        headers: { ...session.authHeaders() },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load projects");
      setRows(json.projects || json.data || []);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session.isAdmin) void load();
  }, [session.isAdmin, load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">
            Pipeline
          </p>
          <h1 className="mt-1 font-display text-[24px] font-semibold text-white">
            Student projects
          </h1>
          <p className="mt-1 text-[13px] text-[#86868b]">
            Session auth only — admin lead key not required
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white disabled:opacity-50"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {err ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {err}
        </p>
      ) : null}

      <div className="space-y-2">
        {rows.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-white">{p.name}</p>
                <p className="text-[12px] text-[#a1a1a6]">
                  {p.request_id} · {p.package_name}
                </p>
                {p.topic ? (
                  <p className="mt-1 text-[12px] text-[#86868b]">{p.topic}</p>
                ) : null}
              </div>
              <div className="text-right">
                <p className="text-[12px] text-[#ff8c14]">{p.status}</p>
                <p className="text-[11px] text-[#86868b]">{p.stage}</p>
                <p className="mt-1 text-[12px] text-white">
                  ₦{Number(p.amount_ngn || 0).toLocaleString("en-NG")}
                </p>
              </div>
            </div>
          </div>
        ))}
        {!loading && rows.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[#86868b]">No projects yet.</p>
        ) : null}
      </div>
    </div>
  );
}
