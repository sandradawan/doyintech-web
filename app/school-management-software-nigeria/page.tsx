import type { Metadata } from "next";
import SolutionLanding from "@/components/services/SolutionLanding";
import { SCHOOL } from "@/lib/solutions";

const TITLE = "School Management Software in Nigeria: Fees and Results";
const DESCRIPTION = "Online school fees, report cards, result checker, admissions and CBT for Nigerian nursery, primary and secondary schools. Paystack payments. Fixed-price quote.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SCHOOL.path },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: SCHOOL.path },
};

export default function Page() {
  return <SolutionLanding page={SCHOOL} />;
}
