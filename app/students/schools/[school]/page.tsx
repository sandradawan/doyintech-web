import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/ui/Footer";
import { schoolSlug } from "@/lib/students/spotlights";
import { getStudentSpotlights } from "@/lib/students/spotlights-server";

// New students show up on their school's page without a redeploy.
export const revalidate = 300;

type Params = { params: Promise<{ school: string }> };

async function findSchool(slug: string) {
  const all = await getStudentSpotlights();
  const students = all.filter((s) => s.school && schoolSlug(s.school) === slug);
  return students.length ? { name: students[0].school, students } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { school } = await params;
  const found = await findSchool(school);
  if (!found) return {};
  const title = `${found.name} Students We Have Worked With`;
  const description = `Students from ${found.name} who worked with DoyinTech on project research, writing and software. See who we have helped and start your own project.`;
  const url = `/students/schools/${school}`;
  return { title, description, alternates: { canonical: url }, openGraph: { images: ["/opengraph-image"], title, description, url } };
}

export default async function SchoolPage({ params }: Params) {
  const { school } = await params;
  const found = await findSchool(school);
  if (!found) notFound();
  const works = [...new Set(found.students.map((s) => s.work).filter(Boolean))];

  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[980px] px-5 sm:px-6">
          <p className="text-[13px] text-brand-muted">
            <Link href="/students" className="text-brand-link hover:underline">Students</Link> / {found.name}
          </p>
          <p className="section-eyebrow mt-4">Schools we work with</p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-brand-ink sm:text-[46px]">{found.name}</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-brand-muted">
            {found.students.length === 1 ? "One student" : `${found.students.length} students`} from {found.name} in our student magazine so far.
            {works.length > 0 && ` We have worked with them on ${works.map((w) => w.toLowerCase()).join(" and ")}.`}
          </p>

          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {found.students.map((s) => (
              <li key={s.id} className="flex flex-col items-center text-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full bg-brand-surface shadow-[0_0_0_4px_#000,0_0_0_6px_#ff8c14] sm:h-40 sm:w-40">
                  <Image src={s.photo} alt={s.name ? `${s.name}, ${found.name}` : `A ${found.name} student DoyinTech worked with`} fill sizes="160px" className="object-cover object-top" />
                </div>
                {s.name && <h2 className="mt-4 text-[17px] font-semibold text-brand-ink">{s.name}</h2>}
                {s.work && <p className={`${s.name ? "mt-1" : "mt-4"} max-w-[200px] text-[13px] leading-snug text-brand-muted`}>{s.work}</p>}
              </li>
            ))}
          </ul>

          <section className="theme-dark panel-glow mt-14 rounded-[28px] p-8 sm:p-10">
            <h2 className="text-[26px] font-semibold tracking-tight text-brand-ink">Studying at {found.name}?</h2>
            <p className="mt-2 max-w-xl text-[16px] text-brand-muted">
              Start your research project with us, pay a deposit and track every stage online. Free tools for outlines, citations and data analysis are open to everyone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/students/projects" className="inline-flex min-h-11 items-center rounded-full bg-brand-accent px-6 text-[15px] font-semibold text-black">Start a project</Link>
              <Link href="/students" className="inline-flex min-h-11 items-center rounded-full border border-brand-ink/25 px-6 text-[15px] font-semibold text-brand-ink">Free student tools</Link>
              <Link href="/students/get-featured" className="inline-flex min-h-11 items-center rounded-full border border-brand-ink/25 px-6 text-[15px] font-semibold text-brand-ink">Get featured</Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
