"use client";

import type { ReactNode } from "react";
import type { OpsWorkspace } from "@/lib/ops/types";

export function normalizeWs(w: OpsWorkspace): OpsWorkspace {
  return {
    ...w,
    profile: w.profile || {},
    tasks: w.tasks || [],
  };
}

export function Panel({
  title,
  children,
  action,
  actionLabel,
}: {
  title: string;
  children: ReactNode;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <section className="rounded-xl border border-white/[0.06] bg-[#0c1220] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {action && actionLabel && (
          <button type="button" onClick={action} className="text-[11px] font-medium text-[#ff8c14]">
            {actionLabel} →
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-[13px] text-white/40">{children}</p>;
}

export function StatusPill({ status }: { status: string }) {
  const color =
    status === "paid"
      ? "bg-emerald-500/15 text-emerald-400"
      : status === "overdue"
        ? "bg-red-500/15 text-red-400"
        : "bg-[#ff8c14]/15 text-[#ff8c14]";
  return (
    <span className={`ml-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${color}`}>
      {status}
    </span>
  );
}
