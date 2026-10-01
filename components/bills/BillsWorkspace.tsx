"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AIRTIME_PRESETS,
  DATA_PLANS,
  NETWORKS,
  type NetworkId,
} from "@/lib/bills/catalog";

type Tab = "airtime" | "data" | "rrr";

export default function BillsWorkspace({ paidRef }: { paidRef?: string | null }) {
  const [tab, setTab] = useState<Tab>("airtime");
  const [network, setNetwork] = useState<NetworkId>("mtn");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(500);
  const [planCode, setPlanCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rrr, setRrr] = useState("");

  const plans = useMemo(() => DATA_PLANS.filter((p) => p.network === network), [network]);

  useEffect(() => {
    if (plans.length && !plans.find((p) => p.variation_code === planCode)) {
      setPlanCode(plans[0].variation_code);
    }
  }, [plans, planCode]);

  useEffect(() => {
    if (!paidRef) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/bills/fulfill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: paidRef }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) setError(data.error || "Could not complete delivery.");
        else
          setSuccess(
            data.message ||
              `Done. ${data.kind} for ${data.phone}${data.demo ? " (demo — add VTpass keys)" : ""}`
          );
      } catch {
        if (!cancelled) setError("Network error while fulfilling order.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paidRef]);

  async function payAirtimeOrData() {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const body =
        tab === "airtime"
          ? { kind: "airtime", network, phone, amount, email }
          : { kind: "data", network, phone, variation_code: planCode, email };
      const res = await fetch("/api/bills/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start payment.");
        setLoading(false);
        return;
      }
      window.location.href = data.authorization_url;
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  function openRemita() {
    const code = rrr.trim().replace(/\s/g, "");
    if (!code) {
      setError("Enter your RRR number.");
      return;
    }
    setError("");
    const url = `https://login.remita.net/remita/exapp/payment/payment.spa?viewType=invoice&rrr=${encodeURIComponent(code)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSuccess("Remita opened in a new tab. Complete payment there, then keep your receipt.");
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50";
  const btn =
    "inline-flex w-full items-center justify-center rounded-full bg-[#ff8c14] px-5 py-3 text-[15px] font-semibold text-black disabled:opacity-50";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["airtime", "Airtime"],
            ["data", "Data"],
            ["rrr", "RRR (Remita)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setError("");
              setSuccess("");
            }}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
              tab === id
                ? "bg-[#ff8c14] text-black"
                : "border border-white/15 text-[#a1a1a6] hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {success && (
        <div className="rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-3 text-[14px] text-[#c8f7d4]">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-200">
          {error}
        </div>
      )}

      {(tab === "airtime" || tab === "data") && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">
              Network
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {NETWORKS.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setNetwork(n.id)}
                  className={`rounded-xl border px-3 py-3 text-[14px] font-semibold ${
                    network === n.id
                      ? "border-[#ff8c14] bg-[#ff8c14]/15 text-white"
                      : "border-white/10 text-[#a1a1a6]"
                  }`}
                >
                  <span
                    className="mr-2 inline-block h-2 w-2 rounded-full"
                    style={{ background: n.color }}
                  />
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block text-[13px] text-[#a1a1a6]">
            Phone number
            <input
              className={`${field} mt-1`}
              placeholder="0803…"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
            />
          </label>

          {tab === "airtime" && (
            <>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">
                Amount
              </p>
              <div className="flex flex-wrap gap-2">
                {AIRTIME_PRESETS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a)}
                    className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                      amount === a
                        ? "bg-[#ff8c14] text-black"
                        : "border border-white/15 text-[#a1a1a6]"
                    }`}
                  >
                    ₦{a.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                className={field}
                type="number"
                min={50}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </>
          )}

          {tab === "data" && (
            <label className="block text-[13px] text-[#a1a1a6]">
              Data plan
              <select
                className={`${field} mt-1`}
                value={planCode}
                onChange={(e) => setPlanCode(e.target.value)}
              >
                {plans.map((p) => (
                  <option key={p.variation_code} value={p.variation_code}>
                    {p.name} — ₦{p.amount.toLocaleString()}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block text-[13px] text-[#a1a1a6]">
            Email for receipt (optional)
            <input
              className={`${field} mt-1`}
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <button type="button" className={btn} disabled={loading} onClick={payAirtimeOrData}>
            {loading ? "Please wait…" : "Pay with Paystack"}
          </button>
          <p className="text-[12px] text-[#86868b]">
            You pay via Paystack. We deliver airtime/data via VTpass when API keys are configured.
          </p>
        </div>
      )}

      {tab === "rrr" && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <h2 className="text-lg font-semibold text-white">Pay a Remita RRR</h2>
          <p className="text-[14px] leading-relaxed text-[#a1a1a6]">
            Enter the RRR from your invoice (school, TSA, agency, or merchant). We open Remita’s
            official payment page so you can complete the payment securely.
          </p>
          <label className="block text-[13px] text-[#a1a1a6]">
            RRR number
            <input
              className={`${field} mt-1`}
              placeholder="e.g. 2201…"
              value={rrr}
              onChange={(e) => setRrr(e.target.value)}
            />
          </label>
          <button type="button" className={btn} onClick={openRemita}>
            Continue on Remita
          </button>
          <p className="text-[12px] text-[#86868b]">
            Full in-app RRR needs a Remita merchant account. This uses Remita’s official pay page
            today — safest and fastest.
          </p>
        </div>
      )}
    </div>
  );
}
