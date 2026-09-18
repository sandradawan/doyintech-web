import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Google Business & Local SEO for Nigerian SMEs | Jos & nationwide",
  description:
    "Website + Google Business Profile setup so local customers find you. Fixed-price sites with WhatsApp booking. Jos, Plateau, Nigeria.",
};

const steps = [
  {
    t: "Claim & complete Google Business",
    d: "Name, category, hours, photos, WhatsApp — so Map Pack results look real.",
  },
  {
    t: "Match NAP on your website",
    d: "Same name, address, phone on the site footer and contact page builds trust.",
  },
  {
    t: "One clear service page per offer",
    d: "Salon, clinic, property — each offer gets a page Google can rank.",
  },
  {
    t: "WhatsApp as the conversion path",
    d: "Searchers on mobile should book in one tap, not hunt for a form.",
  },
];

export default function LocalSeoPage() {
  return (
    <>
      <main className="min-h-screen bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Local · Jos & Nigeria
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[40px]">
            Google Business + website that gets local enquiries
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#a1a1a6]">
            Being on Instagram is not enough when someone searches "salon near me" or
            "clinic in Jos". Pair a simple site with a complete Google Business Profile.
          </p>

          <div className="mt-10 space-y-4">
            {steps.map((s, i) => (
              <div
                key={s.t}
                className="rounded-2xl border border-white/10 bg-[#1d1d1f] p-5"
              >
                <p className="text-[12px] font-semibold text-[#ff8c14]">Step {i + 1}</p>
                <h2 className="mt-1 text-[18px] font-semibold text-white">{s.t}</h2>
                <p className="mt-2 text-[14px] text-[#a1a1a6]">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-[#ff8c14]/25 bg-[#ff8c14]/5 p-6">
            <h2 className="text-[20px] font-semibold text-white">We build the site</h2>
            <p className="mt-2 text-[14px] text-[#a1a1a6]">
              Landing page from ₦100,000 or Local Business Website ₦250,000 — fixed price, 50%
              deposit, WhatsApp-ready. You (or we guide you) claim Google Business.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/hire"
                className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black"
              >
                Fixed-price packages
              </a>
              <a
                href="/free-audit"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Free site audit
              </a>
              <a
                href={discoveryCallLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#2997ff]"
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
