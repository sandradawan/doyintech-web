import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "White-label websites for freelancers & agencies | DoyinTech",
  description:
    "We build, you resell. Fixed-price delivery under your brand for freelancers and small agencies in Nigeria.",
};

export default function WhiteLabelPage() {
  const wa =
    "https://wa.me/2348085343926?text=" +
    encodeURIComponent(
      "Hi DoyinTech, I am a freelancer/agency interested in white-label website delivery. Let's discuss."
    );

  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Partners
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white">
            We build. You resell.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">
            Freelancers and small agencies: offer websites to your clients without burning nights on
            code. Fixed partner rates, clean handoff, your brand on the relationship.
          </p>

          <ul className="mt-8 space-y-3 text-[15px] text-[#c7cdd8]">
            <li>✓ Landing and multi-page sites on fixed timelines</li>
            <li>✓ You own the client relationship and pricing to them</li>
            <li>✓ We deliver production-ready Next.js / modern stack</li>
            <li>✓ WhatsApp coordination — no agency bureaucracy</li>
          </ul>

          <div className="mt-10 rounded-2xl border border-white/10 bg-[#1d1d1f] p-6">
            <h2 className="text-[18px] font-semibold text-white">How it works</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-[14px] text-[#a1a1a6]">
              <li>You close the client and collect your fee structure.</li>
              <li>We quote a partner build price and timeline.</li>
              <li>Deposit locks the slot; you send content.</li>
              <li>You present drafts; we revise; you launch under your name.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-white"
            >
              Partner on WhatsApp
            </a>
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-6 py-3 text-[14px] font-semibold text-white"
            >
              Book a call
            </a>
            <a href="/hire" className="rounded-full px-6 py-3 text-[14px] text-[#2997ff]">
              See public packages →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
