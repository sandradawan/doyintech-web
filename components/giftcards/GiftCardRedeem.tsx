"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import GiftCardVisual from "@/components/giftcards/GiftCardVisual";
import { applyGiftCode, readGiftCode } from "@/lib/giftcards/client";
import { formatGiftCode, naira, normalizeGiftCode } from "@/lib/giftcards/shared";

type Card = { last4: string; design: string; initialKobo: number; balanceKobo: number; usable: boolean; status: string; expiresAt: string | null };

/** Check a balance and apply the card so every checkout on the site uses it. */
export default function GiftCardRedeem() {
  const [code, setCode] = useState("");
  const [card, setCard] = useState<Card | null>(null);
  const [applied, setApplied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const check = useCallback(async (raw: string) => {
    const normal = normalizeGiftCode(raw);
    if (!normal) {
      setError("Gift card codes have 16 letters and numbers, like ABCD-EFGH-JKLM-NPQR.");
      setCard(null);
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/gift-cards/check?code=${encodeURIComponent(normal)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We couldn't find that gift card.");
      setCard(data.card);
      setApplied(readGiftCode() === normal);
    } catch (err) {
      setCard(null);
      setError(err instanceof Error ? err.message : "We couldn't find that gift card.");
    } finally {
      setBusy(false);
    }
  }, []);

  // Links from the gift email carry ?code=…; otherwise show the card already applied.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("code") || readGiftCode();
    if (!fromUrl) return;
    const pretty = normalizeGiftCode(fromUrl) ? formatGiftCode(normalizeGiftCode(fromUrl)) : fromUrl;
     
    setCode(pretty);
    void check(fromUrl);
    if (new URLSearchParams(window.location.search).has("code")) window.history.replaceState(null, "", window.location.pathname);
  }, [check]);

  function submit(e: FormEvent) {
    e.preventDefault();
    void check(code);
  }

  function apply() {
    applyGiftCode(normalizeGiftCode(code));
    setApplied(true);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div>
        <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            aria-label="Gift card code"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-full border border-white/15 bg-black/40 px-5 py-3 font-mono text-[16px] tracking-[0.08em] text-white outline-none focus:border-[#ff8c14]"
          />
          <button type="submit" disabled={busy} className="rounded-full bg-[#ff8c14] px-6 py-3 text-[15px] font-semibold text-black disabled:opacity-60">
            {busy ? "Checking…" : "Check balance"}
          </button>
        </form>
        {error && <p className="mt-3 text-[14px] text-red-400">{error}</p>}

        {card && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#141a28] p-5">
            <p className="text-[13px] uppercase tracking-wide text-[#86868b]">Balance</p>
            <p className="mt-1 text-[32px] font-semibold text-white">{naira(card.balanceKobo)}</p>
            <p className="text-[13px] text-[#a1a1a6]">
              of {naira(card.initialKobo)} · card ••{card.last4}
              {card.expiresAt && ` · valid until ${new Date(card.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`}
            </p>
            {!card.usable || card.balanceKobo <= 0 ? (
              <p className="mt-4 text-[14px] text-[#ffb366]">
                {card.status === "expired" ? "This card has expired." : card.status === "disabled" ? "This card has been disabled." : "This card has been fully spent."}
              </p>
            ) : applied ? (
              <div className="mt-4">
                <p className="text-[14px] text-emerald-300">Applied. Your balance is used automatically when you pay for anything on DoyinTech.</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[13px]">
                  {[
                    ["/products", "Business kits"],
                    ["/tools", "Premium tools"],
                    ["/ebooks", "Ebooks"],
                    ["/hire", "Website packages"],
                  ].map(([href, l]) => (
                    <Link key={href} href={href} className="rounded-full border border-white/20 px-4 py-2 font-semibold text-white hover:bg-white/5">
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <button type="button" onClick={apply} className="mt-4 rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black">
                Use this card at checkout
              </button>
            )}
          </div>
        )}
      </div>
      <div>
        {card && <GiftCardVisual amountKobo={card.balanceKobo} design={card.design} code={`••••-••••-••••-${card.last4}`} />}
        <p className="mt-3 text-[12px] text-[#86868b]">
          Spend it on tools, templates, ebooks, website deposits and add-ons. If a purchase costs more than your balance, you pay the rest with
          Paystack. Gift cards can&apos;t be used in independent seller shops or exchanged for cash.
        </p>
      </div>
    </div>
  );
}
