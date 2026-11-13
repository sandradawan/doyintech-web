import Link from "next/link";
import SeoToolPage, { faqJsonLd } from "@/components/tools/SeoToolPage";
import { DailyChecklistTool } from "@/components/tools/RetentionTools";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Daily Checklist: Free Online To-Do List for Today";
const DESCRIPTION = "A free daily checklist that saves itself on your device. Add today's tasks, tick them off and pick up where you stopped tomorrow. No app, no sign-up.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tools/daily-checklist" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/tools/daily-checklist" },
};

const FAQS = [
  { q: "Is this daily checklist free?", a: "Yes. It is free to use, with no account and no app to install. It opens in any browser on a phone or computer." },
  { q: "Where is my checklist saved?", a: "It is saved in the browser on the device you are using. Come back on the same device and browser and your list is still there." },
  { q: "Will I see my list on another phone or computer?", a: "No. The list stays on the device where you made it. Clearing your browser data also clears the list." },
  { q: "How many tasks should a daily checklist have?", a: "Keep it short. Three to five important tasks is a realistic day for most people. A long list usually means some items belong to another day." },
  { q: "What should I put on a daily checklist?", a: "Start with the one task that matters most, then add the small jobs you tend to forget: a call to return, a payment to make, a message to send." },
];

const EXAMPLES: [string, string[]][] = [
  ["Shop or small business", ["Count the float and open the till", "Reply to yesterday's enquiries", "Post one product on status", "Record today's sales", "Bank or transfer the takings"]],
  ["Student", ["Read one topic and make notes", "Do past questions for 30 minutes", "Start the assignment due soonest", "Pack for tomorrow's classes"]],
  ["Office work", ["Clear urgent emails", "Finish the report draft", "Follow up one unpaid invoice", "Plan tomorrow's top three tasks"]],
];

export default function Page() {
  const jsonLd = [
    faqJsonLd(FAQS),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Daily checklist", url: absoluteUrl("/tools/daily-checklist"), applicationCategory: "ProductivityApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  ];
  return (
    <SeoToolPage
      h1="Daily checklist"
      intro="Write down what you need to do today, tick each task off as you finish, and come back tomorrow to carry on. Your list saves itself on this device."
      jsonLd={jsonLd}
      tool={<DailyChecklistTool />}
      faqs={FAQS}
      newsletterSource="daily-checklist"
      upsell={
        <>
          <h2 className="text-[18px] font-semibold text-brand-ink">Stay focused while you work through it</h2>
          <p className="mt-2 text-[14px] text-brand-muted">Pair your list with a 25-minute focus timer and work on one task at a time.</p>
          <Link href="/tools/pomodoro-timer" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-accent px-5 text-[14px] font-semibold text-black">Open the focus timer</Link>
        </>
      }
    >
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">How to use a daily checklist</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Write the list the night before or first thing in the morning.</li>
          <li>Put the most important task at the top and do it first.</li>
          <li>Make each task a clear action, such as &quot;Call the supplier about Friday&apos;s delivery&quot;, not just &quot;Supplier&quot;.</li>
          <li>Tick tasks off as you finish. Move anything left over to tomorrow or delete it.</li>
        </ol>
      </section>
      <section>
        <h2 className="text-[22px] font-semibold text-brand-ink">Example daily checklists</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {EXAMPLES.map(([name, items]) => (
            <div key={name} className="rounded-2xl border border-brand-ink/10 bg-brand-surface p-4">
              <h3 className="text-[15px] font-semibold text-brand-ink">{name}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-brand-muted">
                {items.map((i) => <li key={i}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </SeoToolPage>
  );
}
