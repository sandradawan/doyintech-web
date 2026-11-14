import Link from "next/link";
import type { ReactNode } from "react";
import Footer from "@/components/ui/Footer";
import { DIVISIONS, type Division } from "@/lib/divisions";

/** The page for one division: its promise, everything it sells with a starting price, and links to the other two. */
export default function DivisionHub({ division, children }: { division: Division; children?: ReactNode }) {
  const others = DIVISIONS.filter((d) => d.id !== division.id);
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6">
          <p className="section-eyebrow">{division.name}</p>
          <h1 className="mt-3 max-w-3xl text-[36px] font-semibold leading-[1.08] tracking-tight text-brand-ink sm:text-[52px]">{division.promise}</h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-brand-muted">{division.intro}</p>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {division.offers.map((o) => {
              const external = o.href.startsWith("http");
              return (
                <li key={o.name}>
                  <Link
                    href={o.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="apple-card flex h-full flex-col p-6 transition hover:-translate-y-0.5"
                  >
                    <span className="text-[19px] font-semibold tracking-tight text-brand-ink">{o.name}</span>
                    <span className="mt-1 text-[14px] font-semibold text-brand-link">{o.price}</span>
                    <span className="mt-3 flex-1 text-[15px] leading-snug text-brand-muted">{o.desc}</span>
                    <span className="mt-4 text-[14px] font-medium text-brand-link">{external ? "Visit ↗" : "See details ›"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {children}

          <section className="mt-20 border-t border-brand-ink/10 pt-10" aria-label="Other DoyinTech divisions">
            <h2 className="text-[22px] font-semibold text-brand-ink">Also from DoyinTech</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {others.map((d) => (
                <Link key={d.id} href={d.href} className="apple-card block p-6 transition hover:-translate-y-0.5">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.06em] text-brand-link">{d.name}</span>
                  <span className="mt-2 block text-[18px] font-semibold text-brand-ink">{d.promise}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
