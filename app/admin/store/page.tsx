"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAdminSession } from "@/components/admin/useAdminSession";

export default function AdminStorePage() {
  const session = useAdminSession();
  const [listings, setListings] = useState<Array<Record<string, unknown>>>([]);
  const [developers, setDevelopers] = useState<Array<Record<string, unknown>>>([]);
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/hub?section=store", { headers: { ...session.authHeaders() } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setListings(json.listings || []);
      setDevelopers(json.developers || []);
      setOrders(json.orders || []);
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Commerce</p>
          <h1 className="mt-1 font-display text-[24px] font-semibold text-white">DoyinStore</h1>
          <p className="mt-1 text-[13px] text-[#86868b]">Listings, developers, and recent store orders</p>
        </div>
        <div className="flex gap-2">
          <Link href="/store/admin" className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white">Legacy store admin</Link>
          <button type="button" onClick={() => load()} disabled={loading} className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white disabled:opacity-50">{loading ? "Loading…" : "Refresh"}</button>
        </div>
      </div>
      {err ? <p className="text-sm text-red-300">{err}</p> : null}
      <section>
        <h2 className="text-[15px] font-semibold text-white">Listings ({listings.length})</h2>
        <div className="mt-3 space-y-2">
          {listings.slice(0, 40).map((l) => (
            <div key={String(l.id)} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="font-medium text-white">{String(l.title || l.name || l.id)}</p>
              <p className="text-[12px] text-[#a1a1a6]">{String(l.status || "—")} · {String(l.created_at || "")}</p>
            </div>
          ))}
          {!loading && !listings.length ? <p className="text-[13px] text-[#86868b]">No listings yet.</p> : null}
        </div>
      </section>
      <section>
        <h2 className="text-[15px] font-semibold text-white">Developers ({developers.length})</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {developers.map((d) => (
            <div key={String(d.id)} className="rounded-xl border border-white/10 px-4 py-3">
              <p className="text-white">{String(d.display_name)}</p>
              <p className="text-[12px] text-[#a1a1a6]">{String(d.email)}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-[15px] font-semibold text-white">Recent orders ({orders.length})</h2>
        <div className="mt-3 space-y-2">
          {orders.slice(0, 20).map((o) => (
            <div key={String(o.id)} className="rounded-xl border border-white/10 px-4 py-3">
              <p className="text-white">{String(o.product_name || o.id)}</p>
              <p className="text-[12px] text-[#a1a1a6]">{String(o.buyer_email || "")} · {String(o.status || "")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
