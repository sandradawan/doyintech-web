"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { StoreNav } from "@/components/store/StoreShell";
import { formatNgn } from "@/lib/store/catalog";

type Order = {
  id: string;
  slug: string;
  title: string;
  amountNgn: number;
  status: string;
  createdAt: string;
  downloadUrl: string | null;
  expired: boolean;
};

export default function PurchasesPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(
        `/api/store/orders?email=${encodeURIComponent(email.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOrders(data.orders || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#070b12] pt-24 pb-24">
        <div className="mx-auto max-w-[720px] px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link href="/store" className="text-[14px] text-[#94a3b8] hover:text-white">
              ← Store
            </Link>
            <StoreNav />
          </div>

          <h1 className="text-2xl font-semibold text-white sm:text-3xl">My purchases</h1>
          <p className="mt-2 text-sm text-[#94a3b8]">
            Enter the email used at checkout to retrieve download links. Links expire for security.
          </p>

          <form onSubmit={lookup} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-xl border border-white/12 bg-[#0c1220] px-4 py-3 text-sm text-white outline-none focus:border-[#ff8c14]"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#ff8c14] px-6 py-3 text-sm font-semibold text-black hover:bg-[#ffa03a] disabled:opacity-50"
            >
              {loading ? "Looking up…" : "Find orders"}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

          {searched && !loading && orders.length === 0 && !error && (
            <p className="mt-10 text-center text-sm text-[#64748b]">
              No orders found for this email. Paid items appear after successful Paystack checkout.
            </p>
          )}

          <ul className="mt-8 space-y-3">
            {orders.map((o) => (
              <li
                key={o.id}
                className="rounded-2xl border border-white/10 bg-[#0c1220] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/store/${o.slug}`}
                      className="font-medium text-white hover:text-[#ff8c14]"
                    >
                      {o.title}
                    </Link>
                    <p className="mt-1 text-xs text-[#64748b]">
                      {o.createdAt} · {formatNgn(o.amountNgn)} · {o.status}
                    </p>
                  </div>
                  {o.downloadUrl ? (
                    <a
                      href={o.downloadUrl}
                      className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15"
                    >
                      Download
                    </a>
                  ) : o.expired ? (
                    <span className="text-xs text-[#64748b]">Link expired — contact support</span>
                  ) : (
                    <span className="text-xs text-[#64748b]">No download yet</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
