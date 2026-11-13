import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import StudentSubmitForm from "@/components/students/StudentSubmitForm";

const TITLE = "Get Featured in the DoyinTech Student Magazine";
const DESCRIPTION = "Worked with DoyinTech on your project? Send your photo, name and school to appear in our student magazine and slideshow.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/students/get-featured" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/students/get-featured" },
};

export default function GetFeaturedPage() {
  return (
    <>
      <main className="pb-24 pt-28">
        <div className="mx-auto max-w-[860px] px-5 sm:px-6">
          <p className="text-[13px] text-brand-muted">
            <Link href="/students" className="text-brand-link hover:underline">Students</Link> / Get featured
          </p>
          <p className="section-eyebrow mt-4">Student magazine</p>
          <h1 className="mt-3 text-[34px] font-semibold tracking-tight text-brand-ink sm:text-[44px]">Get featured in our student magazine</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-brand-muted">
            If we worked with you on your project, send your photo, name and school. We check each request, then add you to the
            magazine and the slideshow on the Students page.
          </p>
          <div className="mt-8">
            <StudentSubmitForm />
          </div>
          <p className="mt-6 text-[13px] text-brand-subtle">
            Want to be removed later? Message us on WhatsApp and we will take your photo down.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
