import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Free 3-Minute Website Audit | DoyinTech",
  description:
    "Free website audit for small businesses. We check mobile, speed, contact paths, and WhatsApp — then tell you what to fix to get more enquiries.",
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
            Send your URL on WhatsApp. We reply with 2–3 specific problems holding back enquiries
            — and whether a small fix or a rebuild makes sense. Built for SMEs, freelancers, and
            local service businesses.
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

          <div className="mt-14 rounded-2xl border border-white/10 bg-[#141a28] p-6 text-left">
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
              WhatsApp / prompt pack
            </a>{" "}
            to fix the gaps themselves.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
