"use client";

import {
  DIGITAL_PRODUCTS,
  SAAS_PRODUCTS,
  productWhatsAppLink,
  waitlistWhatsAppLink,
} from "@/lib/products";
import PaystackBuyButton from "@/components/ui/PaystackBuyButton";

const PRIORITY = [
  "sme-system-protector-kit",
  "whatsapp-followup-agent-kit",
  "gs-sheets-starter-bundle",
  "review-referral-harvest-kit",
];

function orderedProducts() {
  const byId = new Map(DIGITAL_PRODUCTS.map((p) => [p.id, p]));
  const top = PRIORITY.map((id) => byId.get(id)).filter(
    Boolean
  ) as typeof DIGITAL_PRODUCTS;
  const rest = DIGITAL_PRODUCTS.filter((p) => !PRIORITY.includes(p.id));
  return [...top, ...rest];
}

export default function ProductsCatalog() {
  const products = orderedProducts();
  const lead = products.slice(0, 2);
  const more = products.slice(2);

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-16">
      <p className="mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
        Best sellers this week
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {lead.map((p) => (
          <article
            key={p.id}
            className="flex flex-col overflow-hidden rounded-[22px] border border-[#ff8c14]/40 bg-gradient-to-b from-[#2c2c2e] to-[#1d1d1f] shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-[#ff8c14]/15"
          >
            <div className="flex flex-1 flex-col p-6">
              {p.badge && (
                <span className="mb-2 w-fit rounded-full bg-[#ff8c14] px-2.5 py-0.5 text-[11px] font-semibold text-black">
                  {p.badge}
                </span>
              )}
              <h2 className="text-[22px] font-semibold text-white">{p.name}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">
                {p.description}
              </p>
              <p className="mt-5 text-[32px] font-semibold text-white">{p.priceUsd}</p>
              <p className="text-[13px] text-[#86868b]">Secure checkout · instant download</p>
              <ul className="mt-4 space-y-2">
                {p.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] text-[#e8eaed]">
                    <span className="text-[#ff8c14]">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 border-t border-white/10 bg-black/30 px-6 py-4">
              <PaystackBuyButton product={p} />
              <a
                href={productWhatsAppLink(p.name, "digital product")}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-[13px] text-[#25D366] hover:underline"
              >
                WhatsApp order
              </a>
            </div>
          </article>
        ))}
      </div>

      {more.length > 0 && (
        <>
          <h3 className="mb-4 mt-14 text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">
            More products
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1d1d1f]"
              >
                <div className="flex flex-1 flex-col p-5">
                  {p.badge && (
                    <span className="mb-2 w-fit rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-[#ff8c14]">
                      {p.badge}
                    </span>
                  )}
                  <h3 className="text-[17px] font-semibold text-white">{p.name}</h3>
                  <p className="mt-2 line-clamp-2 text-[13px] text-[#a1a1a6]">{p.description}</p>
                  <p className="mt-4 text-[24px] font-semibold text-white">{p.priceUsd}</p>
                </div>
                <div className="space-y-2 border-t border-white/10 px-5 py-4">
                  <PaystackBuyButton product={p} />
                  <a
                    href={productWhatsAppLink(p.name, "digital product")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[12px] text-[#25D366] hover:underline"
                  >
                    WhatsApp order
                  </a>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {SAAS_PRODUCTS.length > 0 && (
        <>
          <h3 className="mb-4 mt-16 text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">
            Waitlist — monthly apps
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {SAAS_PRODUCTS.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-white/10 bg-[#141a28] p-5"
              >
                <p className="text-[15px] font-semibold text-white">{p.name}</p>
                <p className="mt-1 text-[12px] text-[#a1a1a6]">{p.priceUsd}</p>
                <a
                  href={waitlistWhatsAppLink(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-[13px] font-semibold text-[#2997ff] hover:underline"
                >
                  Join waitlist ›
                </a>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="mt-14 rounded-2xl border border-white/10 bg-[#141a28] p-6 text-center">
        <p className="text-[16px] font-semibold text-white">Need a full website instead?</p>
        <p className="mt-2 text-[14px] text-[#a1a1a6]">
          Fixed-price packages from $65 — 50% deposit online.
        </p>
        <a
          href="/hire"
          className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
        >
          Hire — pay deposit
        </a>
      </div>
    </div>
  );
}
