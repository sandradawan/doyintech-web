import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { faqJsonLd } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Business Problems in Nigeria and Free Tools That Solve Them";
const DESCRIPTION =
  "Power costs, cash flow, import duty, staff costs, tax deadlines, procurement, paperwork and finding customers: the biggest bottlenecks for Nigerian businesses, offices and government, each with a free tool.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/business-solutions" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/business-solutions" },
};

type Problem = {
  id: string;
  problem: string;
  who: string;
  pain: string;
  fix: string;
  tools: [string, string][]; // [label, href]
  more?: [string, string];
};

const PROBLEMS: Problem[] = [
  {
    id: "power",
    problem: "Fuel and power eat the profit",
    who: "Shops, offices, schools, clinics, hotels",
    pain: "Generators run for hours every day, and the bill moves every time the pump price does.",
    fix: "Measure what fuel really costs per month, then size the solar system that replaces it and see the payback.",
    tools: [["Solar vs generator calculator", "/tools/solar-vs-generator-calculator"]],
  },
  {
    id: "cash",
    problem: "Profitable on paper, out of cash in the bank",
    who: "Every business, NGOs, contractors",
    pain: "Customers pay late while salaries, rent and suppliers are due on fixed dates.",
    fix: "Forecast 13 weeks ahead, see the week cash runs out, and invoice and chase faster.",
    tools: [["13-week cash flow forecast", "/tools/cash-flow-forecast"], ["Invoice generator", "/tools/invoice-generator-nigeria"], ["Receipt generator", "/tools/receipt-generator-nigeria"]],
    more: ["Bookkeeping ebook", "/ebooks/bookkeeping-for-small-businesses-nigeria"],
  },
  {
    id: "imports",
    problem: "Imports cost far more than the supplier invoice",
    who: "Importers, distributors, retailers",
    pain: "Duty, levies, VAT, clearing and haulage arrive after you have already set your prices.",
    fix: "Work out the landed cost per unit before you pay the supplier, then price from it.",
    tools: [["Import duty calculator", "/tools/import-duty-calculator-nigeria"], ["Profit margin calculator", "/tools/profit-margin-calculator"]],
  },
  {
    id: "staff",
    problem: "Staff cost more than the salary",
    who: "Employers, HR, start-ups",
    pain: "Pension, NSITF, ITF, 13th month, HMO and hiring costs are left out of the budget.",
    fix: "Know the full cost of every hire, run payroll correctly and give staff proper payslips.",
    tools: [["True cost of an employee", "/tools/employee-cost-calculator-nigeria"], ["Payslip generator", "/tools/payslip-generator-nigeria"], ["PAYE calculator 2026", "/tools/paye-calculator-nigeria"]],
    more: ["SME payroll & PAYE sheet", "/products/sme-payroll-paye-sheet"],
  },
  {
    id: "compliance",
    problem: "Missed tax and CAC deadlines",
    who: "Companies, business names, NGOs, employers",
    pain: "Penalties, interest and no tax clearance certificate when you need it for a contract or loan.",
    fix: "Get every PAYE, pension, VAT, WHT, CIT, ITF and CAC date in your calendar with reminders.",
    tools: [["Compliance calendar", "/tools/compliance-calendar-nigeria"], ["Small company tax checker", "/tools/small-company-tax-checker"], ["VAT calculator", "/tools/nigeria-vat-calculator"]],
  },
  {
    id: "procurement",
    problem: "Procurement that is slow and hard to defend",
    who: "Ministries, agencies, local governments, companies, NGOs",
    pain: "Bids scored by hand on paper, inconsistent methods, and reports that invite complaints.",
    fix: "Score every bid on the same weighted criteria and print a ranked, signed evaluation report.",
    tools: [["Bid evaluation tool", "/tools/bid-evaluation-tool"], ["Purchase order generator", "/tools/purchase-order-generator"]],
  },
  {
    id: "paperwork",
    problem: "Hours lost to paperwork",
    who: "Offices, schools, churches, associations",
    pain: "Minutes, letters, certificates and ID cards typed from scratch every time.",
    fix: "Generate correctly formatted documents in minutes and print them as PDF.",
    tools: [["Meeting minutes", "/tools/meeting-minutes-generator"], ["Letter generator", "/tools/letter-generator"], ["Certificate generator", "/tools/certificate-generator"], ["ID card generator", "/tools/id-card-generator"]],
    more: ["Office admin templates", "/products/office-admin-templates-bundle"],
  },
  {
    id: "funding",
    problem: "Can't get a loan or grant",
    who: "SMEs, founders, cooperatives",
    pain: "Lenders and grant panels reject plans without clear numbers.",
    fix: "Write a plan with start-up costs, break-even and payback, and know where the funding is.",
    tools: [["Business plan generator", "/tools/business-plan-generator"], ["Break-even calculator", "/tools/break-even-calculator"]],
    more: ["Grants and funding ebook", "/ebooks/grants-and-funding-for-nigerian-smes"],
  },
  {
    id: "customers",
    problem: "Customers can't find you online",
    who: "Every business that sells locally",
    pain: "Buyers search Google and WhatsApp first; without a site and profile you lose them to competitors.",
    fix: "Get a fast website, a Google Business Profile and WhatsApp ordering that brings enquiries.",
    tools: [["Website cost calculator", "/tools/website-calculator"], ["WhatsApp link generator", "/tools/whatsapp-link-generator"]],
    more: ["Website prices", "/pricing"],
  },
];

