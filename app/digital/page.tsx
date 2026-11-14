import type { Metadata } from "next";
import DivisionHub from "@/components/sections/DivisionHub";
import { getDivision } from "@/lib/divisions";

const TITLE = "Business Templates, Ebooks and Developer Code to Download";
const DESCRIPTION =
  "Buy business templates, ebooks, Next.js templates and UI components from DoyinTech. Pay with Paystack and download straight away, or learn to code with DoyinTech Academy.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/digital" },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: "/digital" },
};

export default function DigitalPage() {
  return <DivisionHub division={getDivision("digital")} />;
}
