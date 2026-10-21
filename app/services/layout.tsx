import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Services — Websites, backend, mobile & AI automation",
  "description": "Fixed-price websites, backend and API engineering, Flutter mobile apps and AI automation for growing businesses."
};

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
