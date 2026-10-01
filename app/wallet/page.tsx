"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";

const PRESETS = [500, 1000, 2000, 5000, 10000];

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
      <main className="flex min-h-screen items-center justify-center bg-[#0a0e17] text-white">
        Loading wallet…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e17] px-5 pb-24 pt-20">
      <div className="mx-auto max-w-[420px] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#86868b]">Wallet</p>
            <p className="text-sm text-white/80">{email}</p>
          </div>
          <button type="button" onClick={signOut} className="text-xs text-[#86868b] hover:text-white">
            Sign out
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a2233] to-[#0f1419] p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#86868b]">Balance</p>
          <p className="mt-1 text-4xl font-semibold text-white">
            ₦{balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
          <a
            href="/bills"
            className="mt-4 block rounded-full bg-[#ff8c14] py-3 text-center text-sm font-bold text-black"
          >
            Top up services
          </a>
        </div>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <p className="text-sm font-semibold text-white">Fund wallet</p>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                className={`rounded-xl border py-2.5 text-sm font-semibold ${
                  amount === a
                    ? "border-[#ff8c14] bg-[#ff8c14] text-black"
                    : "border-white/10 text-white"
                }`}
              >
                ₦{a.toLocaleString()}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <button
            type="button"
            disabled={loading}
            onClick={fund}
            className="w-full rounded-full bg-white py-3 text-sm font-bold text-black disabled:opacity-50"
          >
            {loading ? "Opening Paystack…" : `Fund ₦${amount.toLocaleString()}`}
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">Recent orders</p>
          {orders.length === 0 && <p className="text-sm text-[#86868b]">No purchases yet.</p>}
          {orders.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-sm"
            >
              <div>
                <p className="font-medium text-white">
                  {o.kind} · {o.phone}
                </p>
                <p className="text-xs text-[#86868b]">{o.status}</p>
              </div>
              <p className="font-semibold text-[#ff8c14]">
                ₦{(o.amount_kobo / 100).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
