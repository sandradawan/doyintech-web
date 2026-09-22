"use client";

import { useState } from "react";
import ViralShare from "@/components/ui/ViralShare";

const week = [
  {
    day: "Mon",
    caption:
      "Does your website get enquiries — or just visitors? Free 3-minute audit. Send your URL. → https://doyintech.vercel.app/free-audit",
  },
  {
    day: "Tue",
    caption:
      "Landing page that sells ONE offer. ₦100,000 fixed. Deposit ₦50,000 on Paystack. Live in about a week. → https://doyintech.vercel.app/hire",
  },
  {
    day: "Wed",
    caption:
      "Salon · clinic · lounge: WhatsApp booking starts with a clear site + one-tap chat. Case studies → https://doyintech.vercel.app/case-studies",
  },
  {
    day: "Thu",
    caption:
      "Free tools for Nigerian SMEs (security, invoices, WhatsApp scripts). Use free — hire when you need it built. → https://doyintech.vercel.app/tools",
  },
  {
    day: "Fri",
    caption:
      "50% deposit. Balance only before handoff. Fixed price — no vague quotes. Jos-based, serving Nigeria. → https://doyintech.vercel.app/hire",
  },
  {
    day: "Sat",
    caption:
      "Digital packs from ₦6,500 — Status calendars, WhatsApp scripts, Sheets. Pay online, download today. → https://doyintech.vercel.app/store",
  },
  {
    day: "Sun",
    caption:
      "Refer a business that pays deposit → ₦10k credit on your next DoyinTech package. → https://doyintech.vercel.app/refer",
  },
];

function CopyCaption({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 2000);
        } catch {
          /* ignore */
        }
      }}
      className="rounded-full bg-[#ff8c14] px-4 py-2 text-[12px] font-semibold text-black"
    >
      {ok ? "Copied ✓" : "Copy for Status"}
    </button>
  );
}

export default function StatusPackClient() {
  return (
    <div className="mx-auto max-w-[640px] px-6">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
        Daily distribution · free
      </p>
      <h1 className="mt-2 text-[32px] font-semibold text-white">This week’s Status captions</h1>
      <p className="mt-3 text-[15px] text-[#a1a1a6]">
        Post one per day. Copy → paste on WhatsApp Status. Consistency fills the pipeline.
      </p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#141a28] p-4">
        <p className="text-[13px] text-[#c7cdd8]">Share this pack with a friend who needs clients:</p>
        <ViralShare
          className="mt-3"
          text="Free weekly WhatsApp Status captions for Nigerian SMEs — audit, fixed-price sites, digital products."
          url="https://doyintech.vercel.app/status-pack"
          compact
        />
      </div>

      <div className="mt-10 space-y-4">
        {week.map((w) => (
          <div key={w.day} className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold text-[#ff8c14]">{w.day}</p>
              <CopyCaption text={w.caption} />
            </div>
            <p className="mt-2 text-[15px] leading-relaxed text-[#e8eaed]">{w.caption}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-[13px] text-[#86868b]">
        Sell the same system to clients:{" "}
        <a href="/products" className="text-[#ff8c14] hover:underline">
          Status + caption products
        </a>
        .
      </p>
    </div>
  );
}
