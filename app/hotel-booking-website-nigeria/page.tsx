import type { Metadata } from "next";
import SolutionLanding from "@/components/services/SolutionLanding";
import { HOTEL } from "@/lib/solutions";

const TITLE = "Hotel booking website in Nigeria — direct bookings with Paystack";
const DESCRIPTION = "Hotel and short-let websites with room availability, Paystack deposits and a front-desk dashboard. Take direct bookings without agent commission. Fixed-price quote.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: HOTEL.path },
  openGraph: { title: TITLE, description: DESCRIPTION, url: HOTEL.path },
};

export default function Page() {
  return <SolutionLanding page={HOTEL} />;
}
