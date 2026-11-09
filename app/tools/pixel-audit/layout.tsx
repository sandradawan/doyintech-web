import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Free Meta Pixel audit",
  "description": "Check whether your website's Meta (Facebook) Pixel is installed and firing correctly, so you don't waste ad money on campaigns you can't measure.",
  "alternates": {
    "canonical": "/tools/pixel-audit"
  }
};

export default function PixelAuditLayout({ children }: { children: ReactNode }) {
  return children;
}
