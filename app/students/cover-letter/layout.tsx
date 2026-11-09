import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Cover Letter Builder for Students and Graduates",
  "description": "Write a clear, tailored cover letter for internships, NYSC placements and first jobs. Built for students and fresh graduates in Nigeria.",
  "alternates": {
    "canonical": "/students/cover-letter"
  }
};

export default function StudentCoverLetterLayout({ children }: { children: ReactNode }) {
  return children;
}
