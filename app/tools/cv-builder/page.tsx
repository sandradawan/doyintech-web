import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import CvBuilder from "@/components/tools/CvBuilder";
import { TOOLS_CONFIG } from "@/lib/tools/config";

export const metadata: Metadata = {
  title: "Free CV & Portfolio Builder Nigeria",
  description:
    "Free professional CV builder for students, developers, and job seekers. Live preview, templates, and print-ready download.",
  alternates: { canonical: "/tools/cv-builder" },
  openGraph: {
    title: "CV & Portfolio Builder | DoyinTech",
    description: "Create a clean professional CV with live preview. Free to use.",
    url: `${TOOLS_CONFIG.siteUrl}/tools/cv-builder`,
  },
};

export default function CvBuilderPage() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <Link href="/tools" className="text-sm text-primary hover:underline">
            ← All tools
          </Link>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
            CV & Portfolio Builder
          </h1>
          <p className="mt-3 max-w-2xl text-gray-400">
            Build a professional CV with live preview. Drafts save in your browser.
            Print or save as PDF from your browser print dialog. Only enter real
            experience — never invent qualifications.
          </p>
          <div className="mt-8">
            <CvBuilder />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
