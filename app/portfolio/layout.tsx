import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Portfolio — Websites & apps we've shipped",
  "description": "Live websites, booking systems and apps DoyinTech has built for real businesses, with links you can click through.",
  "alternates": {
    "canonical": "/portfolio"
  }
};

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return children;
}
