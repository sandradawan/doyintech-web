import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Case Study — LegacyPlay Gaming Lounge",
  description:
    "Website and booking experience for LegacyPlay — premium PlayStation lounge. Clear reserve path and WhatsApp integration.",
};

const metrics = [
  { value: "Bold", label: "Brand UI" },
  { value: "1-tap", label: "WhatsApp CTA" },
  { value: "Clear", label: "Pricing path" },
  { value: "Local", label: "Foot traffic + web" },
];

export default function LegacyPlayCaseStudy() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/case-studies" className="text-sm text-[#2997ff] hover:underline">
            ← All case studies
          </Link>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff8c14]">
            Case study · Local business
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white md:text-5xl">
            LegacyPlay — PlayStation Gaming Lounge
          </h1>
          <p className="mt-4 text-xl text-[#a1a1a6]">
            A high-converting website for station booking, tournaments and brand presence — built so
            visitors know how to reserve in seconds.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Next.js", "Booking UX", "WhatsApp", "Local business"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center"
              >
                <p className="text-2xl font-bold text-white">{m.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-gray-500">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-10 leading-relaxed text-gray-300">
            <section>
              <h2 className="mb-3 text-2xl font-bold text-white">The challenge</h2>
              <p>
                LegacyPlay needed a professional online presence that made it easy for customers to
                discover the lounge, understand pricing, see tournaments and reserve stations —
                especially via WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-white">What we shipped</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Bold dark UI that matches the gaming brand</li>
                <li>Clear CTAs for reservation and WhatsApp contact</li>
                <li>Tournament and location information structured for conversion</li>
                <li>Mobile experience for people deciding on the way</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-white">Business results</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Strong first impression for walk-ins and online visitors</li>
                <li>Simplified path from interest to booking</li>
                <li>Brand that feels premium and intentional</li>
                <li>A shareable link for events and partners</li>
              </ul>
            </section>

            <div className="rounded-2xl border border-[#ff8c14]/25 bg-[#ff8c14]/5 p-6">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                Clinics · lounges · local shops
              </p>
              <p className="mt-2 text-[15px] text-[#e8eaed]">
                If your customers already live on WhatsApp, your site should hand them there with
                one tap. Fixed-price packages start at ₦100,000.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="/hire"
                  className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-sm font-semibold text-black"
                >
                  Hire · fixed price
                </a>
                <a
                  href={discoveryCallLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Free discovery call
                </a>
                <a
                  href="https://legacyplay.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#2997ff]"
                >
                  Visit live site →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
