import Link from "next/link";

/**
 * The pages people already find us for on Google (Search Console, Nov 2026).
 * Linking them from the homepage and the tools hub tells Google they matter.
 */
const GROUPS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "VAT and GST calculators",
    links: [
      { href: "/vat-calculator/philippines", label: "Philippines VAT calculator" },
      { href: "/vat-calculator/canada", label: "Canada GST/HST calculator" },
      { href: "/vat-calculator/singapore", label: "Singapore GST calculator" },
      { href: "/vat-calculator/norway", label: "Norway VAT calculator" },
      { href: "/vat-calculator/romania", label: "Romania VAT calculator" },
      { href: "/vat-calculator/uae", label: "UAE VAT calculator" },
      { href: "/tools/nigeria-vat-calculator", label: "Nigeria VAT calculator" },
      { href: "/vat-calculator", label: "All VAT calculators" },
    ],
  },
  {
    title: "Pay and money",
    links: [
      { href: "/salary-calculator/canada", label: "Canada salary calculator" },
      { href: "/salary-calculator/ireland", label: "Ireland salary calculator" },
      { href: "/salary-calculator/philippines", label: "Philippines salary calculator" },
      { href: "/salary-calculator/singapore", label: "Singapore salary calculator" },
      { href: "/tools/paye-calculator-nigeria", label: "Nigeria PAYE calculator" },
      { href: "/tools/profit-margin-calculator", label: "Profit margin calculator" },
      { href: "/tools/break-even-calculator", label: "Break-even calculator" },
      { href: "/tools/late-payment-interest-calculator", label: "Late payment interest calculator" },
      { href: "/tools/loan-emi-calculator", label: "Loan repayment calculator" },
    ],
  },
  {
    title: "Everyday tools",
    links: [
      { href: "/tools/case-converter", label: "Uppercase to lowercase converter" },
      { href: "/tools/whatsapp-link-generator", label: "WhatsApp link generator" },
      { href: "/tools/cover-letter", label: "Cover letter maker" },
      { href: "/tools/id-card-generator", label: "ID card maker" },
      { href: "/tools/daily-checklist", label: "Daily checklist" },
      { href: "/tools/meeting-minutes-generator", label: "Meeting minutes generator" },
      { href: "/tools/aggregate-score-calculator", label: "JAMB aggregate score calculator" },
    ],
  },
];

export default function PopularCalculators({ className = "" }: { className?: string }) {
  return (
    <section aria-labelledby="popular-tools-heading" className={className}>
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-link">Free, no sign-up</p>
        <h2 id="popular-tools-heading" className="mt-2 text-[28px] font-semibold tracking-tight text-brand-ink sm:text-[36px]">
          Popular free calculators and tools
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {GROUPS.map((g) => (
            <div key={g.title}>
              <h3 className="text-[15px] font-semibold text-brand-ink">{g.title}</h3>
              <ul className="mt-3 space-y-1">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-9 items-center text-[15px] text-brand-muted transition hover:text-brand-link hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
