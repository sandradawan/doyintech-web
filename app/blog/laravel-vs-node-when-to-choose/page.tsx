import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Laravel vs Node.js — When to Choose Which",
};

export default function Post() {
  return (
    <>
      <main className="pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-sm text-primary hover:underline">
            ← Back to Blog
          </Link>
          <p className="mt-8 text-sm text-primary font-medium">Engineering · August 2026</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            Laravel vs Node.js — When to Choose Which
          </h1>
          <div className="mt-10 space-y-6 text-gray-300 leading-relaxed">
            <p>
              Both Laravel and Node.js are excellent choices for modern backends. The decision usually comes down to team skills, project type, and long-term maintenance.
            </p>
            <p>
              <strong className="text-white">Laravel</strong> shines for business applications, admin panels, content systems, and projects that benefit from a structured, batteries-included framework. It is especially strong when you need rapid development with clear conventions.
            </p>
            <p>
              <strong className="text-white">Node.js</strong> is often preferred for real-time features, heavy API workloads, and teams already deep in the JavaScript/TypeScript ecosystem.
            </p>
            <p>
              At DoyinTech we work with both. We help you pick the stack that fits your product and your team — not the one that is currently trending.
            </p>
            <div className="pt-6">
              <a
                href="/contact"
                className="inline-flex px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Get advice on your stack
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
