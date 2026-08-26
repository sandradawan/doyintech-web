import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for DoyinTech.",
};

export default function TermsPage() {
  return (
    <>
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 prose prose-invert prose-headings:font-display">
          <h1 className="font-display text-4xl font-bold text-white">Terms of Service</h1>
          <p className="text-gray-400 mt-4">Last updated: August 2026</p>

          <div className="mt-10 space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Services</h2>
              <p>
                DoyinTech provides software development, system architecture, API development, and related consulting services. Specific deliverables, timelines and pricing are agreed in writing for each project.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Client Responsibilities</h2>
              <p>
                Clients agree to provide timely feedback, necessary access, and accurate information required for the successful delivery of the project.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Intellectual Property</h2>
              <p>
                Upon full payment, the client owns the custom code and deliverables created specifically for the project, excluding any pre-existing tools, libraries or frameworks used by DoyinTech.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Limitation of Liability</h2>
              <p>
                DoyinTech shall not be liable for any indirect, incidental or consequential damages arising from the use of our services or deliverables.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Contact</h2>
              <p>
                For questions regarding these terms, contact us at{" "}
                <a href="mailto:doyintechnology@outlook.com" className="text-primary hover:underline">
                  doyintechnology@outlook.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
