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
import {
  IconBolt,
  IconSignal,
  IconReceipt,
  IconWallet,
  IconPlus,
  IconShield,
  IconCheck,
  IconPhone,
  NetworkDot,
} from "@/components/bills/BillsIcons";

type Tab = "airtime" | "data" | "rrr";
const PHONE_KEY = "dt-bills-phone";

const glass =
  "rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl";
const glassInset =
  "rounded-2xl border border-white/[0.07] bg-black/25 backdrop-blur-md";
const field =
  "w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3.5 text-[16px] text-white outline-none placeholder:text-white/30 focus:border-[#ff8c14]/55 focus:ring-2 focus:ring-[#ff8c14]/15";

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

  const plans = useMemo(
    () => DATA_PLANS.filter((p) => p.network === network),
    [network]
  );

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

  if (!ready) {
    return (
      <div className={`${glass} flex items-center justify-center px-6 py-16`}>
        <div className="h-8 w-8 animate-pulse rounded-full bg-[#ff8c14]/40" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "airtime", label: "Airtime", icon: <IconBolt className="h-5 w-5" /> },
    { id: "data", label: "Data", icon: <IconSignal className="h-5 w-5" /> },
    { id: "rrr", label: "RRR", icon: <IconReceipt className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-4">
      <div className={`${glass} relative overflow-hidden px-5 py-4`}>
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#ff8c14]/15 blur-2xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#ff8c14]">
              <IconWallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                Wallet balance
              </p>
              <p className="text-[22px] font-semibold tracking-tight text-white">
                ₦{balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <a
            href="/wallet"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ff8c14]/35 bg-[#ff8c14]/15 px-3.5 py-2 text-[12px] font-semibold text-[#ff8c14] transition hover:bg-[#ff8c14] hover:text-black"
          >
            <IconPlus className="h-3.5 w-3.5" />
            Fund
          </a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {tabs.map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setError("");
                setSuccess("");
              }}
              className={`relative overflow-hidden rounded-2xl border px-2 py-3.5 text-center transition ${
                on
                  ? "border-[#ff8c14]/50 bg-[#ff8c14]/15 text-white shadow-[0_0_28px_rgba(255,140,20,0.18)]"
                  : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/80"
              }`}
            >
              <span
                className={`mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-xl ${
                  on ? "bg-[#ff8c14]/25 text-[#ff8c14]" : "bg-white/5 text-white/50"
                }`}
              >
                {t.icon}
              </span>
              <span className="block text-[13px] font-semibold">{t.label}</span>
            </button>
          );
        })}
      </div>

      {success && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-[#25D366]/35 bg-[#25D366]/10 px-4 py-3 text-[14px] text-[#c8f7d4] backdrop-blur-md">
          <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#25D366]" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-[14px] text-red-200 backdrop-blur-md">
          {error}{" "}
          {error.toLowerCase().includes("balance") && (
            <a href="/wallet" className="font-semibold text-[#ff8c14] underline">
              Fund wallet
            </a>
          )}
        </div>
      )}

      {(tab === "airtime" || tab === "data") && (
        <div className={`${glass} space-y-5 p-5`}>
          <div>
            <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/40">
              <IconPhone className="h-3.5 w-3.5" />
              1 · Phone number
            </div>
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
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/40">
              2 · Network
            </p>
            <div className="grid grid-cols-4 gap-2">
              {NETWORKS.map((n) => {
                const on = network === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setNetwork(n.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl border py-3 transition ${
                      on
                        ? "border-white/25 bg-white/10 text-white"
                        : "border-white/8 bg-black/20 text-white/50"
                    }`}
                  >
                    <NetworkDot color={n.color} />
                    <span className="text-[12px] font-bold">{n.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {tab === "airtime" ? (
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/40">
                3 · Amount
              </p>
              <div className="grid grid-cols-3 gap-2">
                {AIRTIME_PRESETS.map((a) => {
                  const on = amount === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAmount(a)}
                      className={`rounded-2xl border py-3 text-[15px] font-semibold transition ${
                        on
                          ? "border-[#ff8c14] bg-[#ff8c14] text-black shadow-[0_4px_20px_rgba(255,140,20,0.35)]"
                          : "border-white/10 bg-black/20 text-white hover:border-white/20"
                      }`}
                    >
                      ₦{a.toLocaleString()}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-white/40">
                3 · Choose plan
              </p>
              <div className="space-y-2">
                {plans.map((p) => {
                  const on = planCode === p.variation_code;
                  return (
                    <button
                      key={p.variation_code}
                      type="button"
                      onClick={() => setPlanCode(p.variation_code)}
                      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition ${
                        on
                          ? "border-[#ff8c14]/50 bg-[#ff8c14]/10"
                          : "border-white/8 bg-black/20 hover:border-white/15"
                      }`}
                    >
                      <span className="text-[14px] font-semibold text-white">{p.name}</span>
                      <span className="text-[14px] font-bold text-[#ff8c14]">
                        ₦{p.amount.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={loading || !phone}
            onClick={pay}
            className="sticky bottom-4 z-10 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff9a2e] to-[#ff8c14] py-4 text-[16px] font-bold text-black shadow-[0_8px_32px_rgba(255,140,20,0.35)] transition hover:brightness-110 disabled:opacity-40"
          >
            {loading ? (
              "Processing…"
            ) : (
              <>
                <IconBolt className="h-4 w-4" />
                {payLabel}
              </>
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-[12px] text-white/35">
            <IconShield className="h-3.5 w-3.5" />
            Paid from wallet · secure delivery
          </p>
        </div>
      )}

      {tab === "rrr" && (
        <div className={`${glass} space-y-4 p-5`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#ff8c14]">
              <IconReceipt className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-white">Pay Remita RRR</p>
              <p className="text-[12px] text-white/40">School · TSA · agency invoices</p>
            </div>
          </div>
          <input
            className={field}
            placeholder="Paste RRR number"
            value={rrr}
            onChange={(e) => setRrr(e.target.value)}
          />
          <button
            type="button"
            onClick={openRemita}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff9a2e] to-[#ff8c14] py-4 text-[16px] font-bold text-black shadow-[0_8px_32px_rgba(255,140,20,0.35)]"
          >
            <IconReceipt className="h-4 w-4" />
            Pay on Remita
          </button>
        </div>
      )}

      <div className={`${glassInset} flex items-center gap-2 px-4 py-3 text-[11px] text-white/35`}>
        <IconShield className="h-3.5 w-3.5 shrink-0" />
        Your session is encrypted. Balance never leaves your account without a confirmed buy.
      </div>
    </div>
  );
}
