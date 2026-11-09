import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { QrProTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/qr-pro" }, description: "Create branded QR codes for your business with your own colours, ready to print on flyers, packaging and shop signs. One-time unlock, no subscription.", title: "QR Pro (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="QR Pro + Landing Brief" subtitle="Unlock branded QR brief export.">
      <QrProTool />
    </ToolPageShell>
  );
}
