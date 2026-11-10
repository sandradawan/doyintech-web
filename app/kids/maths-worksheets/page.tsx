import type { Metadata } from "next";
import KidsShell, { SAFETY_FAQ } from "@/components/kids/KidsShell";
import WorksheetGenerator from "@/components/kids/WorksheetGenerator";

const TITLE = "Free Printable Maths Worksheets with Answers (Ages 5 to 11)";
const DESCRIPTION = "Make free printable maths worksheets for addition, subtraction, times tables, division or mixed practice in three difficulty levels, with an answer key.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/kids/maths-worksheets" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/kids/maths-worksheets" },
};

const FAQS = [
  { q: "Are the worksheets really free?", a: "Yes. Make and print as many as you like. Each one has 30 questions and an answer key on the second page." },
  { q: "What is the sheet code for?", a: "Each sheet has a code. Type the same code, topic and difficulty to print exactly the same sheet again, for example for a whole class or a retry next week. Press New questions for a fresh sheet." },
  { q: "Can I save it as a PDF instead of printing?", a: "Yes. In the print window, choose Save as PDF as the printer." },
  SAFETY_FAQ,
];

export default function Page() {
  return (
    <KidsShell
      h1="Printable maths worksheets"
      intro="For parents and teachers: choose a topic and level, then print a sheet of 30 questions with the answers on page 2."
      tool={<WorksheetGenerator />}
      faqs={FAQS}
      appName="Printable maths worksheet generator"
      path="/kids/maths-worksheets"
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">Which level for which class?</h2>
        <p className="mt-3"><strong className="text-brand-ink">Easy</strong> suits Primary 1–2 (ages 5–7): adding and taking away to 20, 2× to 5× tables.</p>
        <p className="mt-3"><strong className="text-brand-ink">Medium</strong> suits Primary 3–4 (ages 7–9): numbers to 100 and tables to 12 × 12.</p>
        <p className="mt-3"><strong className="text-brand-ink">Hard</strong> suits Primary 5–6 (ages 9–11): numbers into the hundreds and bigger multiplication and division.</p>
      </section>
    </KidsShell>
  );
}
