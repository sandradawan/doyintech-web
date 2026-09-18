import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import FreeAuditForm from "@/components/tools/FreeAuditForm";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Free 3-Minute Website Audit | DoyinTech",
  description:
    "Free website audit for Nigerian SMEs. Send your URL — get 2–3 specific fixes. Plus free WhatsApp reply scripts.",
};

const checks = [
  "Does the site load on mobile without pain?",
  "Is there a clear offer above the fold?",
  "Can a stranger contact you in one tap (WhatsApp / call / form)?",
  "Are services and prices (or next step) obvious?",
  "Any broken links, mixed HTTP, or missing HTTPS?",
  "Is Google Business / basic SEO presence weak?",
];

export default function FreeAuditPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
              Free · no long form · reply on WhatsApp
            </p>
            <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[42px]">
              Free 3-minute website audit
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-[#a1a1a6]">
              Drop your URL below. We reply with 2–3 specific problems holding back enquiries — and
              whether a small fix or a rebuild makes sense. Honest next step, not a hard sell.
            </p>
          </div>

          <div className="mt-10">
            <FreeAuditForm />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-semibold text-[#2997ff] hover:underline"
            >
              Prefer a 15-min call instead?
            </a>
          </div>

          <div className="mt-12 rounded-2xl border border-[#ff8c14]/30 bg-gradient-to-b from-[#ff8c14]/10 to-[#141a28] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#ff8c14]">
              Free download · no payment
            </p>
            <h2 className="mt-2 text-[20px] font-semibold text-white">
              WhatsApp reply scripts (sample pack)
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[#a1a1a6]">
              Instant download: price enquiry, website quote, after-hours, soft close, and review
              request scripts. Use today on your business line.
            </p>
            <a
              href="/digital-products/free-whatsapp-reply-scripts.md"
              download="free-whatsapp-reply-scripts.md"
              className="mt-4 inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
            >
              Download free scripts
            </a>
            <p className="mt-4 text-[13px] text-[#86868b]">
              Ready for the full system?{" "}
              <a href="/products" className="font-semibold text-[#ff8c14] hover:underline">
                SME Launch Bundle
              </a>{" "}
              or the{" "}
              <a href="/products" className="font-semibold text-[#ff8c14] hover:underline">
                WhatsApp Business Growth Pack
              </a>
              .
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-[#141a28] p-6">
            <h2 className="text-[15px] font-semibold text-white">What we check</h2>
            <ul className="mt-4 space-y-2">
              {checks.map((c) => (
                <li key={c} className="flex gap-2 text-[14px] text-[#c7cdd8]">
                  <span className="text-[#ff8c14]">✓</span> {c}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13px] text-[#86868b]">
              Self-check first: if you answer "no" to two or more, a focused landing page or
              rebuild usually pays for itself in enquiries.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-[#1d1d1f] p-6 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#86868b]">
              After the audit
            </p>
            <h2 className="mt-2 text-[20px] font-semibold text-white">
              Many clients book a fixed-price site
            </h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] text-[#a1a1a6]">
              Landing Page Starter ₦100,000 · Local Business Website ₦250,000 · 50% deposit via
              Paystack.
            </p>
            <a
              href="/hire"
              className="mt-5 inline-flex rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black"
            >
              See packages & pay deposit
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
