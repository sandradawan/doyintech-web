"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GIFT_EVENT, applyGiftCode, readGiftCode } from "@/lib/giftcards/client";
import { naira } from "@/lib/giftcards/shared";

type Card = { last4: string; balanceKobo: number; usable: boolean };

/** Small reminder that a gift card is applied; every DoyinTech checkout uses it automatically. */
export default function GiftCardPill() {
  const pathname = usePathname() || "";
  const [card, setCard] = useState<Card | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function sync() {
      const code = readGiftCode();
      if (!code) return !cancelled && setCard(null);
      try {
        const res = await fetch(`/api/gift-cards/check?code=${encodeURIComponent(code)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.card?.usable || data.card.balanceKobo <= 0) {
          applyGiftCode(null); // spent, expired or unknown: stop applying it
          return;
        }
        setCard(data.card);
      } catch {
        /* offline: keep whatever we had */
      }
    }
    void sync();
    window.addEventListener(GIFT_EVENT, sync);
    return () => {
      cancelled = true;
      window.removeEventListener(GIFT_EVENT, sync);
    };
  }, [pathname]);

  const hidden = ["/admin", "/s/", "/pay/", "/gift-cards"].some((p) => pathname.startsWith(p));
  if (!card || hidden) return null;

  return (
    <div className="fixed bottom-5 left-4 z-[95] flex items-center gap-2 rounded-full border border-[#ff8c14]/40 bg-[#141a28]/95 py-1.5 pl-3 pr-1.5 text-[12px] text-white shadow-xl backdrop-blur">
      <span aria-hidden>🎁</span>
      <Link href="/gift-cards/redeem" className="hover:underline">
        Gift card ••{card.last4} · <strong>{naira(card.balanceKobo)}</strong> applied at checkout
      </Link>
      <button
        type="button"
        onClick={() => applyGiftCode(null)}
        aria-label="Stop using this gift card"
        className="rounded-full px-2 py-0.5 text-[14px] leading-none text-[#a1a1a6] hover:bg-white/10 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
