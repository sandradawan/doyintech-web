"use client";

import { useState, type FormEvent } from "react";
import GiftCardVisual from "@/components/giftcards/GiftCardVisual";
import { GIFT_DESIGNS, GIFT_MAX_KOBO, GIFT_MIN_KOBO, GIFT_PRESETS_KOBO, naira } from "@/lib/giftcards/shared";

const field =
  "mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-[15px] text-white outline-none focus:border-[#ff8c14]";
const label = "block text-[13px] text-[#a1a1a6]";

/** Choose amount, design and recipient, then pay with Paystack. */
export default function GiftCardBuyForm() {
  const [amountKobo, setAmountKobo] = useState<number>(GIFT_PRESETS_KOBO[1]);
  const [custom, setCustom] = useState("");
  const [design, setDesign] = useState<string>(GIFT_DESIGNS[0].id);
  const [forSomeone, setForSomeone] = useState(true);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const customKobo = Math.round(Number(custom.replace(/[^\d.]/g, "")) * 100);
  const amount = custom ? customKobo : amountKobo;
  const amountOk = amount >= GIFT_MIN_KOBO && amount <= GIFT_MAX_KOBO;

  async function buy(e: FormEvent) {
    e.preventDefault();
    if (!amountOk) {
      setError(`Choose an amount between ${naira(GIFT_MIN_KOBO)} and ${naira(GIFT_MAX_KOBO)}.`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/gift-cards/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountKobo: Math.round(amount / 100) * 100,
          design,
          purchaserName: name,
          purchaserEmail: email,
          recipientName: forSomeone ? recipientName : "",
          recipientEmail: forSomeone ? recipientEmail : "",
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "Could not start payment");
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={buy} className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6 rounded-2xl border border-white/10 bg-[#141a28] p-5 sm:p-6">
        <fieldset>
          <legend className="text-[15px] font-semibold text-white">1. Amount</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GIFT_PRESETS_KOBO.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setAmountKobo(k);
                  setCustom("");
                }}
                className={`rounded-xl border py-3 text-[15px] font-semibold transition ${
                  !custom && amountKobo === k ? "border-[#ff8c14] bg-[#ff8c14]/10 text-white" : "border-white/15 text-[#c7cdd8] hover:border-white/30"
                }`}
              >
                {naira(k)}
              </button>
            ))}
          </div>
          <label className={`${label} mt-3`}>
            Or another amount ({naira(GIFT_MIN_KOBO)}–{naira(GIFT_MAX_KOBO)})
            <input className={field} inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="₦15,000" />
          </label>
        </fieldset>

        <fieldset>
          <legend className="text-[15px] font-semibold text-white">2. Design</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {GIFT_DESIGNS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDesign(d.id)}
                aria-pressed={design === d.id}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] ${
                  design === d.id ? "border-white text-white" : "border-white/15 text-[#c7cdd8]"
                }`}
              >
                <span className="h-4 w-4 rounded-full" style={{ background: `linear-gradient(135deg, ${d.from}, ${d.to})` }} />
                {d.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[15px] font-semibold text-white">3. Who is it for?</legend>
          <div className="mt-3 flex gap-2">
            {[
              [true, "Someone else"],
              [false, "Myself"],
            ].map(([v, l]) => (
              <button
                key={String(l)}
                type="button"
                onClick={() => setForSomeone(v as boolean)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold ${forSomeone === v ? "bg-white text-black" : "border border-white/15 text-[#c7cdd8]"}`}
              >
                {l as string}
              </button>
            ))}
          </div>
          {forSomeone && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Their name
                <input className={field} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} maxLength={80} />
              </label>
              <label className={label}>
                Their email (we send it to them)
                <input className={field} type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Optional" />
              </label>
            </div>
          )}
          <label className={`${label} mt-4`}>
            Message on the card (optional)
            <input className={field} value={message} maxLength={120} onChange={(e) => setMessage(e.target.value)} placeholder="Happy new business! Build something great." />
          </label>
        </fieldset>

        <fieldset>
          <legend className="text-[15px] font-semibold text-white">4. Your details</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Your name
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </label>
            <label className={label}>
              Your email (receipt and a copy of the card)
              <input className={field} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          </div>
        </fieldset>
      </div>

      <div className="h-fit space-y-4 lg:sticky lg:top-24">
        <GiftCardVisual amountKobo={amountOk ? amount : amountKobo} design={design} message={message || null} recipient={forSomeone ? recipientName || null : null} />
        <button
          type="submit"
          disabled={busy || !amountOk}
          className="w-full rounded-full bg-[#ff8c14] py-3.5 text-[15px] font-semibold text-black disabled:opacity-50"
        >
          {busy ? "Opening secure payment…" : `Pay ${amountOk ? naira(amount) : ""} with Paystack`}
        </button>
        {error && <p className="text-[13px] text-red-400">{error}</p>}
        <p className="text-[12px] leading-relaxed text-[#86868b]">
          The code arrives by email as soon as you pay{forSomeone && recipientEmail ? ", and we send it to them too" : ""}. Valid for 3 years on
          anything at doyintech.com. Not exchangeable for cash.
        </p>
      </div>
    </form>
  );
}
