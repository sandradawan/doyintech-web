import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Cover letter builder for students & graduates",
  "description": "Write a clear, tailored cover letter for internships, NYSC placements and first jobs.",
  "alternates": {
    "canonical": "/students/cover-letter"
  }
};

export default function StudentCoverLetterLayout({ children }: { children: ReactNode }) {
  return children;
}
