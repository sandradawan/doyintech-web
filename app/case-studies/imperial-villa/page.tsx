import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import Link from "next/link";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Case Study — Imperial Villa Property Platform",
  description:
    "How DoyinTech built the corporate website, client portal and internal management system for Imperial Villa Property Development — fixed scope, remote delivery.",
};

const metrics = [
  { value: "3", label: "Connected products" },
  { value: "2", label: "Live portals" },
  { value: "1", label: "Brand site" },
  { value: "100%", label: "Remote delivery" },
];

export default function ImperialVillaCaseStudy() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/case-studies" className="text-sm text-[#2997ff] hover:underline">
            ← All case studies
          </Link>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff8c14]">
            Case study · Property
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white md:text-5xl">
            Imperial Villa Property Platform
          </h1>
          <p className="mt-4 text-xl text-[#a1a1a6]">
            Corporate website + client portal + staff management system for a premium
            property & pension facilitation company.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Next.js", "Laravel / PHP", "MySQL", "Auth", "Dashboards"].map((t) => (
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
                Imperial Villa needed a professional digital presence and internal tools to
                manage clients, RSA accounts, equity mortgage products and multi-branch
                operations. Existing processes were fragmented and not built for scale.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-white">What we shipped</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Marketing website showcasing estates, 25% Equity Mortgage and lead capture.
                </li>
                <li>Secure client portal for account access and communication.</li>
                <li>
                  Internal staff system for client management, fund tracking and branch ops.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-white">Business results</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>One brand site instead of scattered pages and documents</li>
                <li>Clearer path for property enquiries and mortgage interest</li>
                <li>Staff workflows that no longer depend on ad-hoc spreadsheets</li>
                <li>Foundation ready for more products without a rebuild</li>
              </ul>
            </section>

            <div className="rounded-2xl border border-[#ff8c14]/25 bg-[#ff8c14]/5 p-6">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                Similar project?
              </p>
              <p className="mt-2 text-[15px] text-[#e8eaed]">
                Property, clinics, multi-branch ops — we scope fixed-price websites and custom
                portals with 50% deposit.
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
                  href="https://www.imperialvillapropertydevelopment.com"
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
