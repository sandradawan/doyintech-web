"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AIRTIME_PRESETS,
  DATA_PLANS,
  NETWORKS,
  type NetworkId,
} from "@/lib/bills/catalog";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type Tab = "airtime" | "data" | "rrr";
const PHONE_KEY = "dt-bills-phone";

export default function BillsWorkspace() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState("");
  const [balance, setBalance] = useState(0);
  const [tab, setTab] = useState<Tab>("airtime");
  const [network, setNetwork] = useState<NetworkId>("mtn");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(500);
  const [planCode, setPlanCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rrr, setRrr] = useState("");

  const plans = useMemo(() => DATA_PLANS.filter((p) => p.network === network), [network]);

  const refreshBalance = useCallback(async (accessToken: string) => {
    const bal = await fetch("/api/wallet/balance", {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((r) => r.json());
    if (typeof bal.balance_naira === "number") setBalance(bal.balance_naira);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PHONE_KEY);
      if (saved) setPhone(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (plans.length && !plans.find((p) => p.variation_code === planCode)) {
      setPlanCode(plans[0].variation_code);
    }
  }, [plans, planCode]);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      setError("Auth not configured.");
      setReady(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/auth/login?next=/bills");
        return;
      }
      setToken(data.session.access_token);
      setReady(true);
      void refreshBalance(data.session.access_token);
    });
  }, [router, refreshBalance]);

  function savePhone(v: string) {
    setPhone(v);
    try {
      if (v.length >= 10) localStorage.setItem(PHONE_KEY, v);
    } catch {
      /* ignore */
    }
  }

  async function pay() {
    if (!token) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const body =
        tab === "airtime"
          ? { kind: "airtime", network, phone, amount }
          : { kind: "data", network, phone, variation_code: planCode };
      const res = await fetch("/api/wallet/buy", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          res.status === 402
            ? (data.error || "Insufficient balance") + " — fund your wallet."
            : data.error || "Purchase failed"
        );
        setLoading(false);
        return;
      }
      setSuccess(data.message || "Success");
      await refreshBalance(token);
    } catch {
      setError("Network error");
    }
    setLoading(false);
  }

  function openRemita() {
    const code = rrr.trim().replace(/\s/g, "");
    if (!code) {
      setError("Paste your RRR number.");
      return;
    }
    setError("");
    window.open(
      `https://login.remita.net/remita/exapp/payment/payment.spa?viewType=invoice&rrr=${encodeURIComponent(code)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSuccess("Remita opened — finish payment there.");
  }

  const selectedPlan = plans.find((p) => p.variation_code === planCode);
  const payLabel =
    tab === "airtime"
      ? `Buy ₦${amount.toLocaleString()} airtime`
      : selectedPlan
        ? `Buy ${selectedPlan.name}`
        : "Buy data";

  const field =
    "w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3.5 text-[16px] text-white outline-none placeholder:text-white/30 focus:border-[#ff8c14]/60";

  if (!ready) {
    return <p className="text-center text-white/60">Checking sign-in…</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141a28] px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[#86868b]">Wallet</p>
          <p className="text-lg font-semibold text-white">
            ₦{balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <a
          href="/wallet"
          className="rounded-full border border-[#ff8c14]/40 px-3 py-1.5 text-xs font-semibold text-[#ff8c14]"
        >
          Fund
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(
          [
            ["airtime", "Airtime", "⚡"],
            ["data", "Data", "📶"],
            ["rrr", "RRR", "🧾"],
          ] as const
        ).map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setError("");
              setSuccess("");
            }}
            className={`rounded-2xl border px-2 py-3.5 text-center transition ${
              tab === id
                ? "border-[#ff8c14] bg-[#ff8c14]/15 text-white"
                : "border-white/10 text-[#a1a1a6]"
            }`}
          >
            <span className="block text-[18px]">{icon}</span>
            <span className="mt-1 block text-[13px] font-semibold">{label}</span>
          </button>
        ))}
      </div>

      {success && (
        <div className="rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3 text-[14px] text-[#c8f7d4]">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-200">
          {error}{" "}
          {error.toLowerCase().includes("balance") && (
            <a href="/wallet" className="font-semibold underline">
              Fund wallet
            </a>
          )}
        </div>
      )}

      {(tab === "airtime" || tab === "data") && (
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">
              1 · Phone number
            </p>
            <input
              className={field}
              placeholder="0803 000 0000"
              value={phone}
              onChange={(e) => savePhone(e.target.value)}
              inputMode="tel"
              autoComplete="tel"
            />
          </div>

          <div>
            <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">
              2 · Network
            </p>
            <div className="grid grid-cols-4 gap-2">
              {NETWORKS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNetwork(n.id)}
                  className={`rounded-xl border py-2.5 text-[13px] font-bold ${
                    network === n.id
                      ? "border-white/40 bg-white/10 text-white"
                      : "border-white/10 text-[#a1a1a6]"
                  }`}
                >
                  <span
                    className="mx-auto mb-1 block h-2 w-2 rounded-full"
                    style={{ background: n.color }}
                  />
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {tab === "airtime" ? (
            <div>
              <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">
                3 · Amount
              </p>
              <div className="grid grid-cols-3 gap-2">
                {AIRTIME_PRESETS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a)}
                    className={`rounded-xl border py-3 text-[15px] font-semibold ${
                      amount === a
                        ? "border-[#ff8c14] bg-[#ff8c14] text-black"
                        : "border-white/10 text-white"
                    }`}
                  >
                    ₦{a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">
                3 · Choose plan
              </p>
              <div className="space-y-2">
                {plans.map((p) => (
                  <button
                    key={p.variation_code}
                    type="button"
                    onClick={() => setPlanCode(p.variation_code)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left ${
                      planCode === p.variation_code
                        ? "border-[#ff8c14] bg-[#ff8c14]/10"
                        : "border-white/10"
                    }`}
                  >
                    <span className="text-[14px] font-semibold text-white">{p.name}</span>
                    <span className="text-[14px] font-bold text-[#ff8c14]">
                      ₦{p.amount.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={loading || !phone}
            onClick={pay}
            className="sticky bottom-4 z-10 w-full rounded-full bg-[#ff8c14] py-4 text-[16px] font-bold text-black shadow-lg disabled:opacity-40"
          >
            {loading ? "Processing…" : payLabel}
          </button>
          <p className="text-center text-[12px] text-[#86868b]">
            Paid from wallet · instant when VTpass is live
          </p>
        </div>
      )}

      {tab === "rrr" && (
        <div className="space-y-4">
          <p className="text-[14px] text-[#a1a1a6]">
            Paste the RRR from your invoice (school, TSA, or agency).
          </p>
          <input
            className={field}
            placeholder="RRR number"
            value={rrr}
            onChange={(e) => setRrr(e.target.value)}
          />
          <button
            type="button"
            onClick={openRemita}
            className="w-full rounded-full bg-[#ff8c14] py-4 text-[16px] font-bold text-black"
          >
            Pay on Remita
          </button>
        </div>
      )}
    </div>
  );
}
