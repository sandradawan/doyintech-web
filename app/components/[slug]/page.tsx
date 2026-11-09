import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import RelatedLinks, { relatedBy } from "@/components/ui/RelatedLinks";
import {
  ComponentBuyPanel,
  ComponentCodeGate,
} from "@/components/shop/ComponentShop";
import { ComponentLivePreview } from "@/components/shop/LivePreviews";
import { UI_COMPONENTS, getUiComponent, formatCompPrice } from "@/lib/ui-components";
import { publicComponent } from "@/lib/shop/public";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return UI_COMPONENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getUiComponent(slug);
  if (!item) return { title: "Component" };
  const title = `${item.name}: Next.js and Tailwind Component`;
  const description = `${item.description} Next.js and Tailwind source code with a live demo. Pay once and use it in your own projects.`.slice(0, 200);
  return { title, description, alternates: { canonical: `/components/${item.slug}` }, openGraph: { images: ["/opengraph-image"], title, description, url: `/components/${item.slug}` } };
}

export default async function ComponentDetailPage({ params }: Props) {
  const { slug } = await params;
  const found = getUiComponent(slug);
  if (!found) notFound();
  const item = publicComponent(found);

  return (
    <>
      <main className="min-h-screen bg-brand-deep pb-24 pt-24">
        <div className="mx-auto max-w-[960px] px-6">
          <Link href="/components" className="text-[14px] text-[#ff8c14] hover:underline">
            ← All components
          </Link>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <ComponentLivePreview slug={item.slug} />
          </div>
          <p className="mt-2 text-center text-[11px] uppercase tracking-wide text-brand-subtle">
            Live output — always moving so buyers see the result
          </p>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              {item.badge && (
                <span className="rounded-full bg-[#ff8c14]/15 px-2.5 py-1 text-[11px] font-semibold text-[#ff8c14]">
                  {item.badge}
                </span>
              )}
              <h1 className="mt-3 text-[30px] font-semibold text-white sm:text-[36px]">{item.name}</h1>
              <p className="mt-2 text-[16px] text-brand-muted">{item.tagline}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-brand-soft">{item.description}</p>
              <p className="mt-3 text-[13px] text-brand-subtle">
                {formatCompPrice(item.priceNgn)} · {item.stack.join(" · ")}
              </p>
              <ul className="mt-6 space-y-2">
                {item.includes.map((x) => (
                  <li key={x} className="flex gap-2 text-[14px] text-white">
                    <span className="text-[#ff8c14]">✓</span> {x}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <ComponentCodeGate item={item} />
              </div>
            </div>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ComponentBuyPanel item={item} />
            </div>
          </div>
        </div>
        <RelatedLinks heading="More components" links={relatedBy(UI_COMPONENTS, (c) => c.slug, slug, 6).map((c) => ({ href: `/components/${c.slug}`, label: c.name }))} />
      </main>
      <Footer />
    </>
  );
}
