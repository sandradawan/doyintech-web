import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Research Data Analyzer for Students",
  "description": "Summarise your survey data and get plain-English findings for Chapter 4 of your project. Built for Nigerian students working on research.",
  "alternates": {
    "canonical": "/students/analyzer"
  }
};

export default function StudentAnalyzerLayout({ children }: { children: ReactNode }) {
  return children;
}
