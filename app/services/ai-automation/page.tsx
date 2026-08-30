import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "AI Automation",
  description:
    "Practical AI automation for business processes by DoyinTech — support, sales, reporting and internal ops.",
};

export default function AIAutomationPage() {
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
            AI Automation
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Practical automation that removes repetitive work — not science
            projects.
          </p>

          <div className="mt-12 space-y-10 text-gray-300 leading-relaxed">
            <p>
              We help businesses identify high-ROI processes and implement
              reliable AI-assisted workflows for support, sales, reporting, and
              internal operations.
            </p>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">What you get</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Process discovery & opportunity mapping</li>
                <li>Workflow automation design</li>
                <li>Integration with existing tools (email, CRM, WhatsApp, sheets)</li>
                <li>Secure handling of business data</li>
                <li>Documentation and staff handover</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Common use cases</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Lead qualification and follow-up drafts</li>
                <li>Customer support triage and FAQs</li>
                <li>Report summaries from operational data</li>
                <li>Document intake and classification</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Investment range (USD)</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Single workflow pilot — from $150</li>
                <li>Multi-process automation package — custom quote</li>
              </ul>
            </section>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
              >
                Explore Automation
              </a>
              <a
                href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27m%20interested%20in%20AI%20automation."
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
