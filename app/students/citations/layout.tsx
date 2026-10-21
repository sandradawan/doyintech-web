import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Citation generator — APA, MLA, Harvard",
  "description": "Format references correctly for your project or assignment in seconds.",
  "alternates": {
    "canonical": "/students/citations"
  }
};

export default function StudentCitationsLayout({ children }: { children: ReactNode }) {
  return children;
}
