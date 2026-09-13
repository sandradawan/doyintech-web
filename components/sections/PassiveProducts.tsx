"use client";

import { useState } from "react";
import ScrollReveal from "../animations/ScrollReveal";
import {
  DIGITAL_PRODUCTS,
  SAAS_PRODUCTS,
  waitlistWhatsAppLink,
} from "@/lib/products";
import { packageWhatsAppLink } from "@/lib/packages";
import PaystackBuyButton from "@/components/ui/PaystackBuyButton";

export default function PassiveProducts() {
  return (
    <section id="products" className="apple-section apple-section-black">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal direction="up">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
              Earn while you sleep
            </p>
            <h2 className="apple-headline mt-2">Products & recurring.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-2xl">
              Pay online with Paystack for digital products. Subscriptions and care
              plans bill every month.
            </p>
          </div>
        </ScrollReveal>

        <h3 className="mt-14 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">
          Digital products — Paystack
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {DIGITAL_PRODUCTS.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" delay={i * 0.05}>
              <article className="apple-card flex h-full flex-col p-6">
                {p.badge && (
                  <span className="mb-2 w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-[#a1a1a6]">
                    {p.badge}
                  </span>
                )}
                <h4 className="text-[18px] font-semibold text-[#f5f5f7]">{p.name}</h4>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#a1a1a6]">
                  {p.description}
                </p>
                <p className="mt-4 text-[22px] font-semibold text-[#f5f5f7]">
                  {p.priceNgn}{" "}
                  <span className="text-[13px] font-normal text-[#a1a1a6]">
                    · {p.priceUsd}
                  </span>
                </p>
                <ul className="mt-3 space-y-1">
                  {p.features.map((f) => (
                    <li key={f} className="text-[13px] text-[#f5f5f7]/90">
                      ✓ {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[12px] text-[#a1a1a6]">{p.delivery}</p>
                <PaystackBuyButton product={p} />
              </article>
            </ScrollReveal>
          ))}
        </div>

        <h3 className="mt-16 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">
          Subscription products (waitlist)
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {SAAS_PRODUCTS.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" delay={i * 0.06}>
              <article className="apple-card flex h-full flex-col p-7 ring-1 ring-[#2997ff]/25">
                {p.badge && (
                  <span className="mb-2 w-fit rounded-full bg-[#0071e3]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#2997ff]">
                    {p.badge}
                  </span>
                )}
                <h4 className="text-[22px] font-semibold text-[#f5f5f7]">{p.name}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-[#a1a1a6]">
                  {p.description}
                </p>
                <p className="mt-4 text-[24px] font-semibold text-[#f5f5f7]">
                  {p.priceUsd}{" "}
                  <span className="text-[14px] font-normal text-[#a1a1a6]">
                    · {p.priceNgn}
                  </span>
                </p>
                <ul className="mt-4 grid gap-1 sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="text-[13px] text-[#f5f5f7]/90">
                      ✓ {f}
                    </li>
                  ))}
                </ul>
                <WaitlistForm productName={p.name} productId={p.id} />
                <a
                  href={waitlistWhatsAppLink(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-center text-[13px] text-[#2997ff] hover:underline"
                >
                  Or join via WhatsApp ›
                </a>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={0.08}>
          <div className="mt-10 rounded-[28px] border border-white/10 bg-[#1d1d1f] p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div>
              <h3 className="text-[22px] font-semibold text-[#f5f5f7]">
                Monthly Care Plan (recurring)
              </h3>
              <p className="mt-2 max-w-xl text-[15px] text-[#a1a1a6]">
                Retainers are the simplest “sleep money”: backups, updates, small
                changes, priority support — billed every month.
              </p>
              <p className="mt-2 text-[18px] font-semibold text-[#f5f5f7]">
                From $80/mo · ₦50,000 – ₦150,000/mo
              </p>
            </div>
            <a
              href={packageWhatsAppLink("Monthly Care Plan")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex shrink-0 items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-[15px] font-semibold text-white sm:mt-0"
            >
              Start on WhatsApp
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function WaitlistForm({ productName, productId }: { productName: string; productId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          product: productName,
          type: "waitlist",
          message: `Waitlist: ${productId}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setStatus("ok");
      setMsg(data.message || "You're on the list.");
      setName("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      setStatus("err");
      setMsg(err.message || "Something went wrong");
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-2">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#2997ff]/50"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#2997ff]/50"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="WhatsApp number"
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#2997ff]/50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-white py-3 text-[14px] font-semibold text-black disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Join waitlist"}
      </button>
      {msg && (
        <p className={`text-[12px] ${status === "err" ? "text-red-400" : "text-emerald-400"}`}>
          {msg}
        </p>
      )}
    </form>
  );
}
