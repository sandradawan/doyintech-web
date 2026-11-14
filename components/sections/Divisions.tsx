import Link from "next/link";
import { DIVISIONS } from "@/lib/divisions";

/** Homepage: the three things DoyinTech sells, so every visitor finds their door in one glance. */
export default function Divisions() {
  return (
    <section aria-labelledby="divisions-heading" className="apple-section">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.06em] text-brand-link">What we do</p>
        <h2 id="divisions-heading" className="apple-headline mt-2 text-center">Build it, run it, or buy it ready-made.</h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {DIVISIONS.map((d) => (
            <article key={d.id} className="apple-card flex flex-col p-7">
              <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-brand-link">{d.name}</p>
              <h3 className="mt-2 text-[22px] font-semibold leading-tight tracking-tight text-brand-ink">{d.promise}</h3>
              <ul className="mt-5 flex-1 space-y-2.5">
                {d.offers.slice(0, 4).map((o) => (
                  <li key={o.name} className="flex items-baseline justify-between gap-3 text-[15px]">
                    <Link href={o.href} className="text-brand-ink/90 hover:text-brand-link hover:underline">{o.name}</Link>
                    <span className="shrink-0 text-[13px] text-brand-subtle">{o.price}</span>
                  </li>
                ))}
              </ul>
              <Link href={d.href} className="apple-link mt-6 text-[16px]">
                Explore {d.short} ›
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
