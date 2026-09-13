import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RentReceiptTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Rent Receipt (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Rent / Fee Receipt" subtitle="Pay to export landlord receipt PDF.">
      <RentReceiptTool />
    </ToolPageShell>
  );
}
