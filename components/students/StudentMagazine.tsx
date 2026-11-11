import Image from "next/image";
import Link from "next/link";
import { MAGAZINE_ISSUE, type StudentSpotlight } from "@/lib/students/spotlights";

/** The student e-magazine: a masthead, then one page per student with photo, name and school. */
export default function StudentMagazine({ students }: { students: StudentSpotlight[] }) {
  if (!students.length) return null;

  return (
    <section id="magazine" aria-labelledby="magazine-heading" className="mt-16 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-brand-ink pb-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-link">E-magazine</p>
          <h2 id="magazine-heading" className="mt-1 font-serif text-[34px] font-bold leading-none tracking-tight text-brand-ink sm:text-[46px]">
            The DoyinTech Student
          </h2>
        </div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
          Issue {MAGAZINE_ISSUE.number} · {MAGAZINE_ISSUE.date}
        </p>
      </div>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-brand-muted">
        Students we have worked with on research projects, writing and software. Each one trusted us with their
        final-year work and recommended us to a friend.
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {students.map((s, i) => (
          <li key={s.id}>
            <article className="group h-full overflow-hidden rounded-[20px] border border-brand-ink/10 bg-brand-surface shadow-[0_16px_36px_-24px_rgba(11,42,28,0.35)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#0a3d1f]">
                <Image
                  src={s.photo}
                  alt={s.name ? `${s.name}${s.school ? `, ${s.school}` : ""}` : `A student DoyinTech worked with${s.school ? ` at ${s.school}` : ""}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 font-serif text-[13px] font-bold text-[#0b2a1c]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-5">
                {s.name && <h3 className="font-serif text-[22px] font-bold leading-tight text-brand-ink">{s.name}</h3>}
                {s.school && (
                  <p className={`${s.name ? "mt-1 text-[14px] font-medium" : "font-serif text-[22px] font-bold leading-tight"} text-brand-ink`}>
                    {s.school}
                  </p>
                )}
                <p className="mt-3 border-t border-brand-ink/10 pt-3 text-[13px] leading-snug text-brand-muted">
                  <span className="font-semibold uppercase tracking-[0.1em] text-brand-link">Worked on</span>
                  <br />
                  {s.work}
                </p>
              </div>
            </article>
          </li>
        ))}
        <li>
          <Link
            href="/students/projects"
            className="theme-dark panel-glow flex h-full min-h-[280px] flex-col justify-end rounded-[20px] p-6 transition hover:brightness-110"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-link">Next issue</p>
            <p className="mt-2 font-serif text-[26px] font-bold leading-tight text-brand-ink">Your project could be here.</p>
            <p className="mt-2 text-[14px] leading-relaxed text-brand-muted">
              Start your research project with us and track every stage online.
            </p>
            <span className="mt-5 inline-flex w-fit rounded-full bg-brand-accent px-5 py-2.5 text-[13px] font-semibold text-black">
              Start a project →
            </span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
