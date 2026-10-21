import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  "title": "Sell on DoyinStore — Developer sign-up",
  "description": "Publish your apps and digital products on DoyinStore and get paid through Paystack.",
  "alternates": {
    "canonical": "/store/join"
  }
};

export default function StoreJoinLayout({ children }: { children: ReactNode }) {
  return children;
}
