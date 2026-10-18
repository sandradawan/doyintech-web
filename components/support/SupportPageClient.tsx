"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

const WA =
  "https://wa.me/2348085343926?text=" +
  encodeURIComponent("Hi DoyinTech Support — I need help with: ");

const TOPICS = [
  "Website / project delivery",
  "Report Studio (PDF audit)",
  "Payment or invoice",
  "Digital product / download",
  "Student research project",
  "Login or account access",
  "Bug or technical issue",
  "Other",
] as const;

const FAQS: { q: string; a: string }[] = [
  {
    q: "How fast do you reply?",
    a: "WhatsApp is usually fastest during business hours (often under an hour). Email support aims for same-day reply on weekdays. Complex project issues may need a short call.",
  },
  {
    q: "I paid but did not receive my product or report",
    a: "Check the email used at checkout (including spam). Report Studio sends a link when processing finishes. Digital products use a download link from Paystack/email. Reply with your payment reference and we will re-send access.",
  },
  {
    q: "How do I track a website or student project?",
    a: "Website clients get updates on WhatsApp and email milestones. Student research orders can use the project track link from your confirmation email, or message Support with your request ID.",
  },
  {
    q: "Can I change scope after paying a deposit?",
    a: "Yes — within reason. Extra pages, integrations, or features may adjust timeline and balance. Message us before the next milestone so we can confirm in writing.",
  },
  {
    q: "Refunds and guarantees",
    a: "Fixed-price website packages include a clear delivery scope. If we cannot deliver the agreed scope, we resolve it per the package terms. Digital products are typically non-refundable after download; contact us if a file is defective.",
  },
  {
    q: "Where do I manage Report Studio orders?",
    a: "Start at /reports to order. Completed reports are emailed and available via the secure view link. For failed processing, open a ticket with the order email and approximate time of payment.",
  },
];

const CHANNELS = [
  {
    title: "WhatsApp",
    desc: "Fastest for urgent delivery and payment questions.",
    href: WA,
    cta: "Chat on WhatsApp",
    external: true,
    accent: "#25D366",
  },
  {
    title: "Email",
    desc: "Best for long details, screenshots, and receipts.",
    href: "mailto:hello@doyintech.com?subject=Support%20request",
    cta: "hello@doyintech.com",
    external: true,
    accent: "#2997ff",
  },
  {
    title: "Discovery call",
    desc: "New project or package advice — not for account resets.",
    href: discoveryCallLink(),
    cta: "Book a call",
    external: true,
    accent: "#ff8c14",
  },
];

const QUICK = [
  { href: "/reports", label: "Report Studio", desc: "Order or re-check audits" },
  { href: "/products", label: "Digital products", desc: "Packs and kits" },
  { href: "/hire", label: "Hire / packages", desc: "Website deposits" },
  { href: "/contact", label: "Sales contact", desc: "New project inquiry" },
  { href: "/ops/app", label: "DoyinOps", desc: "Workspace login" },
];

