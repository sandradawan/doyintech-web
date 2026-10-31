import type { Metadata } from "next";
import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import { getOfficeToolPage } from "@/lib/tools/office-pages";
import { absoluteUrl } from "@/lib/site";

export function officeToolMetadata(slug: string): Metadata {
  const p = getOfficeToolPage(slug);
  const url = `/tools/${slug}`;
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: { title: p.title, description: p.description, url },
  };
}

/** Server-rendered landing for a free office/business/student tool: the tool, a short guide, FAQ and JSON-LD. */
export default function OfficeToolLanding({ slug, tool }: { slug: string; tool: React.ReactNode }) {
  const p = getOfficeToolPage(slug);
  const jsonLd = [
    faqJsonLd(p.faqs),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: p.appName,
      url: absoluteUrl(`/tools/${slug}`),
      applicationCategory: p.appCategory,
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
    },
  ];
  return (
    <SeoToolPage
      h1={p.h1}
      intro={p.intro}
      jsonLd={jsonLd}
      tool={tool}
      faqs={p.faqs}
      newsletterSource={slug}
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">{p.upsell.heading}</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">{p.upsell.body}</p>
          <Link href={p.upsell.href} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">
            {p.upsell.cta}
          </Link>
        </>
      }
    >
      {p.guide.map(([h, body]) => (
        <section key={h}>
          <h2 className="text-[22px] font-semibold text-white">{h}</h2>
          <p className="mt-3">{body}</p>
        </section>
      ))}
    </SeoToolPage>
  );
}
