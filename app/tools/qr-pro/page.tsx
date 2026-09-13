import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { QrProTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "QR Pro (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="QR Pro + Landing Brief" subtitle="Unlock branded QR brief export.">
      <QrProTool />
    </ToolPageShell>
  );
}
