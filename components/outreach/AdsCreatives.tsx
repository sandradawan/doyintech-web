"use client";

import { useState } from "react";

type Block = { id: string; channel: string; title: string; body: string };

const CREATIVES: Block[] = [
  {
    id: "status-audit",
    channel: "WhatsApp Status",
    title: "Free audit hook",
    body: `Does your website get enquiries — or just visitors?\n\nFree 3-minute audit. Send your URL.\nWe reply with 2–3 specific fixes.\n\n→ https://doyintech.vercel.app/free-audit\n\nReply AUDIT with your link.`,
  },
  {
    id: "status-landing",
    channel: "WhatsApp Status",
    title: "Landing page ₦100k",
    body: `One page. One offer. Built to get WhatsApp chats.\n\nLanding Page Starter — ₦100,000\nDeposit ₦50,000 on Paystack\nLive in about a week\n\n→ https://doyintech.vercel.app/hire\n\nReply HIRE`,
  },
  {
    id: "status-local",
    channel: "WhatsApp Status",
    title: "Local business site",
    body: `Salon · clinic · shop · coach\n\nProfessional site + WhatsApp on every page.\nFixed price ₦250,000 · 50% deposit · 7–14 days\n\n→ https://doyintech.vercel.app/hire`,
  },
  {
    id: "status-refer",
    channel: "WhatsApp Status",
    title: "Refer ₦10k",
    body: `Know a business that needs a real website?\n\nRefer them. When they pay deposit, you get ₦10,000 credit.\n\n→ https://doyintech.vercel.app/refer`,
  },
  {
    id: "meta-primary",
    channel: "Meta / Instagram ad",
    title: "Primary text — audit",
    body: `Your website should bring enquiries — not just look nice.\n\nDoyinTech offers a free 3-minute audit for Nigerian SMEs: send your URL, get 2–3 specific problems holding back chats, and a clear next step.\n\nFixed-price sites from ₦100k. 50% deposit. Paystack. Live in days.\n\nStart free → doyintech.vercel.app/free-audit`,
  },
  {
    id: "meta-headline",
    channel: "Meta ad",
    title: "Headline + description",
    body: `Headline: Free website audit for Nigerian SMEs\nDescription: 2–3 fixes that block WhatsApp enquiries. Fixed-price sites from ₦100k.`,
  },
  {
    id: "meta-landing",
    channel: "Meta / Instagram ad",
    title: "Primary text — landing",
    body: `One sharp landing page that sells one offer.\n\n₦100,000 fixed. ₦50,000 deposit online. WhatsApp button. Live in about a week.\n\nBuilt for coaches, freelancers, and shops testing one product.\n\nBook → doyintech.vercel.app/hire`,
  },
];

const FOLLOWUPS: Block[] = [
  {
    id: "fu-1",
    channel: "WhatsApp · Day 0",
    title: "After they say interested",
    body: `Great — thanks [Name].\n\nEasiest next step:\n1) Free audit (send your URL): https://doyintech.vercel.app/free-audit\nOR\n2) Pick a package and pay 50% deposit: https://doyintech.vercel.app/hire\n\nLanding starts at ₦100k (₦50k deposit). Local business site ₦250k.\n\nWhich fits you better this month?`,
  },
  {
    id: "fu-2",
    channel: "WhatsApp · Day 2",
    title: "Soft bump — no reply",
    body: `Hi [Name] — just bumping this once.\n\nStill happy to send a short free note on your site (or help you choose Landing vs Local package).\n\nNo pressure. Reply when useful.\n— Silas, DoyinTech`,
  },
  {
    id: "fu-3",
    channel: "WhatsApp · Day 5",
    title: "Later / budget",
    body: `Hi [Name] — understood if budget is tight this month.\n\nTwo free options in the meantime:\n• Audit: https://doyintech.vercel.app/free-audit\n• WhatsApp reply scripts: https://doyintech.vercel.app/tools/whatsapp-scripts\n\nWhen you're ready for a fixed-price site, packages stay here: https://doyintech.vercel.app/hire`,
  },
  {
    id: "fu-4",
    channel: "WhatsApp · Day 7",
    title: "Value drop",
    body: `Quick value for [Business]:\n\nMost SME sites lose chats because:\n1) Offer is unclear above the fold\n2) No one-tap WhatsApp\n3) Mobile is slow or messy\n\nIf you want, send your URL and I’ll reply with 2–3 specifics (free).\nhttps://doyintech.vercel.app/free-audit`,
  },
  {
    id: "fu-5",
    channel: "WhatsApp · After audit sent",
    title: "Close to deposit",
    body: `Hope the audit notes were useful.\n\nIf you want those fixes built properly, Landing Page Starter is ₦100k (₦50k deposit) — or Local Business Website ₦250k if you need more pages.\n\nDeposit online: https://doyintech.vercel.app/hire\n\nI can hold a slot this week if you message “DEPOSIT” after payment.`,
  },
  {
    id: "fu-6",
    channel: "WhatsApp · Post-purchase digital",
    title: "After product download",
    body: `Thanks for your order — files should be in your email / success page.\n\nIf you want the same system built into a live website (WhatsApp + clear offer), fixed packages are here: https://doyintech.vercel.app/hire\n\nAnd if a friend needs a site, refer them for ₦10k credit: https://doyintech.vercel.app/refer`,
  },
];

function CopyBtn({
  id,
  body,
  active,
  onCopy,
}: {
  id: string;
  body: string;
  active: boolean;
  onCopy: (id: string, body: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(id, body)}
      className="rounded-full bg-[#ff8c14] px-4 py-2 text-[12px] font-semibold text-black"
    >
      {active ? "Copied ✓" : "Copy"}
    </button>
  );
}

export default function AdsCreatives() {
  const [copied, setCopied] = useState<string | null>(null);

  async function onCopy(id: string, body: string) {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto max-w-[800px] px-4">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
        Internal · distribution
      </p>
      <h1 className="mt-2 text-[30px] font-semibold text-white sm:text-[36px]">
        Ads & Status creatives
      </h1>
      <p className="mt-3 text-[15px] text-[#a1a1a6]">
        Copy → paste on Status, Meta, or Instagram. Pair with{" "}
        <a href="/outreach/daily" className="text-[#2997ff] hover:underline">
          daily prospecting
        </a>
        .
      </p>

      <h2 className="mt-10 text-[18px] font-semibold text-white">Creatives</h2>
      <div className="mt-4 space-y-4">
        {CREATIVES.map((c) => (
          <div key={c.id} className="rounded-2xl border border-white/10 bg-[#141a28] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[14px] font-semibold text-white">{c.title}</p>
                <p className="text-[11px] text-[#86868b]">{c.channel}</p>
              </div>
              <CopyBtn id={c.id} body={c.body} active={copied === c.id} onCopy={onCopy} />
            </div>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-[#e8eaed]">
              {c.body}
            </pre>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-[18px] font-semibold text-white">Follow-up sequences</h2>
      <p className="mt-1 text-[13px] text-[#a1a1a6]">
        For people who said interested, later, or went quiet. Personalize [Name] / [Business].
      </p>
      <div className="mt-4 space-y-4">
        {FOLLOWUPS.map((c) => (
          <div key={c.id} className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-[14px] font-semibold text-white">{c.title}</p>
                <p className="text-[11px] text-[#86868b]">{c.channel}</p>
              </div>
              <CopyBtn id={c.id} body={c.body} active={copied === c.id} onCopy={onCopy} />
            </div>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-[#e8eaed]">
              {c.body}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
