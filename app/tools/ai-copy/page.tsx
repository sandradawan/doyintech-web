import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiCopyTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "AI Business Copy Suite (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="AI Business Copy Suite" subtitle="Unlock full ads, WhatsApp, and email packs.">
      <AiCopyTool />
    </ToolPageShell>
  );
}
