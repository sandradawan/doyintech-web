import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { WhatsAppBuilderTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "WhatsApp Auto-Reply Builder (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="WhatsApp Auto-Reply Builder" subtitle="Pay once to unlock full scripts and export.">
      <WhatsAppBuilderTool />
    </ToolPageShell>
  );
}
