import type { Metadata } from "next";
import SupportPageClient from "@/components/support/SupportPageClient";

export const metadata: Metadata = {
  title: "Customer Support",
  description:
    "Get help with DoyinTech products, websites, Report Studio, payments, and delivery. WhatsApp, email, or submit a support request.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return <SupportPageClient />;
}
