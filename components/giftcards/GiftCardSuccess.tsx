"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GiftCardVisual from "@/components/giftcards/GiftCardVisual";
import { applyGiftCode } from "@/lib/giftcards/client";
import { naira } from "@/lib/giftcards/shared";

type Card = {
  status: string;
  amountKobo: number;
  design: string;
  message: string | null;
  recipientName: string | null;
  expiresAt: string | null;
  code: string | null;
};

/** After paying: waits for confirmation, then shows the code with copy, share and print. */
export default function GiftCardSuccess() {
  const [card, setCard] = useState<Card | null>(null);
  const [state, setState] = useState<"loading" | "pending" | "ready" | "error">("loading");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("reference") || "";
    let tries = 0;
    let stop = false;
    async function poll() {
      try {
        const res = await fetch(`/api/gift-cards/status?reference=${encodeURIComponent(ref)}`);
        const data = await res.json();
        if (stop) return;
        if (!res.ok) {
          setState("error");
          return;
        }
        setCard(data.card);
        if (data.card.status === "active") {
          setState("ready");
          return;
        }
        setState("pending");
      } catch {
        /* retry */
      }
      if (!stop && ++tries < 20) setTimeout(poll, 3000);
    }
    poll();
    return () => {
      stop = true;
    };
  }, []);

  if (state === "loading" || (state === "pending" && !card?.code)) {
    return (
      <div className="flex items-center gap-3 text-[15px] text-[#a1a1a6]" role="status">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-[#ff8c14]" />
        Confirming your payment…
      </div>
    );
  }
  if (state === "error" || !card) {
    return <p className="text-[15px] text-[#a1a1a6]">We couldn&apos;t find this gift card. If you were charged, message us on WhatsApp with your Paystack receipt.</p>;
  }

  const share = `I got you a ${naira(card.amountKobo)} DoyinTech gift card 🎁\nCode: ${card.code}\nUse it at https://www.doyintech.com/gift-cards/redeem`;

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      <div className="gift-print">
        <GiftCardVisual amountKobo={card.amountKobo} design={card.design} message={card.message} code={card.code} recipient={card.recipientName} />
      </div>
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-white">Your gift card is ready</h1>
        <p className="mt-2 text-[15px] text-[#a1a1a6]">
          We&apos;ve emailed it{card.recipientName ? ` and sent it to ${card.recipientName} if you gave their email` : ""}. Keep the code safe:
          anyone with it can spend the balance.
          {card.expiresAt && ` Valid until ${new Date(card.expiresAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(card.code || "");
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black"
          >
            {copied ? "Copied ✓" : "Copy code"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(share)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-5 py-2.5 text-[14px] font-semibold text-white"
          >
            Send on WhatsApp
          </a>
          <button type="button" onClick={() => window.print()} className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white">
            Print
          </button>
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#141a28] p-5">
          <p className="text-[14px] font-semibold text-white">Bought it for yourself?</p>
          <p className="mt-1 text-[13px] text-[#a1a1a6]">Apply it now and it&apos;s used automatically at checkout across DoyinTech.</p>
          <Link
            href="/products"
            onClick={() => card.code && applyGiftCode(card.code)}
            className="mt-3 inline-flex rounded-full border border-white/20 px-4 py-2 text-[13px] font-semibold text-white"
          >
            Use it now
          </Link>
        </div>
      </div>
    </div>
  );
}
