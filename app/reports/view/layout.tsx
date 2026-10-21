import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Your report",
  "robots": {
    "index": false,
    "follow": false
  }
};

export default function ReportViewLayout({ children }: { children: ReactNode }) {
  return children;
}
