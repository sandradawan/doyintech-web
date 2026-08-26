import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Backend Engineering",
  description: "Laravel, PHP, Node.js and production-grade backend systems by DoyinTech.",
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
            Secure, scalable backends built with Laravel, PHP, Node.js, MySQL and PostgreSQL.
          </p>

          <div className="mt-12 space-y-8 text-gray-300 leading-relaxed">
            <p>
              We design and implement backend systems that handle real traffic, real data, and real business rules — with clear architecture and documentation.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Laravel & modern PHP applications</li>
              <li>Node.js / TypeScript APIs</li>
              <li>Authentication, roles & permissions</li>
              <li>Database design & optimisation</li>
              <li>Background jobs, queues & caching</li>
              <li>API documentation & integration support</li>
            </ul>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
              >
                Discuss Backend Work
              </a>
              <a
                href="https://wa.me/2348085343926"
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
