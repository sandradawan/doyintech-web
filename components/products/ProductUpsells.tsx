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
  ],
  "bundle-freelancer-starter": [
    {
      title: "Book a discovery call",
      body: "Turn templates into client projects with a clear package.",
      href: "/hire",
      cta: "See fixed packages",
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
