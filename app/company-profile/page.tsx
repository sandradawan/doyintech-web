import Footer from "@/components/ui/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Company Profile | DoyinTech",
  description:
    "DoyinTech company profile — production-grade software engineering, Laravel, Flutter, APIs, and AI automation. Jos, Nigeria.",
};

export default function CompanyProfilePage() {
  return (
    <>
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Company Profile
              </p>
              <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
                Doyin<span className="text-primary">Tech</span>
              </h1>
              <p className="mt-4 text-xl text-gray-400 max-w-xl">
                Production-grade software engineering for businesses that need
                systems they can rely on.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a
                href="/company-profile.pdf"
                download="DoyinTech_Company_Profile.pdf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF Profile
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition"
              >
                Start a Project
              </a>
            </div>
          </div>

          {/* Executive Summary */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-4">
              Executive Summary
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                DoyinTech is a Nigerian technology company specializing in
                frontend and backend engineering, scalable system architecture,
                API development, cross-platform mobile applications, and
                practical AI automation.
              </p>
              <p>
                Founded and led by Silas Doyin Jonathan, a Senior Software
                Engineer, the company builds secure, high-performance digital
                solutions for startups, enterprises, and growing organizations
                across Nigeria and Africa.
              </p>
              <p>
                Our work spans Laravel and PHP systems, Node.js APIs, Next.js
                web platforms, Flutter mobile apps, database design (MySQL &
                PostgreSQL), and AI-assisted workflows that remove repetitive
                operational work.
              </p>
              <p>
                We prioritize clean architecture, production-grade delivery, and
                systems that remain maintainable long after launch — so clients
                can scale with confidence.
              </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <div className="mt-14 grid md:grid-cols-2 gap-8">
            <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="text-lg font-bold text-primary mb-3">Mission</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                To design and deploy robust, scalable, and secure technology
                solutions that solve real-world business problems while
                maintaining performance, reliability, and long-term
                maintainability.
              </p>
            </section>
            <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="text-lg font-bold text-primary mb-3">Vision</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                To become a leading African technology engineering firm
                recognized for frontend and backend excellence, system
                optimization, and enterprise-grade software development.
              </p>
            </section>
          </div>

          {/* Services */}
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-white mb-6">Our Services</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Backend Engineering",
                  desc: "Laravel, PHP, Node.js, secure APIs, databases",
                  href: "/services/backend",
                },
                {
                  title: "Web Platforms",
                  desc: "Next.js, React, high-performance business websites",
                  href: "/services",
                },
                {
                  title: "Mobile Development",
                  desc: "Flutter apps for Android & iOS",
                  href: "/services/mobile",
                },
                {
                  title: "AI Automation",
                  desc: "Practical workflows that remove repetitive work",
                  href: "/services/ai-automation",
                },
                {
                  title: "System Architecture",
                  desc: "Scalable design, infrastructure & optimization",
                  href: "/services",
                },
                {
                  title: "API Development",
                  desc: "Auth, documentation, integrations & gateways",
                  href: "/services",
                },
              ].map((s) => (
                <Link
                  key={s.title}
                  href={s.href}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-primary/40 transition"
                >
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{s.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Selected Work */}
          <section className="mt-14">
            <h2 className="text-2xl font-bold text-white mb-6">Selected Work</h2>
            <ul className="space-y-4 text-gray-300">
              <li>
                <span className="font-semibold text-white">
                  Imperial Villa Property Platform
                </span>
                <span className="text-gray-500"> — </span>
                Corporate website, client portal & staff management system.
              </li>
              <li>
                <span className="font-semibold text-white">DoyinMart</span>
                <span className="text-gray-500"> — </span>
                African software marketplace for digital products.
              </li>
              <li>
                <span className="font-semibold text-white">LegacyPlay</span>
                <span className="text-gray-500"> — </span>
                Premium PlayStation gaming lounge website.
              </li>
              <li>
                <span className="font-semibold text-white">JennyGlams</span>
                <span className="text-gray-500"> — </span>
                Portfolio & booking site for makeup artistry.
              </li>
              <li>
                <span className="font-semibold text-white">Arqademy CBT</span>
                <span className="text-gray-500"> — </span>
                Computer-based testing platform for education.
              </li>
            </ul>
            <Link
              href="/portfolio"
              className="inline-block mt-4 text-primary text-sm font-medium hover:underline"
            >
              View full portfolio →
            </Link>
          </section>

          {/* Registration */}
          <section className="mt-14 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-bold text-primary mb-4">
              Business Registration
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-300">
              <p>
                <span className="text-gray-500">Registered Name:</span>{" "}
                DOYIN'S TECHNOLOGY
              </p>
              <p>
                <span className="text-gray-500">CAC Reg. No:</span> 9380561
              </p>
              <p>
                <span className="text-gray-500">TIN:</span> 2623175378501
              </p>
              <p>
                <span className="text-gray-500">Nature:</span> Technology &
                Software
              </p>
              <p className="sm:col-span-2">
                <span className="text-gray-500">Location:</span> Jos, Plateau
                State, Nigeria
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-14 flex flex-wrap gap-4">
            <a
              href="/company-profile.pdf"
              download="DoyinTech_Company_Profile.pdf"
              className="px-6 py-3.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
            >
              Download PDF Profile
            </a>
            <a
              href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27d%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition"
            >
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
