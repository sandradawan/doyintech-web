"use client";

import Link from "next/link";
import { DIGITAL_PRODUCTS } from "@/lib/products";
import PaystackBuyButton from "@/components/ui/PaystackBuyButton";

export default function ProductsCatalog() {
  const oneTime = DIGITAL_PRODUCTS.filter((p) => p.type === "one-time");
  const subs = DIGITAL_PRODUCTS.filter((p) => p.type === "subscription");
  const wait = DIGITAL_PRODUCTS.filter((p) => p.type === "waitlist");

  return (
    <div className="space-y-16">
      <section>
        <p className="section-eyebrow">Digital products</p>
        <h2 className="mt-2 font-display text-[28px] font-semibold text-white">
          Instant downloads
        </h2>
        <p className="mt-2 max-w-xl text-[15px] text-[#a1a1a6]">
          Fixed USD pricing. Secure Paystack checkout. Instant delivery after payment.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {oneTime.map((p) => (
            <article
              key={p.id}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-7"
            >
              {p.badge && (
                <span className="w-fit rounded-full bg-[#ff8c14]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#ff8c14]">
                  {p.badge}
                </span>
              )}
              <h3 className="mt-3 font-display text-[22px] font-semibold text-white">{p.name}</h3>
              <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#a1a1a6]">{p.description}</p>
              <ul className="mt-4 space-y-1.5">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f} className="text-[13px] text-[#d1d5db]">
                    · {f}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[32px] font-semibold text-white">{p.priceUsd}</p>
              <p className="text-[13px] text-[#86868b]">Secure checkout · instant download</p>
              <div className="mt-5">
                <PaystackBuyButton product={p} className="w-full" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {subs.length > 0 && (
        <section>
          <h2 className="font-display text-[24px] font-semibold text-white">Subscriptions</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {subs.map((p) => (
              <article key={p.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-display text-[20px] font-semibold text-white">{p.name}</h3>
                <p className="mt-2 text-[14px] text-[#a1a1a6]">{p.description}</p>
                <p className="mt-4 text-[24px] font-semibold text-white">{p.priceUsd}</p>
                <div className="mt-4">
                  <PaystackBuyButton product={p} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {wait.length > 0 && (
        <section>
          <h2 className="font-display text-[24px] font-semibold text-white">Coming soon</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {wait.map((p) => (
              <div key={p.id} className="rounded-2xl border border-white/10 p-5">
                <h3 className="font-semibold text-white">{p.name}</h3>
                <p className="mt-1 text-[12px] text-[#a1a1a6]">{p.priceUsd}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="text-center text-[13px] text-[#6b7280]">
        Prefer a custom build?{" "}
        <Link href="/hire" className="text-[#2997ff] hover:underline">
          See hire packages
        </Link>
      </p>
    </div>
  );
}

function Link({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
