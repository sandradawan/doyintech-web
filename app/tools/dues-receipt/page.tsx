import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { DuesReceiptTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Dues Receipt (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="School / Church Dues Receipt" subtitle="Pay to export institution receipt.">
      <DuesReceiptTool />
    </ToolPageShell>
  );
}
