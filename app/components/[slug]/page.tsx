import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import {
  ComponentBuyPanel,
  ComponentCodeGate,
} from "@/components/shop/ComponentShop";
import { UI_COMPONENTS, getUiComponent, formatCompPrice } from "@/lib/ui-components";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return UI_COMPONENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getUiComponent(slug);
  if (!item) return { title: "Component" };
  return { title: item.name + " · Next.js component", description: item.description };
}

export default async function ComponentDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getUiComponent(slug);
  if (!item) notFound();

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[960px] px-6">
          <Link href="/components" className="text-[14px] text-[#ff8c14] hover:underline">
            ← All components
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              {item.badge && (
                <span className="rounded-full bg-[#ff8c14]/15 px-2.5 py-1 text-[11px] font-semibold text-[#ff8c14]">
                  {item.badge}
                </span>
              )}
              <h1 className="mt-3 text-[30px] font-semibold text-white sm:text-[36px]">{item.name}</h1>
              <p className="mt-2 text-[16px] text-[#a1a1a6]">{item.tagline}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-[#c7cdd8]">{item.description}</p>
              <p className="mt-3 text-[13px] text-[#86868b]">
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
      </main>
      <Footer />
    </>
  );
}
