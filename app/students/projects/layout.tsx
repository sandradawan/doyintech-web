import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = { alternates: { canonical: "/students/projects" },
  "title": "Final Year Research Project Support for Students",
  "description": "Guidance, review and supervision support for final-year research projects. Get help with your topic, chapters and data while keeping the work your own."
};

export default function StudentProjectsLayout({ children }: { children: ReactNode }) {
  return children;
}
