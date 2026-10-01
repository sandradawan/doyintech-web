"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import {
  IconWallet,
  IconPlus,
  IconBolt,
  IconShield,
  IconSignal,
} from "@/components/bills/BillsIcons";

const PRESETS = [500, 1000, 2000, 5000, 10000];

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl";

export default function WalletPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<
    { id: string; kind: string; phone: string; amount_kobo: number; status: string }[]
  >([]);

  const load = useCallback(async (accessToken: string) => {
    const bal = await fetch("/api/wallet/balance", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((r) => r.json());
    if (bal.balance_naira != null) setBalance(bal.balance_naira);
    if (bal.error) setError(bal.error);

    const hist = await fetch("/api/wallet/history", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((r) => r.json());
    if (hist.orders) setOrders(hist.orders);
  }, []);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      setError("Supabase is not configured.");
      setReady(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/auth/login?next=/wallet");
        return;
      }
      setEmail(data.session.user.email || "");
      setToken(data.session.access_token);
      setReady(true);
      void load(data.session.access_token);
    });
  }, [router, load]);

  async function fund() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/wallet/fund", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount_naira: amount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start funding");
        setLoading(false);
        return;
      }
      window.location.href = data.authorization_url;
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  async function signOut() {
    const sb = getSupabaseBrowser();
    await sb?.auth.signOut();
    router.replace("/auth/login");
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b12] text-white/50">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[#ff8c14]/30" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b12] px-5 pb-24 pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,140,20,0.12),_transparent_55%)]" />
      <div className="relative mx-auto max-w-[420px] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
              My wallet
            </p>
            <p className="mt-0.5 text-sm text-white/70">{email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition hover:text-white"
          >
            Sign out
          </button>
        </div>

        <div className={`${glass} relative overflow-hidden p-6`}>
          <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#ff8c14]/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-20 rounded-full bg-[#0071e3]/15 blur-2xl" />
          <div className="relative">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#ff8c14]">
              <IconWallet className="h-6 w-6" />
            </div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/40">
              Available balance
            </p>
            <p className="mt-1 text-[40px] font-semibold tracking-tight text-white">
              ₦{balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <a
              href="/bills"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff9a2e] to-[#ff8c14] py-3.5 text-sm font-bold text-black shadow-[0_8px_28px_rgba(255,140,20,0.3)]"
            >
              <IconBolt className="h-4 w-4" />
              Top up airtime & data
            </a>
          </div>
        </div>

        {error && (
          <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-md">
            {error}
          </p>
        )}

        <div className={`${glass} space-y-4 p-5`}>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff8c14]/15 text-[#ff8c14]">
              <IconPlus className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-white">Fund wallet</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((a) => {
              const on = amount === a;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmount(a)}
                  className={`rounded-2xl border py-2.5 text-sm font-semibold transition ${
                    on
                      ? "border-[#ff8c14] bg-[#ff8c14] text-black shadow-[0_4px_16px_rgba(255,140,20,0.3)]"
                      : "border-white/10 bg-black/25 text-white hover:border-white/20"
                  }`}
                >
                  ₦{a.toLocaleString()}
                </button>
              );
            })}
          </div>
          <input
            type="number"
            min={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none focus:border-[#ff8c14]/50"
          />
          <button
            type="button"
            disabled={loading}
            onClick={fund}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3.5 text-sm font-bold text-black transition hover:bg-white/90 disabled:opacity-50"
          >
            {loading ? "Opening Paystack…" : `Fund ₦${amount.toLocaleString()}`}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-white/35">
            <IconShield className="h-3.5 w-3.5" />
            Card or transfer · credited after Paystack confirms
          </p>
        </div>

        <div className={`${glass} space-y-3 p-5`}>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/60">
              <IconSignal className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-white">Recent orders</p>
          </div>
          {orders.length === 0 && (
            <p className="py-4 text-center text-sm text-white/35">No purchases yet.</p>
          )}
          <div className="space-y-2">
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-black/25 px-3.5 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      o.kind === "airtime"
                        ? "bg-[#ff8c14]/15 text-[#ff8c14]"
                        : "bg-[#0071e3]/15 text-[#5aa9ff]"
                    }`}
                  >
                    {o.kind === "airtime" ? (
                      <IconBolt className="h-4 w-4" />
                    ) : (
                      <IconSignal className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {o.kind} · {o.phone}
                    </p>
                    <p className="text-[11px] capitalize text-white/40">{o.status}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#ff8c14]">
                  ₦{(o.amount_kobo / 100).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
