"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAdminSession } from "@/components/admin/useAdminSession";

export default function AdminOpsPage() {
  const session = useAdminSession();
  const [workspaces, setWorkspaces] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hub?section=ops", { headers: { ...session.authHeaders() } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setWorkspaces(json.workspaces || []);
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Workspace</p>
          <h1 className="mt-1 font-display text-[24px] font-semibold text-white">DoyinOps</h1>
          <p className="mt-1 text-[13px] text-[#86868b]">SME ops workspaces on the platform</p>
        </div>
        <div className="flex gap-2">
          <Link href="/ops/app" className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white">Open Ops app</Link>
          <button type="button" onClick={() => load()} disabled={loading} className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white disabled:opacity-50">{loading ? "Loading…" : "Refresh"}</button>
        </div>
      </div>
      {err ? <p className="text-sm text-red-300">{err}</p> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {workspaces.map((w) => (
          <div key={String(w.id)} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <p className="font-medium text-white">{String(w.name || w.id)}</p>
            <p className="text-[12px] text-[#86868b]">{String(w.created_at || "")}</p>
          </div>
        ))}
        {!loading && !workspaces.length ? <p className="text-[13px] text-[#86868b]">No workspaces yet.</p> : null}
      </div>
    </div>
  );
}
