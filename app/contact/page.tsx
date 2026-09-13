"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/ui/Footer";
import ContactCta, { emailLink } from "@/components/ui/ContactCta";
import { discoveryCallLink } from "@/lib/packages";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
} as const;

export default function ContactPage() {
  return (
    <>
      <main className="pb-24 pt-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-sm text-gray-400">Contact</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Let’s talk about your project.
            </h1>
            <p className="mt-5 leading-relaxed text-gray-400">
              No long forms. Email us or book a call — we’ll reply with clear next steps.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-12 grid items-start gap-8 lg:grid-cols-12"
          >
            <motion.div variants={item} className="grid gap-4 lg:col-span-5">
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Fastest path
                </p>
                <h2 className="mt-2 font-display text-xl font-bold text-white">
                  Book a discovery call
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                  Share your goals on WhatsApp. We’ll outline scope and timeline — no obligation.
                </p>
                <a
                  href={discoveryCallLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-95"
                >
                  Book on WhatsApp
                </a>
              </div>

              <a
                href={emailLink()}
                className="group block rounded-2xl border border-white/10 bg-black/20 p-6 transition hover:border-primary/60"
              >
                <p className="text-sm text-gray-400">Email</p>
                <p className="mt-2 font-semibold text-gray-100">doyintechnology@outlook.com</p>
                <p className="mt-2 text-sm text-gray-400">Best for project inquiries and quotes.</p>
                <p className="mt-4 text-sm text-primary">Send an email →</p>
              </a>

              <a
                href="tel:+2348085343926"
                className="group block rounded-2xl border border-white/10 bg-black/20 p-6 transition hover:border-primary/60"
              >
                <p className="text-sm text-gray-400">Phone</p>
                <p className="mt-2 font-semibold text-gray-100">08085343926</p>
                <p className="mt-2 text-sm text-gray-400">Call for urgent requests.</p>
                <p className="mt-4 text-sm text-primary">Call now →</p>
              </a>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div className="mb-4 flex items-center gap-3.5">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/15">
                    <Image
                      src="/founder.png"
                      alt="Silas Doyin Jonathan"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Silas D. Jonathan
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Available
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">
                  Prefer a quick chat? Book a call or email — typically replies within business hours.
                </p>
              </div>
            </motion.div>

            <motion.div variants={item} className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold">Get in touch</h2>
                <p className="mt-2 text-gray-400">
                  Choose one path. No form to fill.
                </p>
                <div className="mt-8">
                  <ContactCta
                    title="Email or book a call"
                    subtitle="We’ll respond with a clear plan, timeline, and next step."
                  />
                </div>
                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-gray-200">What happens next?</p>
                  <ul className="mt-2 space-y-2 text-sm text-gray-400">
                    <li>• We review your request</li>
                    <li>• We propose approach + timeline</li>
                    <li>• We start with a clear scope</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
