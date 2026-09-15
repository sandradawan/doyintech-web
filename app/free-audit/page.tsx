import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Free 3-Minute Website Audit | DoyinTech",
  description:
    "Free website audit for small businesses plus free WhatsApp reply scripts. Fix contact paths and convert more chats.",
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
  const wa =
    "https://wa.me/2348085343926?text=" +
    encodeURIComponent(
      "Hi DoyinTech, I want a FREE 3-minute website audit.\n\nMy website URL:\n\nMy business type:\n\nMain goal (more calls / WhatsApp / sales):"
    );

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Free · no long form
          </p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[42px]">
            Free 3-minute website audit
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">
            Send your URL on WhatsApp. We reply with 2–3 specific problems holding back enquiries —
            and whether a small fix or a rebuild makes sense.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full bg-[#25D366] px-8 py-3.5 text-[16px] font-semibold text-white"
            >
              Send my URL on WhatsApp
            </a>
            <a
              href={discoveryCallLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-semibold text-white"
            >
              Book a free call instead
            </a>
          </div>

          <div className="mt-12 rounded-2xl border border-[#ff8c14]/30 bg-gradient-to-b from-[#ff8c14]/10 to-[#141a28] p-6 text-left">
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
              (Status calendar + caption pack) or the{" "}
              <a href="/products" className="font-semibold text-[#ff8c14] hover:underline">
                WhatsApp Business Growth Pack
              </a>
              .
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-[#141a28] p-6 text-left">
            <h2 className="text-[15px] font-semibold text-white">What we check</h2>
            <ul className="mt-4 space-y-2">
              {checks.map((c) => (
                <li key={c} className="flex gap-2 text-[14px] text-[#c7cdd8]">
                  <span className="text-[#ff8c14]">✓</span> {c}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-[13px] text-[#86868b]">
            After the audit, many clients book a{" "}
            <a href="/pricing" className="text-[#ff8c14] hover:underline">
              Starter or Growth website
            </a>{" "}
            or buy a{" "}
            <a href="/products" className="text-[#ff8c14] hover:underline">
              digital pack
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