const FAQS = [
  { q: "What is the biggest problem facing small businesses in Nigeria?", a: "Owners most often name power costs, cash flow and access to finance, followed by tax compliance, import costs and finding customers. Each has a free tool on this page that turns it into numbers you can act on." },
  { q: "Are these tools free?", a: "Yes. Every tool on this page is free, works in your browser and needs no account. Your figures stay on your device." },
  { q: "Can government agencies use them?", a: "Yes. The bid evaluation tool, compliance calendar, minutes generator, purchase orders and staff cost calculator are built for ministries, agencies and local governments as well as companies and NGOs." },
  { q: "Can DoyinTech build a custom version for our organisation?", a: "Yes. We build dashboards, portals and internal systems: e-procurement, payroll, compliance tracking and cash forecasting connected to your own data." },
];

const jsonLd = [
  faqJsonLd(FAQS),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Business problems and the tools that solve them",
    itemListElement: PROBLEMS.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.problem, url: absoluteUrl(p.tools[0][1]) })),
  },
];

export default function BusinessSolutionsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-black pb-16 pt-24">
        <header className="mx-auto max-w-[780px] px-6 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">Free tools · no sign-up</p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-white sm:text-[46px]">The problems that hold businesses back, and the tools that fix them</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[#c7cdd8]">
            Power, cash, imports, staff costs, deadlines, procurement, paperwork, funding and customers. Pick your biggest problem and get a number you can act on today.
          </p>
        </header>

        <nav aria-label="Jump to a problem" className="mx-auto mt-8 flex max-w-[980px] flex-wrap justify-center gap-2 px-6">
          {PROBLEMS.map((p) => (
            <a key={p.id} href={`#${p.id}`} className="inline-flex min-h-10 items-center rounded-full border border-white/15 px-4 text-[13px] font-semibold text-[#c7cdd8] hover:border-[#ff8c14] hover:text-white">
              {p.problem.split(" ").slice(0, 3).join(" ")}
            </a>
          ))}
        </nav>

        <div className="mx-auto mt-10 grid max-w-[1100px] gap-4 px-6 md:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <section key={p.id} id={p.id} className="flex scroll-mt-28 flex-col rounded-2xl border border-white/10 bg-[#141a28] p-6">
              <p className="text-[12px] font-semibold text-[#ff8c14]">Problem {i + 1}</p>
              <h2 className="mt-1 text-[19px] font-semibold leading-snug text-white">{p.problem}</h2>
              <p className="mt-1 text-[13px] text-[#a1a1a6]">{p.who}</p>
              <p className="mt-3 text-[14px] text-[#c7cdd8]">{p.pain}</p>
              <p className="mt-2 text-[14px] text-white"><span className="font-semibold text-[#3ddc97]">Fix: </span>{p.fix}</p>
              <ul className="mt-4 space-y-2">
                {p.tools.map(([label, href], k) => (
                  <li key={href}>
                    <Link href={href} className={`flex min-h-11 items-center justify-between rounded-xl px-4 text-[14px] font-semibold ${k === 0 ? "bg-[#ff8c14] text-black hover:bg-[#ffa040]" : "border border-white/15 text-white hover:border-white/35"}`}>
                      {label}
                      <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                    </Link>
                  </li>
                ))}
              </ul>
              {p.more && (
                <Link href={p.more[1]} className="mt-3 text-[13px] text-[#a1a1a6] underline underline-offset-2 hover:text-white">
                  Go further: {p.more[0]}
                </Link>
              )}
            </section>
          ))}
        </div>

        <section className="mx-auto mt-14 max-w-[980px] px-6">
          <div className="rounded-2xl border border-[#ff8c14]/30 bg-[#ff8c14]/5 p-6 sm:p-8">
            <h2 className="text-[22px] font-semibold text-white">Need it built around your own data?</h2>
            <p className="mt-2 text-[15px] text-[#c7cdd8]">
              We build e-procurement portals, payroll and HR systems, compliance trackers and owner dashboards for companies, schools, NGOs and government agencies.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex min-h-11 items-center rounded-full bg-[#ff8c14] px-6 text-[14px] font-semibold text-black">Talk to us</Link>
              <Link href="/tools" className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-6 text-[14px] font-semibold text-white">All free tools</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-[780px] px-6">
          <h2 className="text-[24px] font-semibold text-white">Questions</h2>
          <dl className="mt-4 space-y-5">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt className="text-[16px] font-semibold text-white">{f.q}</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-[#c7cdd8]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
