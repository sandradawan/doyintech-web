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
              Digital store
            </p>
            <h2 className="apple-headline mt-2">Products clients pay for.</h2>
            <p className="apple-subhead mx-auto mt-3 max-w-2xl">
              Five high-demand digital products. Pay with Paystack — delivered by
              email or WhatsApp after payment.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIGITAL_PRODUCTS.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" delay={i * 0.04}>
              <article
                className={`apple-card flex h-full flex-col p-6 ${
                  p.badge === "Best seller" || p.badge === "Most popular"
                    ? "ring-1 ring-[#2997ff]/40"
                    : ""
                }`}
              >
                {p.badge && (
                  <span
                    className={`mb-2 w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      p.badge === "Best seller" || p.badge === "Most popular"
                        ? "bg-[#0071e3] text-white"
                        : "bg-white/10 text-[#a1a1a6]"
                    }`}
                  >
                    {p.badge}
                  </span>
                )}
                <h3 className="text-[19px] font-semibold tracking-tight text-[#f5f5f7]">
                  {p.name}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[#a1a1a6]">
                  {p.description}
                </p>
                <p className="mt-4 text-[26px] font-semibold text-[#f5f5f7]">
                  {p.priceNgn}
                </p>
                <p className="text-[13px] text-[#a1a1a6]">{p.priceUsd} one-time</p>
                <ul className="mt-4 space-y-1.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 text-[13px] text-[#f5f5f7]/90">
                      <span className="text-[#2997ff]">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[12px] text-[#a1a1a6]">{p.delivery}</p>
                <PaystackBuyButton product={p} />
              </article>
            </ScrollReveal>
          ))}
        </div>

        <h3 className="mt-20 text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-[#a1a1a6]">
          Coming next — monthly subscriptions
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {SAAS_PRODUCTS.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" delay={i * 0.06}>
              <article className="apple-card flex h-full flex-col p-7">
                {p.badge && (
                  <span className="mb-2 w-fit rounded-full bg-[#0071e3]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#2997ff]">
                    {p.badge}
                  </span>
                )}
                <h4 className="text-[20px] font-semibold text-[#f5f5f7]">{p.name}</h4>
                <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">
                  {p.description}
                </p>
                <p className="mt-3 text-[20px] font-semibold text-[#f5f5f7]">
                  {p.priceNgn}
                </p>
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
                Monthly Care Plan
              </h3>
              <p className="mt-2 max-w-xl text-[15px] text-[#a1a1a6]">
                Recurring revenue: backups, updates, small changes, priority support.
              </p>
              <p className="mt-2 text-[18px] font-semibold text-[#f5f5f7]">
                From ₦50,000 – ₦150,000/mo
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
