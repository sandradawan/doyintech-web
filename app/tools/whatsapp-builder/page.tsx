import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { WhatsAppBuilderTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { alternates: { canonical: "/tools/whatsapp-builder" }, description: "Build WhatsApp Business auto-replies and away messages for your business, ready to paste in, so no customer goes unanswered. One-time unlock.", title: "WhatsApp Auto-Reply Builder (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="WhatsApp Auto-Reply Builder" subtitle="Pay once to unlock full scripts and export.">
      <WhatsAppBuilderTool />
    </ToolPageShell>
  );
}
