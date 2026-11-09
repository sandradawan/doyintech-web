import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

const POSTS = [
  { slug: "website-for-salon-nigeria", label: "Website for a salon in Nigeria" },
  { slug: "website-for-clinic-nigeria", label: "Website for a clinic in Nigeria" },
  { slug: "website-for-restaurant-nigeria", label: "Website for a restaurant in Nigeria" },
  { slug: "property-website-nigeria", label: "Property website in Nigeria" },
  { slug: "website-for-gaming-lounge-nigeria", label: "Website for a gaming lounge" },
  { slug: "website-for-church-event-nigeria", label: "Website for a church or event" },
  { slug: "whatsapp-booking-system-nigeria", label: "WhatsApp booking system" },
  { slug: "practical-ai-automation-for-smes", label: "Practical AI automation for small businesses" },
  { slug: "why-production-grade-backends-matter", label: "Why production-grade backends matter" },
  { slug: "laravel-vs-node-when-to-choose", label: "Laravel vs Node.js" },
];

/** Article structured data, and links on to related posts and the pricing guide. */
export default function BlogPostExtras({ slug, title, description, published }: { slug: string; title: string; description: string; published: string }) {
  const here = POSTS.findIndex((p) => p.slug === slug);
  const related = [...POSTS.slice(here + 1), ...POSTS.slice(0, here)].slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: published,
    url: absoluteUrl(`/blog/${slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
    image: absoluteUrl("/opengraph-image"),
    author: { "@type": "Person", name: "Silas Doyin Jonathan", url: absoluteUrl("/about") },
    publisher: { "@type": "Organization", name: "DoyinTech", logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") } },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Keep reading" className="mt-12 border-t border-white/10 pt-6">
        <h2 className="text-[18px] font-semibold text-white">Keep reading</h2>
        <ul className="mt-2">
          {related.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="inline-flex min-h-11 items-center text-[15px] text-[#ff8c14] hover:underline">{p.label}</Link>
            </li>
          ))}
          <li>
            <Link href="/website-cost-nigeria" className="inline-flex min-h-11 items-center text-[15px] text-[#ff8c14] hover:underline">How much is a website in Nigeria?</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
