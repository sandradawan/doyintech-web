import Footer from "@/components/ui/Footer";
import Link from "next/link";
import YouTubeShorts from "@/components/sections/YouTubeShorts";
import {
  getPlaylistVideos,
  getYoutubeChannelUrl,
  getYoutubePlaylistTitle,
  getYoutubePlaylistUrl,
} from "@/lib/youtube";

export const metadata = {
  title: "Blog & Insights",
  description:
    "Practical insights for Nigerian SMEs: websites that get bookings, WhatsApp systems, Laravel, Flutter, and AI automation — plus the Introduction To Web Development playlist.",
};

const posts = [
  {
    slug: "website-for-restaurant-nigeria",
    title: "Website for a Restaurant in Nigeria — Menu, Location & WhatsApp",
    excerpt: "Menu, hours, Maps, and one-tap WhatsApp for reservations or bulk orders.",
    date: "September 2026",
    category: "Local business",
  },
  {
    slug: "website-for-church-event-nigeria",
    title: "Website for a Church or Event Centre in Nigeria",
    excerpt: "Service times, location, programmes, and WhatsApp for hall bookings.",
    date: "September 2026",
    category: "Community",
  },
  {
    slug: "website-for-gaming-lounge-nigeria",
    title: "Website for a Gaming Lounge in Nigeria — Bookings & Tournaments",
    excerpt:
      "Station prices, tournament calendar, Maps pin, and one-tap WhatsApp so gamers reserve seats.",
    date: "September 2026",
    category: "Local business",
  },
  {
    slug: "website-for-clinic-nigeria",
    title: "Website for a Clinic in Nigeria — Appointments via WhatsApp",
    excerpt:
      "Clear services, hours, location, and one-tap WhatsApp booking for clinics.",
    date: "September 2026",
    category: "Local business",
  },
  {
    slug: "property-website-nigeria",
    title: "Property Website in Nigeria — Estates, Leads & Equity Mortgage",
    excerpt:
      "What property sites need to convert serious enquiries — lessons from real builds.",
    date: "September 2026",
    category: "Property",
  },
  {
    slug: "website-for-salon-nigeria",
    title: "Website for a Salon in Nigeria — What Actually Gets Bookings",
    excerpt:
      "How salons and makeup artists turn Instagram into WhatsApp bookings with a simple, fixed-price site.",
    date: "September 2026",
    category: "Local business",
  },
  {
    slug: "whatsapp-booking-system-nigeria",
    title: "WhatsApp Booking System for Nigerian SMEs",
    excerpt:
      "Clinics, lounges, and salons: combine a clear website with one-tap WhatsApp so customers book without friction.",
    date: "September 2026",
    category: "Systems",
  },
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
  const videos = await getPlaylistVideos(10);
  const sorted = [...videos].sort((a, b) => {
    const da = a.published ? new Date(a.published).getTime() : 0;
    const db = b.published ? new Date(b.published).getTime() : 0;
    return db - da;
  });

  return (
    <>
      <main className="bg-black pb-24 pt-24">
        <div className="mx-auto max-w-[980px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[#a1a1a6]">
            Insights
          </p>
          <h1 className="apple-headline mt-3 text-[#f5f5f7]">Blog & notes</h1>
          <p className="apple-subhead mt-4 max-w-2xl">
            Practical writing for Nigerian SMEs — websites that get bookings, WhatsApp systems,
            backends, and AI automation — plus lessons from our YouTube playlist.
          </p>

          <div className="mt-12 space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="apple-card group block p-6 transition hover:border-[#2997ff]/40"
              >
                <div className="flex items-center gap-3 text-[12px] text-[#a1a1a6]">
                  <span className="font-semibold text-[#2997ff]">{post.category}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
                <h2 className="mt-3 text-[22px] font-semibold tracking-tight text-[#f5f5f7] transition group-hover:text-[#2997ff]">
                  {post.title}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-[#a1a1a6]">{post.excerpt}</p>
                <span className="apple-link mt-4 inline-block text-[14px]">Read article ›</span>
              </Link>
            ))}
          </div>

          <YouTubeShorts
            videos={sorted.slice(0, 10)}
            channelUrl={getYoutubeChannelUrl()}
            playlistUrl={getYoutubePlaylistUrl()}
            playlistTitle={getYoutubePlaylistTitle()}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
