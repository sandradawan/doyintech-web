"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/ui/Footer";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
} as const;

type Status =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

const BOOK_CALL_URL =
  "https://wa.me/2348085343926?text=" +
  encodeURIComponent(
    "Hi DoyinTech, I'd like to book a 20-minute discovery call. Preferred days/times: "
  );

export default function ContactPage() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.type === "sending") return;

    const form = e.currentTarget;

    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (
        form.elements.namedItem("email") as HTMLInputElement
      ).value.trim(),
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
      budget: (form.elements.namedItem("budget") as HTMLSelectElement).value,
      timeline: (form.elements.namedItem("timeline") as HTMLSelectElement).value,
      message: (
        form.elements.namedItem("message") as HTMLTextAreaElement
      ).value.trim(),
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus({
        type: "error",
        message: "Please fill in your name, email, and project details.",
      });
      return;
    }

    setStatus({ type: "sending" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send message.");
      }

      form.reset();
      setStatus({
        type: "success",
        message: "✅ Message sent! We’ll respond shortly.",
      });
    } catch (err: any) {
      setStatus({
        type: "error",
        message:
          err?.message ||
          "❌ Something went wrong. Please try again or email us directly.",
      });
    }
  }

  const isSending = status.type === "sending";

  return (
    <>
      <main className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-sm text-gray-400">Contact</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
              Let’s talk about your project.
            </h1>
            <p className="mt-5 text-gray-400 leading-relaxed">
              Tell us what you want to build. We’ll respond with clear next steps,
              timeline, and the best approach to deliver it.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-12 grid lg:grid-cols-12 gap-8 items-start"
          >
            <motion.div variants={item} className="lg:col-span-5 grid gap-4">
              {/* Book a call — primary conversion */}
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Fastest path
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-white">
                  Book a 20-min discovery call
                </h2>
                <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                  Share your goals on WhatsApp. We’ll confirm a time and outline
                  scope, timeline, and next steps — no obligation.
                </p>
                <a
                  href={BOOK_CALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:opacity-95 transition"
                >
                  Book on WhatsApp
                </a>
                <p className="mt-3 text-xs text-gray-500">
                  Prefer email? Use the form — we reply within 1 business day.
                </p>
              </div>

              <InfoCard
                label="Email"
                title="doyintechnology@outlook.com"
                sub="Best for project inquiries and quotes."
                ctaText="Send an email →"
                href="mailto:doyintechnology@outlook.com?subject=Project%20Inquiry%20-%20DoyinTech"
              />

              <InfoCard
                label="Phone"
                title="08085343926"
                sub="Call for urgent requests or quick clarification."
                ctaText="Call now →"
                href="tel:+2348085343926"
              />

              <InfoCard
                label="Location"
                title="Jos, Nigeria"
                sub="Serving clients locally and globally."
                ctaText="View services →"
                href="/services"
              />

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative h-11 w-11 rounded-full border border-white/15 overflow-hidden">
                    <Image
                      src="/founder.png"
                      alt="Silas Doyin Jonathan"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Silas D. Jonathan
                    </span>
                    <span className="text-[9px] text-green-400 flex items-center gap-1 font-semibold uppercase tracking-wider mt-0.5 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Online & Active
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Need a quick scope assessment? Message me directly on WhatsApp.
                  Typically replies in minutes during business hours.
                </p>
                <a
                  href="https://wa.me/2348085343926"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center justify-center w-full rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 hover:bg-[#25D366]/25 transition text-[#25D366] px-4 py-3.5 font-semibold text-xs uppercase tracking-wider"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div variants={item} className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold">Send a message</h2>
                <p className="mt-2 text-gray-400">
                  Share details — we’ll reply with a clear plan.
                </p>

                <div className="mt-5">
                  {status.type === "success" && (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-200">
                      {status.message}
                    </div>
                  )}
                  {status.type === "error" && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                      {status.message}
                    </div>
                  )}
                </div>

                <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                  <input
                    name="company"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      name="name"
                      label="Full Name"
                      placeholder="Your name"
                      required
                    />
                    <Field
                      name="email"
                      label="Email"
                      placeholder="you@example.com"
                      type="email"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <SelectField
                      name="service"
                      label="Service"
                      options={[
                        "Website/Web App",
                        "Backend Engineering",
                        "API Development",
                        "Mobile Development",
                        "AI Automation",
                        "System Design",
                        "Consulting",
                      ]}
                    />
                    <SelectField
                      name="budget"
                      label="Budget Range (optional)"
                      options={[
                        "Not sure yet",
                        "₦100k - ₦300k",
                        "₦300k - ₦800k",
                        "₦800k - ₦2m",
                        "₦2m+",
                      ]}
                    />
                  </div>

                  <SelectField
                    name="timeline"
                    label="Desired timeline"
                    options={[
                      "ASAP",
                      "2–4 weeks",
                      "1–2 months",
                      "3+ months",
                      "Flexible",
                    ]}
                  />

                  <TextArea
                    name="message"
                    label="Project Details"
                    placeholder="What do you want to build? Timeline? Any links or references?"
                    required
                  />

                  <button
                    type="submit"
                    disabled={isSending}
                    className={[
                      "mt-2 rounded-xl px-6 py-3 font-medium transition",
                      isSending
                        ? "bg-primary/60 text-white cursor-not-allowed"
                        : "bg-primary text-white hover:opacity-90",
                    ].join(" ")}
                  >
                    {isSending ? "Sending..." : "Send Message"}
                  </button>

                  <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-gray-200 font-medium">
                      What happens next?
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-gray-400">
                      <li>• We review your request</li>
                      <li>• We propose the best approach + timeline</li>
                      <li>• We start with a clear scope and delivery plan</li>
                    </ul>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoCard({
  label,
  title,
  sub,
  ctaText,
  href,
}: {
  label: string;
  title: string;
  sub: string;
  ctaText: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-white/10 bg-black/20 p-6 hover:border-primary/60 transition block"
    >
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-gray-100 font-semibold">{title}</p>
      <p className="mt-2 text-sm text-gray-400">{sub}</p>
      <p className="mt-4 text-sm text-primary transition group-hover:translate-x-0.5">
        {ctaText}
      </p>
    </a>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-gray-200 outline-none focus:border-primary/70 transition"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <select
        name={name}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-gray-200 outline-none focus:border-primary/70 transition"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-black">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  name,
  label,
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <textarea
        name={name}
        required={required}
        rows={6}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-gray-200 outline-none focus:border-primary/70 transition resize-none"
      />
    </div>
  );
}
