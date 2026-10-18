"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/useAdminSession";

export default function AdminOrdersPage() {
  const session = useAdminSession();
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    if (!session.isAdmin) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hub?section=orders", { headers: { ...session.authHeaders() } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
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

  const revenue = orders.reduce((s, o) => s + Number(o.amount_ngn || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">Sales</p>
          <h1 className="mt-1 font-display text-[24px] font-semibold text-white">Orders</h1>
          <p className="mt-1 text-[13px] text-[#86868b]">{orders.length} orders · ₦{Math.round(revenue).toLocaleString("en-NG")} listed</p>
        </div>
        <button type="button" onClick={() => load()} disabled={loading} className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white disabled:opacity-50">{loading ? "Loading…" : "Refresh"}</button>
      </div>
      {err ? <p className="text-sm text-red-300">{err}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-white/[0.04] text-[11px] uppercase text-[#86868b]">
            <tr>
              <th className="px-3 py-2.5">Product</th>
              <th className="px-3 py-2.5">Buyer</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={String(o.id)} className="border-t border-white/5">
                <td className="px-3 py-3 text-white">{String(o.product_name || o.id)}</td>
                <td className="px-3 py-3 text-[#a1a1a6]">{String(o.buyer_email || "—")}</td>
                <td className="px-3 py-3 text-[#a1a1a6]">{String(o.status || "—")}</td>
                <td className="px-3 py-3 text-white">₦{Number(o.amount_ngn || 0).toLocaleString("en-NG")}</td>
              </tr>
            ))}
            {!loading && !orders.length ? (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-[#86868b]">No orders yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
