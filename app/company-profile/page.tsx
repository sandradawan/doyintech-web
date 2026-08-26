import Footer from "@/components/ui/Footer";

export const metadata = {
  title: "Company Profile",
  description: "DoyinTech company profile — who we are, what we build, and how we work.",
};

export default function CompanyProfilePage() {
  return (
    <>
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Company Profile
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
            DoyinTech
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Production-grade software engineering for businesses that need systems they can rely on.
          </p>

          <div className="mt-12 space-y-10 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">Who We Are</h2>
              <p>
                DoyinTech is a software engineering practice based in Jos, Nigeria. We design and build backends, APIs, web platforms, Flutter mobile apps, and practical AI automation for clients across Africa and beyond.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">What We Deliver</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Laravel & PHP systems</li>
                <li>Node.js / TypeScript APIs</li>
                <li>Next.js web applications</li>
                <li>Flutter mobile apps</li>
                <li>System architecture & databases (MySQL, PostgreSQL)</li>
                <li>AI automation workflows</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">How We Work</h2>
              <p>
                Discovery → Architecture → Build → Launch → Support. Clear communication, fixed-scope options, and documentation so your team can maintain what we deliver.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Selected Work</h2>
              <p>
                Imperial Villa Property platform, DoyinMart marketplace, LegacyPlay, JennyGlams, Arqademy CBT, and more.
              </p>
            </section>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Start a Project
              </a>
              <a
                href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%20would%20like%20your%20company%20profile."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition"
              >
                Request PDF Profile
              </a>
            </div>

            <p className="text-sm text-gray-500">
              Prefer a PDF? Message us on WhatsApp and we will send the latest company profile.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
