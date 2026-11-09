import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Citation Generator: APA, MLA and Harvard",
  "description": "Format your references correctly for your project or assignment in seconds. A free citation generator for APA, MLA and Harvard styles.",
  "alternates": {
    "canonical": "/students/citations"
  }
};

export default function StudentCitationsLayout({ children }: { children: ReactNode }) {
  return children;
}
