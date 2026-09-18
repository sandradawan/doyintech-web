import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Case Study — JennyGlams Makeup Artistry",
  description:
    "Portfolio and WhatsApp booking website for JennyGlams — Jos makeup artist. Turn social followers into booked clients.",
};

const metrics = [
  { value: "DM chaos", label: "Before" },
  { value: "1-tap book", label: "After" },
  { value: "~7 days", label: "To live" },
  { value: "Mobile", label: "First" },
];

export default function JennyGlamsCaseStudy() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/case-studies" className="text-sm text-[#2997ff] hover:underline">
            ← All case studies
          </Link>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff8c14]">
            Case study · Local SME · Jos
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white md:text-5xl">
            JennyGlams — Makeup Artistry Brand
          </h1>
          <p className="mt-4 text-xl text-[#a1a1a6]">
            An elegant portfolio and booking site that turns Instagram interest into booked
            appointments — without endless DM back-and-forth.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Next.js", "Portfolio", "WhatsApp booking", "Brand site"].map((t) => (
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
                <p className="text-xl font-bold text-white sm:text-2xl">{m.value}</p>
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
                Jennifer was booking through Instagram DMs. Clients asked the same questions
                repeatedly (prices, packages, availability). Good photos were buried in the feed.
                There was no single link that looked as premium as the work.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-white">What we shipped</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Clean portfolio layout optimised for high-quality photos</li>
                <li>Clear service categories (bridal, soft glam, editorial, masterclasses)</li>
                <li>WhatsApp-first booking so clients can reserve in minutes</li>
                <li>Mobile-first design for clients browsing on the go</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-white">Results (practical)</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-white">Before:</strong> discovery → long DM thread → maybe
                  a booking
                </li>
                <li>
                  <strong className="text-white">After:</strong> one link → portfolio + services →
                  WhatsApp with context pre-filled
                </li>
                <li>A professional link for brides, stylists, and collaborators</li>
                <li>Brand presence that matches the quality of the makeup work</li>
              </ul>
              <p className="mt-4 text-[14px] text-[#86868b]">
                Metrics are directional (client-reported workflow change). Exact enquiry counts stay
                private.
              </p>
            </section>

            <div className="rounded-2xl border border-[#ff8c14]/25 bg-[#ff8c14]/5 p-6">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                Salons, coaches, freelancers
              </p>
              <p className="mt-2 text-[15px] text-[#e8eaed]">
                Same pattern: one sharp site, WhatsApp CTA, fixed price. Landing page from ₦100k or
                local business site from ₦250k.
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
                  href="https://jennyglams.vercel.app"
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
