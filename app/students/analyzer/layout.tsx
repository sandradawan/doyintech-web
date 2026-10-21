import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Research data analyzer for students",
  "description": "Summarise survey data and get plain-English findings for Chapter 4 of your project.",
  "alternates": {
    "canonical": "/students/analyzer"
  }
};

export default function StudentAnalyzerLayout({ children }: { children: ReactNode }) {
  return children;
}
