import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { RentReceiptTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/rent-receipt" }, description: "Create a professional rent receipt and export it as a PDF for your tenant, with amount, period and property address. One-time unlock, no subscription.", title: "Rent Receipt (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Rent / Fee Receipt" subtitle="Pay to export landlord receipt PDF.">
      <RentReceiptTool />
    </ToolPageShell>
  );
}
