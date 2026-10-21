import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Deposit received",
  "robots": {
    "index": false,
    "follow": false
  }
};

export default function HireSuccessLayout({ children }: { children: ReactNode }) {
  return children;
}
