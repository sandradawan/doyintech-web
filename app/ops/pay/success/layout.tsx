import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Invoice paid",
  "robots": {
    "index": false,
    "follow": false
  }
};

export default function OpsPaySuccessLayout({ children }: { children: ReactNode }) {
  return children;
}
