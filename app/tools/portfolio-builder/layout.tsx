import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Free portfolio builder",
  "description": "Build a clean one-page portfolio to share with clients and employers.",
  "alternates": {
    "canonical": "/tools/portfolio-builder"
  }
};

export default function PortfolioBuilderLayout({ children }: { children: ReactNode }) {
  return children;
}
