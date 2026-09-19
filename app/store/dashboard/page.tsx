"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/store/DashboardShell";
import { loadSession } from "@/lib/store/session";
import type { StoreListing } from "@/lib/store/types";
import { formatNgn } from "@/lib/store/catalog";

export default function DeveloperDashboardPage() {
  const [listings, setListings] = useState<StoreListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    const s = loadSession();
    if (!s?.email) return;
    setPending(s.membershipStatus === "pending");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/store/my-listings", {
        headers: { "x-developer-email": s.email },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setListings(data.listings || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = {
    total: listings.length,
    approved: listings.filter((l) => l.reviewStatus === "approved").length,
    inReview: listings.filter((l) =>
      ["submitted", "scanning", "in_review", "changes_requested"].includes(l.reviewStatus)
    ).length,
  };

  return (
    <DashboardShell role="developer">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="mt-1 text-sm text-[#94a3b8]">
          Manage your apps, track review status, and publish after approval.
        </p>
      </div>

      {pending && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-100">
          <strong className="text-amber-200">Pending approval.</strong> Your developer account is
          under review. Publishing unlocks after an admin activates your account.
        </div>
      )}

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Your apps", value: counts.total },
          { label: "Live", value: counts.approved },
          { label: "In review", value: counts.inReview },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-white/[0.08] bg-[#0c1220] px-5 py-4"
          >
            <p className="text-2xl font-semibold text-white">{c.value}</p>
            <p className="text-[12px] text-[#64748b]">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Your listings</h2>
        <Link
          href={pending ? "#" : "/store/dashboard/submit"}
          onClick={(e) => {
            if (pending) {
              e.preventDefault();
              alert("Account pending approval. You cannot publish yet.");
            }
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            pending
              ? "cursor-not-allowed bg-white/10 text-[#64748b]"
              : "bg-[#ff8c14] text-black hover:bg-[#ffa03a]"
          }`}
        >
          Submit new app
        </Link>
      </div>

      {loading && <p className="text-sm text-[#64748b]">Loading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {!loading && listings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/15 bg-[#0c1220]/50 px-6 py-12 text-center">
          <p className="text-[#94a3b8]">No apps yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {listings.map((l) => (
          <article
            key={l.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0c1220] px-5 py-4"
          >
            <div>
              <p className="font-medium text-white">{l.title}</p>
              <p className="mt-0.5 text-[12px] text-[#64748b]">
                {l.platform} · {formatNgn(l.priceNgn)} · v{l.version}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                l.reviewStatus === "approved"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : l.reviewStatus === "rejected"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-amber-500/15 text-amber-300"
              }`}
            >
              {l.reviewStatus}
            </span>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
