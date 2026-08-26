import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "AI Automation",
  description: "Practical AI automation for business processes by DoyinTech.",
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
            Practical automation that removes repetitive work — not science projects.
          </p>

          <div className="mt-12 space-y-8 text-gray-300 leading-relaxed">
            <p>
              We help businesses identify high-ROI processes and implement reliable AI-assisted workflows for support, sales, reporting, and internal operations.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process discovery & opportunity mapping</li>
              <li>Workflow automation design</li>
              <li>Integration with existing tools</li>
              <li>Secure handling of business data</li>
              <li>Documentation and handover</li>
            </ul>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
              >
                Explore Automation
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
