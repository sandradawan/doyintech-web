import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import { CaseConverterTool } from "@/components/tools/SearchDemandTools";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Uppercase to Lowercase Converter (and Lowercase to Caps)";
const DESCRIPTION = "Convert uppercase to lowercase, lowercase to ALL CAPS, Title Case or Sentence case online. Paste your text, click once and copy the result. Free, no sign-up.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/case-converter" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/case-converter" },
};

const FAQS = [
  { q: "How do I change uppercase to lowercase online?", a: "Paste your text into the box, choose lowercase, then copy the result. The whole text is converted at once, however long it is." },
  { q: "How do I convert lowercase to all caps?", a: "Paste the text and choose UPPERCASE. Every letter becomes a capital. Numbers, spaces and punctuation stay the same." },
  { q: "What is the difference between Title Case and Sentence case?", a: "Title Case Starts Every Main Word With A Capital. Sentence case only capitalises the first word of each sentence, like normal writing." },
  { q: "I typed with Caps Lock on. Do I have to retype it?", a: "No. Paste the text here and choose Sentence case or lowercase. It takes a second and you keep everything you wrote." },
  { q: "How do I change case in Word, Google Docs or Excel?", a: "In Word, select the text and press Shift + F3 to cycle through cases. In Google Docs, use Format, then Text, then Capitalization. In Excel, use the formulas =LOWER(A1), =UPPER(A1) or =PROPER(A1)." },
  { q: "Is my text stored?", a: "No. The conversion happens in your browser. Nothing you paste is sent to us or saved." },
];

const EXAMPLES: [string, string][] = [
  ["Original", "the QUICK brown fox. it JUMPED over."],
  ["lowercase", "the quick brown fox. it jumped over."],
  ["UPPERCASE", "THE QUICK BROWN FOX. IT JUMPED OVER."],
  ["Title Case", "The Quick Brown Fox. It Jumped Over."],
  ["Sentence case", "The quick brown fox. It jumped over."],
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Uppercase to lowercase converter", url: absoluteUrl("/tools/case-converter"), applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Uppercase to lowercase converter"
      intro="Change text from UPPERCASE to lowercase, lowercase to ALL CAPS, Title Case or Sentence case. Paste, click and copy."
      jsonLd={jsonLd}
      tool={<CaseConverterTool />}
      faqs={FAQS}
      newsletterSource="case-converter"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-brand-ink">More free text tools</h2>
          <p className="mt-2 text-[14px] text-brand-muted">Count words and characters, or clean up messy text before you paste it somewhere else.</p>
          <Link href="/tools" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">See all free tools</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">What each case looks like</h2>
        <table className="mt-4 w-full text-left text-[15px]">
          <thead><tr className="border-b border-brand-ink/10 text-brand-muted"><th className="py-2 pr-4 font-medium">Case</th><th className="py-2 font-medium">Result</th></tr></thead>
          <tbody>
            {EXAMPLES.map(([name, text]) => (
              <tr key={name} className="border-b border-brand-ink/5"><td className="py-2 pr-4 text-brand-ink">{name}</td><td className="py-2">{text}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">When to use each one</h2>
        <p className="mt-3"><strong className="text-brand-ink">lowercase</strong> fixes text typed with Caps Lock on, and is the usual format for email addresses, usernames and web links.</p>
        <p className="mt-3"><strong className="text-brand-ink">UPPERCASE</strong> suits short labels, headings on forms and product codes. Avoid it for long paragraphs, because all capitals are slower to read.</p>
        <p className="mt-3"><strong className="text-brand-ink">Title Case</strong> is for headlines, book and article titles, and names in a list.</p>
        <p className="mt-3"><strong className="text-brand-ink">Sentence case</strong> is for normal writing: essays, reports, messages and captions.</p>
      </section>
    </SeoToolPage>
  );
}
