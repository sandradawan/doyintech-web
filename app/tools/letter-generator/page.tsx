import type { Metadata } from "next";
import Link from "next/link";
import LetterGenerator from "@/components/tools/LetterGenerator";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Free Letter Generator — Application, Resignation, Leave & SIWES Letters";
const DESCRIPTION =
  "Write a formal job application, resignation, leave request or SIWES placement letter in the Nigerian format. Fill a few fields, edit the wording and save as PDF free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/letter-generator" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/letter-generator" },
};

const FAQS: Faq[] = [
  {
    q: "What is the correct format for a formal letter in Nigeria?",
    a: "Your address and the date at the top right, the recipient's name, title and address on the left, a salutation (Dear Sir/Madam), a bold underlined subject line, the body in short paragraphs, then “Yours faithfully” (when you don't know the person's name) or “Yours sincerely” (when you do), your signature and full name.",
  },
  {
    q: "How long should a resignation notice be?",
    a: "Check your employment contract. One month is common in Nigeria; some contracts allow payment in lieu of notice.",
  },
  {
    q: "What do I attach to a SIWES placement letter?",
    a: "Usually your school's introduction (IT) letter, your SIWES logbook or ITF forms if the company asks, and a short CV.",
  },
  {
    q: "Is it free?",
    a: "Yes. Letters are created on your device and nothing is sent to our servers.",
  },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Letter Generator",
    url: absoluteUrl("/tools/letter-generator"),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

export default function LetterGeneratorPage() {
  return (
    <SeoToolPage
      h1="Free formal letter generator"
      intro="Job application, resignation, leave request or SIWES placement letter in the standard Nigerian format. Fill a few fields, edit the wording, then print or save as PDF."
      jsonLd={jsonLd}
      tool={<LetterGenerator />}
      faqs={FAQS}
      newsletterSource="letter-generator"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Applying for jobs?</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            Pair your letter with a clean CV from the{" "}
            <Link href="/tools/cv-builder" className="text-[#ff8c14] hover:underline">
              free CV builder
            </Link>{" "}
            and a tailored{" "}
            <Link href="/tools/cover-letter" className="text-[#ff8c14] hover:underline">
              cover letter
            </Link>
            . Hiring instead? Use the{" "}
            <Link href="/tools/offer-letter" className="text-[#ff8c14] hover:underline">
              offer letter tool
            </Link>
            .
          </p>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Tips for a letter that gets read</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Keep it to one page and three or four short paragraphs.</li>
          <li>Put the purpose in the subject line and the first sentence.</li>
          <li>Address a named person when you can; it changes “Yours faithfully” to “Yours sincerely”.</li>
          <li>Sign it, save as PDF and name the file clearly, for example “Ada-Obi-Application-Letter.pdf”.</li>
        </ul>
      </section>
    </SeoToolPage>
  );
}