export default function SupportPageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [orderRef, setOrderRef] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const composedMessage = useMemo(() => {
    const parts = [
      `[Support] Topic: ${topic}`,
      orderRef.trim() ? `Reference: ${orderRef.trim()}` : null,
      "",
      message.trim(),
    ].filter((p) => p !== null);
    return parts.join("\n");
  }, [topic, orderRef, message]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service: "Customer Support",
          budget: topic,
          message: composedMessage,
          company,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send request");
      setDone(true);
      setMessage("");
      setOrderRef("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main className="min-h-screen pb-24 pt-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#ff8c14]">
              Customer support
            </p>
            <h1 className="mt-3 font-display text-[32px] font-semibold tracking-tight text-white sm:text-[40px]">
              We're here to help you ship and stay unblocked.
            </h1>
            <p className="mt-4 text-[16px] leading-relaxed text-[#a1a1a6]">
              Product access, payments, Report Studio, website delivery, and
              student projects — pick a channel or send a request. Typical
              WhatsApp response is during business hours.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {CHANNELS.map((c) => (
              <a
                key={c.title}
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25"
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.12em]"
                  style={{ color: c.accent }}
                >
                  {c.title}
                </p>
                <p className="mt-2 text-[15px] font-semibold text-white">{c.cta}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#86868b]">
                  {c.desc}
                </p>
              </a>
            ))}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <section className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-[#121214]/80 p-6 sm:p-8">
                <h2 className="font-display text-[20px] font-semibold text-white">
                  Submit a support request
                </h2>
                <p className="mt-2 text-[13px] text-[#86868b]">
                  We email the team and send you a confirmation when possible.
                  Include payment reference or order ID if you have one.
                </p>

                {done ? (
                  <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                    <p className="text-[15px] font-semibold text-emerald-300">
                      Request sent
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-[#c7cdd8]">
                      Thanks — we'll follow up on email or WhatsApp. For
                      urgent issues, message us on WhatsApp with the same
                      details.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={WA}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#25D366] px-4 py-2 text-[13px] font-semibold text-black"
                      >
                        Open WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => setDone(false)}
                        className="rounded-full border border-white/20 px-4 py-2 text-[13px] text-white"
                      >
                        Send another
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <input
                      type="text"
                      name="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[12px] font-medium text-[#a1a1a6]">
                          Your name *
                        </span>
                        <input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                        />
                      </label>
                      <label className="block">
                        <span className="text-[12px] font-medium text-[#a1a1a6]">
                          Email *
                        </span>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                        />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-[12px] font-medium text-[#a1a1a6]">
                        Topic
                      </span>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                      >
                        {TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-medium text-[#a1a1a6]">
                        Order / payment reference (optional)
                      </span>
                      <input
                        value={orderRef}
                        onChange={(e) => setOrderRef(e.target.value)}
                        placeholder="Paystack ref, invoice #, request ID…"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-medium text-[#a1a1a6]">
                        How can we help? *
                      </span>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe the issue, what you expected, and any error messages."
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-[14px] text-white outline-none focus:border-[#ff8c14]/50"
                      />
                    </label>
                    {error ? (
                      <p className="text-[13px] text-red-400">{error}</p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full bg-[#ff8c14] py-3.5 text-[14px] font-semibold text-black shadow-[0_8px_28px_rgba(255,140,20,0.28)] disabled:opacity-60 sm:w-auto sm:px-10"
                    >
                      {loading ? "Sending…" : "Send support request"}
                    </button>
                  </form>
                )}
              </div>
            </section>

            <aside className="space-y-8 lg:col-span-5">
              <div>
                <h2 className="font-display text-[18px] font-semibold text-white">
                  Common questions
                </h2>
                <ul className="mt-4 space-y-2">
                  {FAQS.map((f, i) => {
                    const open = openFaq === i;
                    return (
                      <li
                        key={f.q}
                        className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(open ? null : i)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                        >
                          <span className="text-[13px] font-medium text-white">
                            {f.q}
                          </span>
                          <span className="text-[#86868b]">{open ? "−" : "+"}</span>
                        </button>
                        {open ? (
                          <p className="border-t border-white/5 px-4 pb-3.5 pt-2 text-[13px] leading-relaxed text-[#a1a1a6]">
                            {f.a}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h2 className="font-display text-[18px] font-semibold text-white">
                  Quick links
                </h2>
                <div className="mt-4 grid gap-2">
                  {QUICK.map((q) => (
                    <Link
                      key={q.href}
                      href={q.href}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition hover:border-white/20"
                    >
                      <div>
                        <p className="text-[13px] font-semibold text-white">
                          {q.label}
                        </p>
                        <p className="text-[11px] text-[#86868b]">{q.desc}</p>
                      </div>
                      <span className="text-[#ff8c14]">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#ff8c14]/10 p-5">
                <p className="text-[13px] font-semibold text-[#ff8c14]">Hours</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#e8e8ed]">
                  Mon–Sat · roughly 9:00–19:00 WAT. Outside hours we still
                  receive WhatsApp and email — replies resume next business
                  window.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
