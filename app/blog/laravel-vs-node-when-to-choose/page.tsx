import Footer from "@/components/ui/Footer";
import BlogPostExtras from "@/components/blog/BlogPostExtras";
import Link from "next/link";
import ShareBar from "@/components/blog/ShareBar";

export const metadata = { alternates: { canonical: "/blog/laravel-vs-node-when-to-choose" },
  title: "Laravel vs Node.js: Which Should You Choose?",
  description:
    "Laravel or Node.js for your next project? A plain comparison based on your team, your timeline and the type of product you are building.",
};

export default function Post() {
  return (
    <>
      <main className="pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-sm text-primary hover:underline">
            ← Back to Blog
          </Link>
          <p className="mt-8 text-sm text-primary font-medium">
            Engineering · August 2026 · 5 min read
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            Laravel vs Node.js — When to Choose Which
          </h1>
          <div className="mt-10 space-y-6 text-brand-soft leading-relaxed">
            <p>
              Both Laravel and Node.js are excellent choices for production
              systems. The right pick depends less on internet debates and more
              on your team skills, delivery timeline, and the product shape.
            </p>
            <p>
              <strong className="text-white">Laravel</strong> shines when you
              need structured MVC apps, admin panels, batteries-included auth,
              and rapid business-logic delivery with PHP talent available.
            </p>
            <p>
              <strong className="text-white">Node.js</strong> is strong for
              real-time features, JavaScript/TypeScript full-stack teams, and
              API-heavy products that share language across frontend and backend.
            </p>
            <p>
              At DoyinTech we ship both. We help you choose based on maintainers,
              risk, and time-to-value — then we build it properly.
            </p>
            <div className="pt-6">
              <a
                href="/contact"
                className="inline-flex px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Get a stack recommendation
              </a>
            </div>

            <ShareBar
              title="Laravel vs Node.js — When to Choose Which"
              path="/blog/laravel-vs-node-when-to-choose"
            />

            <div className="border-t border-white/10 pt-8">
              <p className="text-sm font-semibold text-white mb-3">Related</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/blog/why-production-grade-backends-matter"
                    className="text-primary hover:underline"
                  >
                    Why Production-Grade Backends Matter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/backend"
                    className="text-primary hover:underline"
                  >
                    Backend Engineering services
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <BlogPostExtras slug="laravel-vs-node-when-to-choose" title={"Laravel vs Node.js: Which Should You Choose?"} description={"Laravel or Node.js for your next project? A plain comparison based on your team, your timeline and the type of product you are building."} published="2026-08-26" />
        </article>
      </main>
      <Footer />
    </>
  );
}
