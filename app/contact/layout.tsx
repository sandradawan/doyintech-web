import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Contact DoyinTech",
  "description": "Talk to DoyinTech about a website, WhatsApp system or app. Reply within one business day — WhatsApp, email or book a call.",
  "alternates": {
    "canonical": "/contact"
  }
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
