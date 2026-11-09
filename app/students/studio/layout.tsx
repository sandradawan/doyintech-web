import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Student Research Studio: Project Outlines and Structure",
  "description": "Turn your topic into a clear outline and chapter structure you can build on. Made for final-year students in Nigeria starting a research project.",
  "alternates": {
    "canonical": "/students/studio"
  }
};

export default function StudentStudioLayout({ children }: { children: ReactNode }) {
  return children;
}
