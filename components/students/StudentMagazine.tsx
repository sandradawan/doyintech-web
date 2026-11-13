import Image from "next/image";
import Link from "next/link";
import { MAGAZINE_ISSUE, type StudentSpotlight } from "@/lib/students/spotlights";

/** The student e-magazine: a green page with the DoyinTech mark behind it, and a round portrait and school tag per student. */
export default function StudentMagazine({ students }: { students: StudentSpotlight[] }) {
  if (!students.length) return null;

  return (
    <section
      id="magazine"
      aria-labelledby="magazine-heading"
      className="theme-dark relative isolate mt-16 scroll-mt-24 overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c] px-5 py-10 sm:px-10 sm:py-14"
    >
      {/* The logo, large and faint, behind the page. */}
      <Image src="/logo.png" alt="" width={640} height={640} aria-hidden className="pointer-events-none absolute -right-24 -top-20 -z-10 h-[420px] w-[420px] select-none object-contain opacity-[0.07] sm:h-[560px] sm:w-[560px]" />
      <Image src="/logo.png" alt="" width={420} height={420} aria-hidden className="pointer-events-none absolute -bottom-24 -left-20 -z-10 h-[300px] w-[300px] select-none object-contain opacity-[0.05] sm:h-[380px] sm:w-[380px]" />

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-white/25 pb-5">
        <div>
          <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#ff8c14]">
            <span className="inline-block h-[2px] w-8 bg-[#ff8c14]" />
            E-magazine
          </p>
          <h2 id="magazine-heading" className="mt-2 font-serif text-[36px] font-bold leading-none tracking-tight text-white sm:text-[52px]">
            The DoyinTech <span className="text-[#ff8c14]">Student</span>
          </h2>
        </div>
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/75">
          <Image src="/logo.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          Issue {MAGAZINE_ISSUE.number} · {MAGAZINE_ISSUE.date}
        </p>
      </div>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-white/80">
        Students we have worked with on research projects, writing and software. Each one trusted us with their
        final-year work and recommended us to a friend.
      </p>

      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
        {students.map((s, i) => (
          <li key={s.id} className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="relative h-32 w-32 overflow-hidden rounded-full bg-[#1d1d1f] shadow-[0_0_0_4px_#0b0b0c,0_0_0_6px_#ff8c14,0_18px_30px_-12px_rgba(0,0,0,0.6)] sm:h-40 sm:w-40">
                <Image
                  src={s.photo}
                  alt={s.name ? `${s.name}${s.school ? `, ${s.school}` : ""}` : `A student DoyinTech worked with${s.school ? ` at ${s.school}` : ""}`}
                  fill
                  sizes="(max-width: 640px) 128px, 160px"
                  className="object-cover object-top"
                />
              </div>
              <span className="absolute -left-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white font-serif text-[13px] font-bold text-[#0b0b0c] shadow-md">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            {s.school && (
              <span className="relative z-10 -mt-3.5 max-w-full truncate rounded-full bg-[#ff8c14] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-black shadow-md">
                {s.school}
              </span>
            )}
            {s.name && <h3 className="mt-3 font-serif text-[19px] font-bold leading-tight text-white">{s.name}</h3>}
            {s.work && <p className={`${s.name ? "mt-1" : "mt-3"} max-w-[200px] text-[13px] leading-snug text-white/75`}>{s.work}</p>}
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/25 pt-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-serif text-[22px] font-bold text-white">Your project could be in the next issue.</p>
          <p className="mt-1 text-[14px] text-white/75">Start your research project with us and track every stage online.</p>
        </div>
        <Link href="/students/projects" className="inline-flex shrink-0 rounded-full bg-[#ff8c14] px-6 py-3 text-[14px] font-semibold text-black transition hover:brightness-110">
          Start a project →
        </Link>
      </div>
    </section>
  );
}
