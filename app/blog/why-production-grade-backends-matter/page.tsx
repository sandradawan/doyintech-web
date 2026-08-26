import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Why Production-Grade Backends Matter for African Businesses",
};

export default function Post() {
  return (
    <>
      <main className="pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-sm text-primary hover:underline">
            ← Back to Blog
          </Link>
          <p className="mt-8 text-sm text-primary font-medium">Backend · August 2026</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            Why Production-Grade Backends Matter for African Businesses
          </h1>
          <div className="mt-10 space-y-6 text-gray-300 leading-relaxed">
            <p>
              Many businesses start with a quick website or a simple app. That works until real customers arrive, payments increase, or staff need reliable tools every day.
            </p>
            <p>
              A production-grade backend is not about over-engineering. It is about building systems that stay secure, stay fast, and can be maintained when the original developer is busy or unavailable.
            </p>
            <p>
              At DoyinTech we focus on clean architecture, proper authentication, database design that scales, and clear documentation so your product can grow without constant firefighting.
            </p>
            <p>
              If you are planning a new platform or need to stabilise an existing one, we can help you do it the right way.
            </p>
            <div className="pt-6">
              <a
                href="/contact"
                className="inline-flex px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Discuss your project
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
