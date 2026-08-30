import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Backend Engineering",
  description:
    "Laravel, PHP, Node.js and production-grade backend systems by DoyinTech. Auth, APIs, databases, queues and documentation.",
};

export default function BackendServicePage() {
  return (
    <>
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/services" className="text-sm text-primary hover:underline">
            ← All Services
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-primary">
            Service
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-white">
            Backend Engineering
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Secure, scalable backends built with Laravel, PHP, Node.js, MySQL and
            PostgreSQL.
          </p>

          <div className="mt-12 space-y-10 text-gray-300 leading-relaxed">
            <p>
              We design and implement backend systems that handle real traffic,
              real data, and real business rules — with clear architecture and
              documentation your team can maintain.
            </p>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">What you get</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Laravel & modern PHP applications</li>
                <li>Node.js / TypeScript APIs</li>
                <li>Authentication, roles & permissions</li>
                <li>Database design & optimisation (MySQL / PostgreSQL)</li>
                <li>Background jobs, queues & caching</li>
                <li>API documentation & integration support</li>
                <li>Deployment guidance and handoff notes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Typical timeline</h2>
              <ul className="space-y-2">
                <li>
                  <span className="text-white font-medium">Discovery</span> — 3–5
                  days (scope, risks, architecture sketch)
                </li>
                <li>
                  <span className="text-white font-medium">MVP backend</span> —
                  2–6 weeks depending on modules
                </li>
                <li>
                  <span className="text-white font-medium">Hardening</span> —
                  auth hardening, tests on critical paths, docs
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Investment range (USD)</h2>
              <p className="text-gray-400 text-sm mb-3">
                Indicative only — final quote depends on scope. We price clearly
                after discovery.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>API / module extensions — from $200</li>
                <li>Full product backend MVP — typically $500–$1,800+</li>
                <li>Enterprise systems — custom proposal</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">FAQ</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-white">Laravel or Node?</p>
                  <p className="text-gray-400 mt-1">
                    We recommend based on your team, timeline and product type —
                    not hype.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">Do you work with existing codebases?</p>
                  <p className="text-gray-400 mt-1">
                    Yes. Stabilisation, refactors and feature work on production
                    systems are core to what we do.
                  </p>
                </div>
              </div>
            </section>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
              >
                Discuss Backend Work
              </a>
              <a
                href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27m%20interested%20in%20backend%20engineering."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border border-white/15 text-white text-sm font-semibold"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
