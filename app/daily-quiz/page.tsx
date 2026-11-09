import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import DailyQuiz from "@/components/daily/DailyQuiz";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Daily Money Quiz: 5 Questions on Money and Online Safety";
const DESCRIPTION = "A free two-minute quiz every day: money, business, marketing, tax and staying safe online. Build a streak, learn something useful and challenge friends on WhatsApp.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/daily-quiz" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/daily-quiz" },
};

const FAQS = [
  { q: "When do the questions change?", a: "At midnight on your device. Everyone gets the same five questions on the same day, so you can compare scores with friends and colleagues." },
  { q: "What topics does it cover?", a: "Personal money, running a business, marketing, tax and invoicing, and staying safe from online fraud. Each answer comes with a short explanation and, where it helps, a free tool to try." },
  { q: "How does the streak work?", a: "Finish the quiz on consecutive days to grow your streak. Miss a day and it starts again. Your streak and scores are saved in this browser only." },
  { q: "Can I play more than once a day?", a: "Your first attempt counts. Come back after midnight for a new set." },
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Daily Money Quiz", url: absoluteUrl("/daily-quiz"), applicationCategory: "EducationalApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Daily Money Quiz"
      intro="Five quick questions a day on money, business and staying safe online. Two minutes, one useful thing learned, and a streak to keep."
      jsonLd={jsonLd}
      tool={<DailyQuiz />}
      faqs={FAQS}
      newsletterSource="daily-quiz"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-white">Put what you learn to work</h2>
          <p className="mt-2 text-[14px] text-[#a1a1a6]">A website that ranks on Google, takes payments and brings in enquiries, live in one to two weeks.</p>
          <Link href="/hire" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-5 text-[14px] font-semibold text-black">Get a website</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-white">Two minutes a day adds up</h2>
        <p className="mt-3">Most money mistakes come from things nobody explained: how flat-rate loans really cost, why a profitable business can run out of cash, or how fake payment alerts work. One short question a day, with the reason behind the answer, builds the habits that protect your money.</p>
        <p className="mt-3">Got children? They have their own <Link href="/kids/daily-challenge" className="text-[#ff8c14] underline">daily maths and word challenge</Link>.</p>
      </section>
    </SeoToolPage>
  );
}
