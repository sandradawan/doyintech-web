import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import LeadForm from "@/components/ui/LeadForm";

const TITLE = "Sell Your Templates, Scripts and Code on DoyinTech";
const DESCRIPTION =
  "Developers and designers: apply to sell website templates, PHP and Laravel scripts, admin dashboards and UI kits on DoyinTech. We handle payments and delivery.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/sell" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/sell" },
};

const STEPS = [
  { t: "Apply", d: "Tell us what you build and send a link to your work." },
  { t: "We review", d: "We check that the code works, is your own and is documented." },
  { t: "We list it", d: "Your product gets a page, Paystack checkout and instant download." },
  { t: "You get paid", d: "You earn on every sale. We agree the commission with you before anything is listed." },
];

const WANTED = ["Website and landing page templates", "PHP and Laravel scripts", "Admin dashboards", "UI kits and components", "Business documents and spreadsheets", "Courses and ebooks for developers"];

export default function SellPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
          <p className="section-eyebrow">DoyinTech Developer Market</p>
          <h1 className="mt-3 max-w-3xl text-[36px] font-semibold leading-[1.08] tracking-tight text-brand-ink sm:text-[50px]">
            Sell your code to businesses and developers.
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-brand-muted">
            We are opening the DoyinTech store to a small group of developers and designers. You build, we handle checkout, delivery and
            customer questions.
          </p>

          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="apple-card p-5">
                <span className="text-[13px] font-semibold text-brand-link">Step {i + 1}</span>
                <p className="mt-1 text-[18px] font-semibold text-brand-ink">{s.t}</p>
                <p className="mt-2 text-[14px] leading-snug text-brand-muted">{s.d}</p>
              </li>
            ))}
          </ol>

          <section className="mt-14">
            <h2 className="text-[22px] font-semibold text-brand-ink">What we are looking for</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {WANTED.map((w) => (
                <li key={w} className="rounded-full border border-brand-ink/15 px-4 py-2 text-[14px] text-brand-ink">{w}</li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <h2 className="mb-5 text-[22px] font-semibold text-brand-ink">Apply to sell</h2>
            <LeadForm
              product="Developer Market seller"
              source="sell"
              type="waitlist"
              button="Send application"
              choice={{ label: "What do you want to sell?", options: WANTED }}
              messageLabel="Link to your work (GitHub, portfolio or demo)"
              messagePlaceholder="https://"
              done="Thanks. We review applications every week and will contact you on WhatsApp or email."
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
