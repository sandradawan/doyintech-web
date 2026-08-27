import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Flutter Mobile Development",
  description:
    "Cross-platform Flutter apps for Android and iOS by DoyinTech. Architecture, API integration, auth and store readiness.",
};

export default function MobileServicePage() {
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
            Flutter Mobile Development
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Clean, performant Android and iOS apps built with Flutter.
          </p>

          <div className="mt-12 space-y-10 text-gray-300 leading-relaxed">
            <p>
              One codebase, two platforms. We build mobile applications that feel
              native, stay maintainable, and connect cleanly to your backend
              systems.
            </p>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">What you get</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Flutter app architecture & state management</li>
                <li>API integration & offline-friendly patterns</li>
                <li>Authentication & secure storage</li>
                <li>Push notifications</li>
                <li>Play Store & App Store readiness guidance</li>
                <li>Handover docs for your team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Typical timeline</h2>
              <ul className="space-y-2">
                <li>
                  <span className="text-white font-medium">MVP app</span> — 4–10
                  weeks depending on screens and integrations
                </li>
                <li>
                  <span className="text-white font-medium">Store polish</span> —
                  icons, listings support, crash-free critical paths
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Investment range</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Focused utility app — from ₦500k</li>
                <li>Full product MVP — typically ₦1.2m–₦4m+</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">FAQ</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-white">Do you build the backend too?</p>
                  <p className="text-gray-400 mt-1">
                    Yes — many clients ship Flutter + Laravel/Node as one package.
                  </p>
                </div>
              </div>
            </section>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
              >
                Start a Mobile Project
              </a>
              <a
                href="https://wa.me/2348085343926?text=Hi%20DoyinTech%2C%20I%27m%20interested%20in%20a%20Flutter%20app."
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
