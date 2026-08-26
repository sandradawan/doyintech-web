import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Flutter Mobile Development",
  description: "Cross-platform Flutter apps for Android and iOS by DoyinTech.",
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

          <div className="mt-12 space-y-8 text-gray-300 leading-relaxed">
            <p>
              One codebase, two platforms. We build mobile applications that feel native, stay maintainable, and connect cleanly to your backend systems.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Flutter app architecture</li>
              <li>API integration & offline support</li>
              <li>Authentication & secure storage</li>
              <li>Push notifications</li>
              <li>Play Store & App Store readiness</li>
            </ul>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold"
              >
                Start a Mobile Project
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
