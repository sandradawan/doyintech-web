import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { BrandedInvoiceTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Branded Invoice PDF (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Branded Invoice PDF" subtitle="Payment required before PDF export.">
      <BrandedInvoiceTool />
    </ToolPageShell>
  );
}
