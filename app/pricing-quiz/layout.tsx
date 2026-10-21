import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Website pricing quiz — find your package in 60 seconds",
  "description": "Answer five quick questions and get the DoyinTech package and fixed price that fits your business.",
  "alternates": {
    "canonical": "/pricing-quiz"
  }
};

export default function PricingQuizLayout({ children }: { children: ReactNode }) {
  return children;
}
