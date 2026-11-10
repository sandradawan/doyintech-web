import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import GlobalVatCalculator from "@/components/tools/GlobalVatCalculator";
import { VAT_COUNTRIES, VAT_EXISTING_PAGES, getVatCountry, ratePresets, vatHref, vatSplit, type VatCountry } from "@/lib/global/vat-rates";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return VAT_COUNTRIES.filter((v) => !VAT_EXISTING_PAGES[v.slug]).map((v) => ({ country: v.slug }));
}

type Params = { params: Promise<{ country: string }> };

const pct = (n: number) => `${n}%`;

function money(v: VatCountry, n: number) {
  try {
    return new Intl.NumberFormat(v.locale, { style: "currency", currency: v.currency }).format(n);
  } catch {
    return `${v.currency} ${n.toFixed(2)}`;
  }
}

/** "United Kingdom VAT Calculator", "GST Calculator Australia", "Consumption Tax Calculator Japan". */
function headline(v: VatCountry) {
  if (v.tax === "VAT") return `${v.country} VAT Calculator`;
  const tax = v.tax.replace(/\b[a-z]/g, (ch) => ch.toUpperCase());
  return `${tax} Calculator ${v.country}`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const v = getVatCountry((await params).country);
  if (!v) return {};
  const title = `${headline(v)} 2026 — Add or Remove ${pct(v.standard)} ${v.tax}`;
  const description = `Free ${v.country} ${v.tax} calculator: add ${v.tax} to a price or take it out of a ${v.currency} amount at ${pct(v.standard)}${v.reduced?.length || v.presets ? " or the other rates" : ""}. Instant net, ${v.tax} and gross totals.`;
  const url = `/vat-calculator/${v.slug}`;
  return { title, description, alternates: { canonical: url }, openGraph: { images: ["/opengraph-image"], title, description, url } };
}

export default async function VatCountryPage({ params }: Params) {
  const v = getVatCountry((await params).country);
  if (!v || VAT_EXISTING_PAGES[v.slug]) notFound();

  const presets = ratePresets(v);
  const defaultRate = v.standard;
  const ex = vatSplit(1000, defaultRate, "add");
  const back = vatSplit(1000, defaultRate, "remove");
  const factor = (1 + defaultRate / 100).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  const name = v.taxLong ? `${v.tax} (${v.taxLong})` : v.tax;
  const neighbours = VAT_COUNTRIES.filter((x) => x.region === v.region && x.slug !== v.slug).slice(0, 8);

  const faqs = [
    { q: `What is the ${v.tax} rate in ${v.country}?`, a: `The standard ${v.tax} rate in ${v.country} is ${pct(v.standard)}.${v.presets ? ` Other rates: ${v.presets.map((p) => p.label).join(", ")}.` : v.reduced?.length ? ` Reduced rates of ${v.reduced.map(pct).join(", ")} apply to specific goods and services.` : ""}${v.note ? " " + v.note : ""}` },
    { q: `How do I add ${v.tax} to a price?`, a: `Multiply the net price by ${(defaultRate / 100).toString()} to get the ${v.tax}, then add it. For ${money(v, 1000)}: ${v.tax} is ${money(v, ex.tax)} and the total is ${money(v, ex.gross)}.` },
    { q: `How do I remove ${v.tax} from a price?`, a: `Divide the price that includes ${v.tax} by ${factor}. For ${money(v, 1000)} including ${v.tax}, the net price is ${money(v, back.net)} and the ${v.tax} is ${money(v, back.tax)}.` },
    { q: "Is this calculator free?", a: "Yes. It works in your browser with no sign-up, and you can turn the result into a free invoice in the same currency." },
  ];

  const jsonLd = [
    faqJsonLd(faqs),
    { "@context": "https://schema.org", "@type": "WebApplication", name: headline(v), url: absoluteUrl(`/vat-calculator/${v.slug}`), applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "VAT calculators", item: absoluteUrl("/vat-calculator") },
        { "@type": "ListItem", position: 2, name: v.country, item: absoluteUrl(`/vat-calculator/${v.slug}`) },
      ],
    },
  ];

  return (
    <SeoToolPage
      h1={`${headline(v)} (${pct(v.standard)})`}
      intro={`Add ${name} to a price or take it out of a ${v.currency} total in one step. Pick the rate, type the amount, and get the net, ${v.tax} and gross figures instantly.`}
      jsonLd={jsonLd}
      tool={<GlobalVatCalculator tax={v.tax} currency={v.currency} locale={v.locale} presets={presets} defaultRate={defaultRate} />}
      faqs={faqs}
      newsletterSource={`vat-${v.slug}`}
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-brand-ink">Invoice your customers in {v.currency}</h2>
          <p className="mt-2 text-[14px] text-brand-muted">The free invoice generator adds {v.tax} at {pct(v.standard)}, totals it in {v.currency}, and saves a professional PDF.</p>
          <Link href={`/tools/invoice-generator?currency=${v.currency}&tax=${defaultRate}`} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">Make an invoice</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">{v.tax} rates in {v.country}</h2>
        <table className="mt-4 w-full text-left text-[15px]">
          <thead><tr className="border-b border-brand-ink/10 text-brand-muted"><th className="py-2 font-medium">Rate</th><th className="py-2 font-medium">{v.tax} on {money(v, 1000)}</th></tr></thead>
          <tbody>
            {presets.map((p) => (
              <tr key={p.label} className="border-b border-brand-ink/5"><td className="py-2 text-brand-ink">{p.label}</td><td className="py-2">{money(v, vatSplit(1000, p.rate, "add").tax)}</td></tr>
            ))}
          </tbody>
        </table>
        {v.note && <p className="mt-3">{v.note}</p>}
        <p className="mt-3">{v.authority ? `${v.tax} in ${v.country} is administered by ${v.authority}. ` : ""}Rates change; confirm the rate for your goods or service with the tax authority before you file.</p>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">The {v.tax} formulas</h2>
        <p className="mt-3"><strong className="text-brand-ink">Adding {v.tax}:</strong> gross = net × {factor}. A net price of {money(v, 1000)} becomes {money(v, ex.gross)}, of which {money(v, ex.tax)} is {v.tax}.</p>
        <p className="mt-3"><strong className="text-brand-ink">Removing {v.tax}:</strong> net = gross ÷ {factor}. A price of {money(v, 1000)} including {v.tax} is {money(v, back.net)} before {v.tax}.</p>
        <p className="mt-3">A common mistake is taking {pct(defaultRate)} off a {v.tax}-inclusive price. That removes too much: always divide by {factor} instead.</p>
      </section>
      {neighbours.length > 0 && (
        <section>
          <h2 className="text-[22px] font-semibold text-brand-ink">{v.region}: other calculators</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {neighbours.map((n) => (
              <li key={n.slug}><Link href={vatHref(n)} className="inline-flex min-h-10 items-center rounded-full border border-brand-ink/15 px-4 text-[13px] text-brand-ink hover:border-brand-link">{n.country} {pct(n.standard)}</Link></li>
            ))}
            <li><Link href="/vat-calculator" className="inline-flex min-h-10 items-center rounded-full border border-brand-ink/15 px-4 text-[13px] text-brand-link">All countries</Link></li>
          </ul>
        </section>
      )}
    </SeoToolPage>
  );
}
