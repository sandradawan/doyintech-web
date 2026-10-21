import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Track your project",
  "robots": {
    "index": false,
    "follow": false
  }
};

export default function StudentTrackLayout({ children }: { children: ReactNode }) {
  return children;
}
