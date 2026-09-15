"use client";

import { getDigitalProduct } from "@/lib/products";

const UPSELL_MAP: Record<string, { title: string; body: string; href: string; cta: string }[]> = {
  "status-caption-pack": [
    {
      title: "SME Launch Bundle",
      body: "Add the 30-day Status calendar — captions + calendar together.",
      href: "/products",
      cta: "View SME Bundle",
    },
    {
      title: "WhatsApp Growth Pack",
      body: "Auto-replies and order scripts for your business line.",
      href: "/products",
      cta: "View Growth Pack",
    },
  ],
  "whatsapp-status-sales-calendar": [
    {
      title: "SME Launch Bundle",
      body: "Pair the calendar with 120+ ready captions.",
      href: "/products",
      cta: "View bundle",
    },
    {
      title: "Local Business Website",
      body: "Status traffic needs a pro site. Fixed price + deposit.",
      href: "/hire",
      cta: "Hire us",
    },
  ],
  "whatsapp-business-pack": [
    {
      title: "SME Launch Bundle",
      body: "Daily Status plan + captions to fill the inbox your scripts handle.",
      href: "/products",
      cta: "View SME Bundle",
    },
    {
      title: "Fixed-price website",
      body: "Put booking and WhatsApp on a real site visitors trust.",
      href: "/hire",
      cta: "View /hire",
    },
  ],
  "sme-cashflow-tracker": [
    {
      title: "AI Prompt Pack",
      body: "Chase invoices faster with ready collection scripts and emails.",
      href: "/products",
      cta: "View prompts",
    },
    {
      title: "Growth Website",
      body: "Clear offers online so cash in grows, not only tracking.",
      href: "/hire",
      cta: "Hire for Growth site",
    },
  ],
  "ai-prompt-pack-business": [
    {
      title: "Freelancer Starter Bundle",
      body: "Prompts + onboarding kit + Notion OS in one payment.",
      href: "/products",
      cta: "View Freelancer Bundle",
    },
  ],
  "client-onboarding-kit": [
    {
      title: "Freelancer Starter Bundle",
      body: "Complete your stack with prompts and Notion OS.",
      href: "/products",
      cta: "View bundle",
    },
  ],
  "notion-freelancer-os": [
    {
      title: "Freelancer Starter Bundle",
      body: "Add prompts and client onboarding templates.",
      href: "/products",
      cta: "View bundle",
    },
  ],
  "bundle-sme-launch": [
    {
      title: "Local Business Website",
      body: "Ready for a real site? Fixed price + 50% deposit.",
      href: "/hire",
      cta: "Hire DoyinTech",
    },
    {
      title: "WhatsApp Growth Pack",
      body: "Auto-replies when Status starts bringing chats.",
      href: "/products",
      cta: "View Growth Pack",
    },
  ],
  "bundle-freelancer-starter": [
    {
      title: "See fixed packages",
      body: "Turn templates into client projects with a clear package.",
      href: "/hire",
      cta: "Open /hire",
    },
    {
      title: "UI Components",
      body: "Ship client sites faster with ready Next.js blocks.",
      href: "/components",
      cta: "Browse components",
    },
  ],
  "nextjs-business-starter": [
    {
      title: "Need it built for you?",
      body: "Skip DIY — fixed-price website with deposit.",
      href: "/hire",
      cta: "Hire DoyinTech",
    },
  ],
};

const DEFAULT_UPSELLS = [
  {
    title: "SME Launch Bundle",
    body: "Status calendar + captions for local sellers.",
    href: "/products",
    cta: "Shop bundles",
  },
  {
    title: "Fixed-price website",
    body: "Local site in 7–14 days. Pay deposit online.",
    href: "/hire",
    cta: "View /hire",
  },
];

export default function ProductUpsells({ productId }: { productId: string }) {
  const product = getDigitalProduct(productId);
  const items = UPSELL_MAP[productId] || DEFAULT_UPSELLS;

  if (productId.startsWith("service-")) return null;

  return (
    <div className="mt-10 space-y-3 text-left">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
        Recommended next
      </p>
      {items.map((u) => (
        <a
          key={u.title}
          href={u.href}
          className="block rounded-xl border border-white/10 bg-[#141a28] p-4 transition hover:border-[#ff8c14]/40"
        >
          <p className="text-[15px] font-semibold text-white">{u.title}</p>
          <p className="mt-1 text-[13px] text-[#a1a1a6]">{u.body}</p>
          <p className="mt-2 text-[13px] font-semibold text-[#ff8c14]">{u.cta} →</p>
        </a>
      ))}
      {product?.badge === "Bundle" && (
        <a
          href="/hire"
          className="block rounded-xl border border-[#ff8c14]/30 bg-[#ff8c14]/10 p-4"
        >
          <p className="text-[15px] font-semibold text-white">Need it built for you?</p>
          <p className="mt-1 text-[13px] text-[#a1a1a6]">
            Fixed-price websites with 50% deposit on /hire
          </p>
        </a>
      )}
    </div>
  );
}

export function ServiceSuccessChecklist({
  serviceName,
  reference,
  email,
}: {
  serviceName: string;
  reference: string;
  email?: string;
}) {
  const wa =
    "https://wa.me/2348085343926?text=" +
    encodeURIComponent(
      `Hi DoyinTech, I paid the deposit for "${serviceName}".\nReference: ${reference}\nEmail: ${email || ""}\n\nI am ready to send logo, text, and photos.`
    );

  const steps = [
    "Send logo (PNG/SVG), brand colours, and business name",
    "Send page text + 5–10 real photos",
    "Confirm WhatsApp number for the site button",
    "Reply to our first draft within 3 business days",
    "Pay balance before final domain / files handoff",
  ];

  return (
    <div className="mt-8 space-y-4 text-left">
      <p className="text-[15px] font-medium text-emerald-400">Deposit received — you're booked</p>
      <p className="text-[14px] text-[#a1a1a6]">
        Next: send project assets on WhatsApp so we can start on time.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-[14px] text-[#c7cdd8]">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-full bg-[#25D366] py-3.5 text-[15px] font-semibold text-white"
      >
        Open WhatsApp — start project
      </a>
    </div>
  );
}
