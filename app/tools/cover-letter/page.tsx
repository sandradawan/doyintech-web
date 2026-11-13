import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import { CoverLetterTool } from "@/components/tools/ExtendedTools";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Free Cover Letter Maker: Write a Job Cover Letter Online";
const DESCRIPTION = "Free online cover letter maker. Enter the role, the company and your strengths to get a clear draft you can edit and send with your CV. No sign-up.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/cover-letter" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/cover-letter" },
};

const FAQS = [
  { q: "How long should a cover letter be?", a: "Keep it to one page, usually three or four short paragraphs and about 250 to 400 words. Recruiters read quickly." },
  { q: "What should a cover letter include?", a: "The role you are applying for, one or two results that show you can do it, why you want this company, and a polite request for an interview." },
  { q: "Should I use the same cover letter for every job?", a: "No. Keep your structure, but change the company name, the role and the examples so they match each advert. A general letter is easy to spot." },
  { q: "Can I write a cover letter with no experience?", a: "Yes. Use school projects, volunteering, NYSC or internship work, and any results you can describe. Show that you learn fast and finish what you start." },
  { q: "Do I still need a cover letter if the advert does not ask for one?", a: "It usually helps. A short, specific letter gives you a chance to explain why you fit, which a CV alone does not." },
  { q: "Is this cover letter maker free?", a: "Yes. It is free with no sign-up. Edit the draft with your real details before you send it." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Cover letter maker", url: absoluteUrl("/tools/cover-letter"), applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Cover letter maker"
      intro="Build a simple, honest cover letter draft for a job application. Fill in the role and your strengths, then edit it with your real achievements before you send."
      jsonLd={jsonLd}
      tool={<CoverLetterTool />}
      faqs={FAQS}
      newsletterSource="cover-letter"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-brand-ink">Finish the application with a strong CV</h2>
          <p className="mt-2 text-[14px] text-brand-muted">Build a clean, print-ready CV with a live preview to send alongside your letter.</p>
          <Link href="/tools/cv-builder" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">Open the free CV builder</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">The structure employers expect</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li><strong className="text-brand-ink">Greeting.</strong> Use the hiring manager&apos;s name if you can find it. Otherwise &quot;Dear Hiring Manager&quot;.</li>
          <li><strong className="text-brand-ink">Opening.</strong> Name the role and say in one sentence why you fit it.</li>
          <li><strong className="text-brand-ink">Proof.</strong> Give one or two results with numbers, such as customers served, sales made or time saved.</li>
          <li><strong className="text-brand-ink">Why this company.</strong> Mention something specific about them, not a line that could suit anyone.</li>
          <li><strong className="text-brand-ink">Close.</strong> Ask for an interview, thank them and sign off with your name and phone number.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">Mistakes to avoid</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Repeating your CV line by line instead of picking your best two examples.</li>
          <li>Writing the wrong company name after copying an old letter.</li>
          <li>Claims with no evidence, such as &quot;hardworking team player&quot; with no example.</li>
          <li>Inventing experience or figures. Interviewers often ask how you got them.</li>
        </ul>
      </section>
    </SeoToolPage>
  );
}
