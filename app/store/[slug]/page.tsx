import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { BuyDownloadPanel, StoreNav } from "@/components/store/StoreShell";
import { getListingBySlug, formatNgn } from "@/lib/store/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getListingBySlug(slug);
  return { title: item ? `${item.title} · DoyinStore` : "Store" };
}

export default async function StoreDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getListingBySlug(slug);
  if (!item || item.reviewStatus !== "approved") notFound();

  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pt-24 pb-24">
        <div className="mx-auto max-w-[980px] px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link href="/store" className="text-[14px] text-[#ff8c14] hover:underline">
              ← Store
            </Link>
            <StoreNav />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-4xl">
                  {item.iconEmoji}
                </div>
                <div>
                  <h1 className="text-[28px] font-semibold text-white sm:text-[34px]">
                    {item.title}
                  </h1>
                  <p className="mt-1 text-[14px] text-[#a1a1a6]">
                    {item.developerName} · v{item.version} · {item.platform}
                  </p>
                  <p className="mt-2 text-[13px] text-emerald-400/90">
                    ✓ Security reviewed
                    {item.virusScanStatus === "clean" ? " · Scan clean" : ""}
                  </p>
                </div>
              </div>

              <p className="mt-8 whitespace-pre-line text-[15px] leading-relaxed text-[#c7cdd8]">
                {item.description}
              </p>

              <h2 className="mt-10 text-[13px] font-semibold uppercase tracking-wide text-[#86868b]">
                Features
              </h2>
              <ul className="mt-3 space-y-2">
                {item.features.map((f) => (
                  <li key={f} className="flex gap-2 text-[14px] text-white">
                    <span className="text-[#ff8c14]">✓</span> {f}
                  </li>
                ))}
              </ul>

              {item.sha256 && (
                <p className="mt-8 break-all font-mono text-[11px] text-[#86868b]">
                  SHA-256: {item.sha256}
                </p>
              )}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <BuyDownloadPanel item={item} />
              <p className="mt-3 text-center text-[12px] text-[#86868b]">
                {formatNgn(item.priceNgn)} · {item.downloads} downloads
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
