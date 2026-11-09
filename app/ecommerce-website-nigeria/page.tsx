import type { Metadata } from "next";
import SolutionLanding from "@/components/services/SolutionLanding";
import { ECOMMERCE } from "@/lib/solutions";

const TITLE = "Ecommerce Website Design in Nigeria: Your Own Online Store";
const DESCRIPTION = "Online stores with Paystack checkout, delivery fees by area, stock and order dashboard, on your own domain. Fixed-price quote after a free scoping call.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: ECOMMERCE.path },
  openGraph: { images: ["/opengraph-image"], title: TITLE, description: DESCRIPTION, url: ECOMMERCE.path },
};

export default function Page() {
  return <SolutionLanding page={ECOMMERCE} />;
}
