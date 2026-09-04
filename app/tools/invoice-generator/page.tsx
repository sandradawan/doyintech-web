import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { InvoiceTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Free Invoice & Quote Generator",
  description: "Create a simple printable invoice or quote for freelancers and small businesses in Nigeria.",
  alternates: { canonical: "/tools/invoice-generator" },
};

export default function Page() {
  return (
    <ToolPageShell title="Invoice & Quote Generator" subtitle="Fill in the details, then print or save as PDF from your browser.">
      <InvoiceTool />
    </ToolPageShell>
  );
}
