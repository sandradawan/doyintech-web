import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Report Studio — Social & brand presence reports",
  "description": "Professional reports on your Instagram, TikTok, Facebook, website and Google presence, with clear fixes. Pay online, delivered by email."
};

export default function ReportsLayout({ children }: { children: ReactNode }) {
  return children;
}
