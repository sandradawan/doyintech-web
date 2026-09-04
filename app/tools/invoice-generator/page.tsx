import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import InvoiceGenerator from "@/components/tools/InvoiceGenerator";

export const metadata: Metadata = {
  title: "Free Professional Invoice & Quote Generator",
  description:
    "Create a professional invoice or quote with business address, line items, tax, bank details, and print-ready PDF — free for Nigerian freelancers and SMEs.",
  alternates: { canonical: "/tools/invoice-generator" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Invoice & Quote Generator"
      subtitle="Build a professional invoice with your business address, client details, line items, tax, and payment method. Print only the invoice — not the website."
    >
      <InvoiceGenerator />
    </ToolPageShell>
  );
}
