import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "DoyinStore sign in",
  "robots": {
    "index": false,
    "follow": false
  }
};

export default function StoreAuthLayout({ children }: { children: ReactNode }) {
  return children;
}
