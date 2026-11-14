import { Money } from "@/components/ui/Price";
import BundleBuyButton from "@/components/ebooks/BundleBuyButton";
import { EBOOK_BUNDLES, bundleBooks, bundleListPrice, type EbookBundle } from "@/lib/ebooks/bundles";

function BundleCard({ bundle, highlight }: { bundle: EbookBundle; highlight?: boolean }) {
  const books = bundleBooks(bundle);
  const list = bundleListPrice(bundle);
  const save = Math.round((1 - bundle.priceNgn / list) * 100);
  return (
    <article className={`apple-card relative flex h-full flex-col p-6 ${highlight ? "ring-1 ring-brand-link/50" : ""}`}>
      {bundle.badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand-accent px-3 py-1 text-[11px] font-semibold text-black">{bundle.badge}</span>
      )}
      <h3 className="text-[19px] font-semibold tracking-tight text-brand-ink">{bundle.name}</h3>
      <p className="mt-1 text-[14px] text-brand-muted">{bundle.blurb}</p>
      <p className="mt-4">
        <span className="text-[30px] font-semibold tracking-tight text-brand-ink">
          <Money ngn={bundle.priceNgn} />
        </span>{" "}
        <span className="text-[14px] text-brand-subtle line-through">
          <Money ngn={list} />
        </span>
      </p>
      <p className="text-[13px] font-semibold text-brand-link">
        {books.length} ebooks · save {save}%
      </p>
      <details className="mt-3 flex-1 text-[13px] text-brand-muted">
        <summary className="cursor-pointer text-brand-ink/90">What&apos;s inside</summary>
        <ul className="mt-2 space-y-1">
          {books.map((b) => (
            <li key={b.id}>· {b.title}</li>
          ))}
        </ul>
      </details>
      <div className="mt-5">
        <BundleBuyButton productId={bundle.id} label={`Get all ${books.length} ebooks`} />
      </div>
    </article>
  );
}

/** Bundle offers for the ebook store; pass `only` to show a single pack (e.g. on an ebook's page). */
export default function EbookBundles({ only }: { only?: EbookBundle[] }) {
  const bundles = only ?? EBOOK_BUNDLES;
  return (
    <section aria-labelledby="bundles-heading" className="mt-12">
      <h2 id="bundles-heading" className="text-[24px] font-semibold tracking-tight text-brand-ink sm:text-[30px]">
        {only ? "Get it in a bundle and save" : "Ebook bundles: buy together and save"}
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] text-brand-muted">
        One payment unlocks every book in the pack to read online and download as PDF. Pay by card from any country.
      </p>
      <div className={`mt-8 grid gap-5 ${only ? "max-w-3xl sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
        {bundles.map((b) => (
          <BundleCard key={b.id} bundle={b} highlight={!only && Boolean(b.badge)} />
        ))}
      </div>
    </section>
  );
}
