import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Weekly Status pack — promote free audit & Landing Page",
  description:
    "Ready WhatsApp Status captions for DoyinTech: free audit, fixed-price websites, digital products.",
};

const week = [
  {
    day: "Mon",
    caption:
      "Does your website get enquiries — or just visitors? Free 3-minute audit. Send your URL. → doyintech.vercel.app/free-audit",
  },
  {
    day: "Tue",
    caption:
      "Landing page that sells ONE offer. ₦100,000 fixed. Deposit ₦50,000 on Paystack. Live in about a week. → /hire",
  },
  {
    day: "Wed",
    caption:
      "Salon · clinic · lounge: WhatsApp booking starts with a clear site + one-tap chat. Case studies on the site.",
  },
  {
    day: "Thu",
    caption:
      "Free tools for Nigerian SMEs (security, invoices, audit). Use free — hire us when you need it built.",
  },
  {
    day: "Fri",
    caption:
      "50% deposit. Balance only before handoff. Fixed price — no vague quotes. Jos-based, serving Nigeria.",
  },
  {
    day: "Sat",
    caption:
      "Digital packs from ₦6,500 — Status calendars, WhatsApp scripts, Sheets. Pay online, download today.",
  },
  {
    day: "Sun",
    caption:
      "Refer a business that pays deposit → ₦10k credit on your next DoyinTech package. DM to refer.",
  },
];

export default function StatusPackPage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[640px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Internal · traffic system
          </p>
          <h1 className="mt-2 text-[32px] font-semibold text-white">
            This week’s Status captions
          </h1>
          <p className="mt-3 text-[15px] text-[#a1a1a6]">
            Post one per day. Link free audit or /hire. Consistency beats perfection.
          </p>
          <div className="mt-10 space-y-4">
            {week.map((w) => (
              <div
                key={w.day}
                className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5"
              >
                <p className="text-[12px] font-semibold text-[#ff8c14]">{w.day}</p>
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
      </main>
      <Footer />
    </>
  );
}
