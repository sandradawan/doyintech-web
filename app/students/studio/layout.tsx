import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Student research studio — outlines & structure",
  "description": "Turn a topic into a clear outline and chapter structure you can build on.",
  "alternates": {
    "canonical": "/students/studio"
  }
};

export default function StudentStudioLayout({ children }: { children: ReactNode }) {
  return children;
}
