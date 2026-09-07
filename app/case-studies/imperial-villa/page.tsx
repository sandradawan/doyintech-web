import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Case Study — Imperial Villa Property Platform",
  description:
    "How DoyinTech built the corporate website, client portal and internal management system for Imperial Villa Property Development.",
};

const metrics = [
  { value: "3", label: "Connected products" },
  { value: "2", label: "Live portals" },
  { value: "1", label: "Unified brand site" },
  { value: "100%", label: "Remote delivery" },
];

export default function ImperialVillaCaseStudy() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-4xl px-6">
          <Link href="/portfolio" className="text-sm text-primary hover:underline">
            ← Back to Portfolio
          </Link>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Case study
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            Imperial Villa Property Platform
          </h1>
          <p className="mt-4 text-xl text-gray-400">
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
                <p className="font-display text-2xl font-bold text-white">{m.value}</p>
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
              <h2 className="mb-3 text-2xl font-bold text-white">The solution</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Modern marketing website showcasing estates, 25% Equity Mortgage offering
                  and lead generation.
                </li>
                <li>Secure client portal for account access and communication.</li>
                <li>
                  Internal staff system for client management, fund tracking and branch
                  operations.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-bold text-white">Results</h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>Unified digital presence for the brand</li>
                <li>Streamlined client onboarding and staff workflows</li>
                <li>Scalable foundation for future product features</li>
              </ul>
            </section>

            <div className="flex flex-wrap gap-4 pt-6">
              <a
                href="https://www.imperialvillapropertydevelopment.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Visit live site
              </a>
              <a
                href="/contact"
                className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Start a similar project
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
