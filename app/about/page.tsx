import type { Metadata } from "next";
import MapSection from "@/components/map/MapSection";
import Image from "next/image";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about DoyinTech, our founder Silas Doyin Jonathan, our mission, and the values that drive our engineering work.",
};

export default function AboutPage() {
  return (
    <>
      <main className="pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm text-gray-400">About</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold tracking-tight">
            DoyinTech is built for quality, speed, and scale.
          </h1>
          <p className="mt-5 text-gray-400 leading-relaxed">
            We build production-grade backend systems, secure APIs, and modern
            mobile applications. Our focus is clean architecture,
            maintainability, and premium execution.
          </p>
        </div>

        {/* Founder (Professional layout) */}
        <section className="mt-14">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              {/* Left: Founder info */}
              <div className="max-w-2xl">
                <p className="text-sm text-gray-400">Founder</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
                  Silas Doyin Jonathan
                </h2>

                <p className="mt-4 text-gray-400 leading-relaxed">
                  I’m a Front/backend and mobile engineer focused on building
                  scalable systems and high-quality products. DoyinTech exists
                  to help businesses ship reliable software with clean
                  architecture, strong security, and long-term maintainability.
                </p>

                <div className="mt-6 grid sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-gray-200 font-medium">Backend</p>
                    <p className="mt-1 text-xs text-gray-400">
                      APIs • Databases
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-gray-200 font-medium">Mobile</p>
                    <p className="mt-1 text-xs text-gray-400">Flutter • UX</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-gray-200 font-medium">Delivery</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Quality • Speed
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="/contact"
                    className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition text-center"
                  >
                    Contact DoyinTech
                  </a>
                  <a
                    href="/portfolio"
                    className="px-6 py-3 rounded-lg border border-white/15 hover:border-primary transition text-center"
                  >
                    View Portfolio
                  </a>
                </div>
              </div>

              {/* Right: Founder Photo (top-right circle with nonstop orange glow) */}
              <div className="flex md:justify-end">
                <div className="relative w-44 h-44 md:w-52 md:h-52 shrink-0 animate-float">
                  {/* nonstop orange glow ring */}
                  <div className="absolute inset-0 rounded-full animate-pulseGlow blur-[10px] bg-orange-500/35" />
                  <div className="absolute inset-[6px] rounded-full animate-pulseGlow blur-[16px] bg-orange-400/25" />

                  {/* circle frame */}
                  <div className="relative w-full h-full rounded-full border border-white/15 bg-white/5 overflow-hidden">
                    <div className="absolute inset-[6px] rounded-full overflow-hidden">
                      <Image
                        src="/founder.png"
                        alt="Founder"
                        fill
                        className="object-cover object-top"
                        priority
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-center text-xs text-gray-500">
                    Founder & CEO @Doyins Technology
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision / Mission (standard, professional) */}
        <section className="mt-10">
          <div className="grid md:grid-cols-2 gap-6">
            <StandardCard
              title="Our Vision"
              content="To become a trusted technology partner that empowers businesses and startups
              to build scalable, secure, and future-proof digital products."
            />
            <StandardCard
              title="Our Mission"
              content="To design and deliver high-quality backend systems, APIs, and mobile applications
              using modern technologies, clean architecture, and best engineering practices."
            />
          </div>
        </section>

        {/* Existing: Values + Location */}
        <section className="mt-12 grid lg:grid-cols-2 gap-10 items-start">
          <div className="grid gap-6">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="font-display text-2xl font-bold">
                What we stand for
              </h2>
              <ul className="mt-4 space-y-3 text-gray-400">
                <li>• Clean architecture & reliability</li>
                <li>• Secure, scalable systems</li>
                <li>• Premium UX & engineering</li>
              </ul>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {["Speed", "Quality", "Scale"].map((v) => (
                <div
                  key={v}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <p className="text-gray-200 font-medium">{v}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Built intentionally
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-gray-400 mb-3">Our Location</p>
              <MapSection />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <p className="text-gray-200 font-medium">Jos, Nigeria</p>
              <p className="mt-2 text-sm text-gray-400">
                Serving clients locally and globally.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
    <Footer />
    </>
  );
}

/** Standard professional card (no hover noise) */
function StandardCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-8">
      <h3 className="font-display text-2xl font-semibold text-gray-100">
        {title}
      </h3>
      <p className="mt-4 text-gray-400 leading-relaxed">{content}</p>
    </div>
  );
}
