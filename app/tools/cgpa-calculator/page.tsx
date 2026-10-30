import type { Metadata } from "next";
import Link from "next/link";
import CgpaCalculator from "@/components/tools/CgpaCalculator";
import SeoToolPage, { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "CGPA Calculator Nigeria — 5.0 and 4.0 Scale with Degree Class";
const DESCRIPTION =
  "Calculate your GPA and CGPA on the Nigerian university 5-point or polytechnic 4-point scale. See your degree class and the GPA you need to reach a First Class or 2:1.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/cgpa-calculator" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/tools/cgpa-calculator" },
};

const FAQS: Faq[] = [
  {
    q: "How is CGPA calculated in Nigerian universities?",
    a: "Multiply each course's credit units by the grade point (A = 5, B = 4, C = 3, D = 2, E = 1, F = 0) to get quality points. Add all quality points and divide by the total units you've taken. GPA is the same calculation for one semester; CGPA covers every semester so far.",
  },
  {
    q: "What CGPA is a First Class?",
    a: "On the 5.0 scale: First Class 4.50–5.00, Second Class Upper 3.50–4.49, Second Class Lower 2.40–3.49, Third Class 1.50–2.39 and Pass 1.00–1.49. Some institutions use slightly different boundaries, so check your handbook.",
  },
  {
    q: "What about polytechnics (ND and HND)?",
    a: "Polytechnics use a 4.0 scale: Distinction 3.50–4.00, Upper Credit 3.00–3.49, Lower Credit 2.50–2.99 and Pass 2.00–2.49. Choose Polytechnic (4.0) above and the grades switch to AA, A, AB, B and so on.",
  },
  {
    q: "Can I add a CGPA I already have?",
    a: "Yes. Open “Already have a CGPA from earlier semesters?”, enter your current CGPA and the units you've taken, then add only your new courses.",
  },
  {
    q: "Is my data saved?",
    a: "On this device only, so you can come back next semester. Nothing is sent to our servers.",
  },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CGPA Calculator Nigeria",
    url: absoluteUrl("/tools/cgpa-calculator"),
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" },
  },
];

export default function CgpaCalculatorPage() {
  return (
    <SeoToolPage
      h1="CGPA calculator for Nigerian students"
      intro="Add your courses, units and grades to see your GPA, CGPA and degree class on the 5.0 or 4.0 scale, and the GPA you need to reach your target."
      jsonLd={jsonLd}
      tool={<CgpaCalculator />}
      faqs={FAQS}
      newsletterSource="cgpa-calculator"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Final year project coming up?</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">
            Get guided support with topic selection, chapter structure, data analysis and formatting from our{" "}
            <Link href="/students/projects" className="text-[#ff8c14] hover:underline">
              student project team
            </Link>
            , or use the free{" "}
            <Link href="/students" className="text-[#ff8c14] hover:underline">
              student tools
            </Link>
            .
          </p>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Example</h2>
        <p className="mt-3">
          Three courses: GST 101 (2 units, A), MTH 101 (3 units, B) and CHM 101 (3 units, C). Quality points: 2×5 + 3×4 + 3×3 = 31. Units: 8. GPA =
          31 ÷ 8 = 3.88, a Second Class Upper standing on the 5.0 scale.
        </p>
      </section>
    </SeoToolPage>
  );
}
