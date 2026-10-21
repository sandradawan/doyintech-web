import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Research project support for students",
  "description": "Guidance, review and supervision support for final-year research projects. Clear stages, tracked online."
};

export default function StudentProjectsLayout({ children }: { children: ReactNode }) {
  return children;
}
