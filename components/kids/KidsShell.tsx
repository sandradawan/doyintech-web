import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { faqJsonLd, type Faq } from "@/components/tools/SeoToolPage";
import { absoluteUrl } from "@/lib/site";

export const KIDS_GAMES = [
  { href: "/kids/daily-challenge", icon: "📅", name: "Daily challenge", desc: "New maths and word puzzles every day. Keep your streak!", color: "from-brand-accent to-pink-500" },
  { href: "/kids/times-tables", icon: "✖️", name: "Times tables race", desc: "How many can you answer in 60 seconds?", color: "from-sky-400 to-indigo-500" },
  { href: "/kids/memory-game", icon: "🧠", name: "Memory match", desc: "Find the pairs: animals, fruits and space.", color: "from-green-400 to-teal-500" },
  { href: "/kids/maths-worksheets", icon: "🖨️", name: "Printable worksheets", desc: "For parents and teachers: free sheets with answers.", color: "from-yellow-300 to-orange-400" },
] as const;

/** Paid packs for parents, shown under every kids page. */
export function ParentPacks() {
  return (
    <section className="rounded-3xl border border-brand-ink/10 bg-brand-surface p-6">
      <p className="t-eyebrow">For parents</p>
      <h2 className="mt-2 text-[22px] font-semibold text-brand-ink">Printable packs for home</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href="/products/primary-maths-practice-workbook" className="rounded-2xl border border-brand-ink/10 bg-brand-well p-4 hover:border-brand-link">
          <p className="text-[16px] font-semibold text-brand-ink">Primary Maths Practice Workbook</p>
          <p className="mt-1 text-[14px] text-brand-muted">40 graded worksheets with answers, ages 5–11.</p>
          <p className="mt-2 text-[15px] font-semibold text-brand-link">₦3,500 · $5</p>
        </Link>
        <Link href="/products/kids-routine-reward-holiday-pack" className="rounded-2xl border border-brand-ink/10 bg-brand-well p-4 hover:border-brand-link">
          <p className="text-[16px] font-semibold text-brand-ink">Routine, Reward Chart & Holiday Pack</p>
          <p className="mt-1 text-[14px] text-brand-muted">Routines, chores, screen time agreement, holiday plan.</p>
          <p className="mt-2 text-[15px] font-semibold text-brand-link">₦2,500 · $4</p>
        </Link>
      </div>
      <p className="mt-4 text-[13px] text-brand-muted">
        Run a school? We build <Link href="/school-management-software-nigeria" className="text-brand-link underline">school websites and result portals</Link>.
      </p>
    </section>
  );
}

/** Layout for a kids game page: big, friendly, no sign-up, with notes and packs for parents below. */
export default function KidsShell({
  h1,
  intro,
  tool,
  faqs,
  children,
  appName,
  path,
}: {
  h1: string;
  intro: string;
  tool: React.ReactNode;
  faqs: Faq[];
  children?: React.ReactNode;
  appName: string;
  path: string;
}) {
  const jsonLd = [
    faqJsonLd(faqs),
    { "@context": "https://schema.org", "@type": "WebApplication", name: appName, url: absoluteUrl(path), applicationCategory: "EducationalApplication", operatingSystem: "Any", isAccessibleForFree: true, audience: { "@type": "EducationalAudience", educationalRole: "student" }, offers: { "@type": "Offer", price: "0", priceCurrency: "NGN" } },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-brand-deep pb-24 pt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link href="/kids" className="text-[15px] font-semibold text-brand-link hover:underline">← Kids zone</Link>
          <h1 className="mt-3 text-[34px] font-black tracking-tight text-brand-ink sm:text-[44px]">{h1}</h1>
          <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-brand-soft">{intro}</p>

          <div className="mt-6">{tool}</div>

          <nav aria-label="More games" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {KIDS_GAMES.filter((g) => g.href !== path).map((g) => (
              <Link key={g.href} href={g.href} className={`rounded-2xl bg-gradient-to-br ${g.color} p-4 text-black transition hover:scale-[1.02]`}>
                <span className="text-[28px]" aria-hidden>{g.icon}</span>
                <span className="mt-1 block text-[15px] font-bold">{g.name}</span>
              </Link>
            ))}
          </nav>

          <article className="mx-auto mt-14 max-w-3xl space-y-10 text-[15px] leading-relaxed text-brand-soft">
            {children}
            <section>
              <h2 className="text-[22px] font-semibold text-brand-ink">Questions from parents</h2>
              <dl className="mt-4 space-y-5">
                {faqs.map((f) => (
                  <div key={f.q}>
                    <dt className="text-[16px] font-semibold text-brand-ink">{f.q}</dt>
                    <dd className="mt-1">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <ParentPacks />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const SAFETY_FAQ: Faq = {
  q: "Is it safe for my child?",
  a: "Yes. There are no accounts, chats, adverts aimed at children or links to strangers. Nothing your child types is sent anywhere: scores, streaks and stars are kept only in this browser.",
};
