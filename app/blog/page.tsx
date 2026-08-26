import Footer from "@/components/ui/Footer";
import Link from "next/link";
import YouTubeShorts from "@/components/sections/YouTubeShorts";
import {
  getLatestYoutubeVideos,
  getYoutubeChannelUrl,
} from "@/lib/youtube";

export const metadata = {
  title: "Blog & Insights",
  description:
    "Practical insights on backend engineering, Laravel, Flutter, APIs, AI automation and building production systems.",
};

const posts = [
  {
    slug: "why-production-grade-backends-matter",
    title: "Why Production-Grade Backends Matter for African Businesses",
    excerpt:
      "Most startups ship fast and break later. Here’s why clean architecture, proper auth, and scalable databases save money in the long run.",
    date: "August 2026",
    category: "Backend",
  },
  {
    slug: "laravel-vs-node-when-to-choose",
    title: "Laravel vs Node.js — When to Choose Which",
    excerpt:
      "Both are excellent. The right choice depends on your team, timeline, and the type of product you’re building.",
    date: "August 2026",
    category: "Engineering",
  },
  {
    slug: "practical-ai-automation-for-smes",
    title: "Practical AI Automation for SMEs (Not Hype)",
    excerpt:
      "You don’t need a research lab. Simple AI workflows can remove repetitive work from sales, support and operations today.",
    date: "August 2026",
    category: "AI Automation",
  },
];

export default async function BlogPage() {
  const videos = await getLatestYoutubeVideos(6);
  const channelUrl = getYoutubeChannelUrl();

  return (
    <>
      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Insights
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
            Blog & Engineering Notes
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl">
            Practical writing on backends, APIs, mobile, Laravel, and AI
            automation — written for founders and teams who need systems that
            work in production.
          </p>

          <div className="mt-14 space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-primary/40 transition"
              >
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="text-primary font-medium">
                    {post.category}
                  </span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
                <h2 className="mt-3 font-display text-xl font-bold text-white group-hover:text-primary transition">
                  {post.title}
                </h2>
                <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-block text-sm text-primary font-medium">
                  Read article →
                </span>
              </Link>
            ))}
          </div>

          {/* Auto-pulled YouTube Shorts */}
          <YouTubeShorts videos={videos} channelUrl={channelUrl} />
        </div>
      </main>
      <Footer />
    </>
  );
}
