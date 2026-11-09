import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiCopyStudioTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Business Copy Suite (Paid)",
  description: "Generate ads, WhatsApp messages and email copy for your business with AI, so you always have something to send. One-time unlock, no subscription.",
  alternates: { canonical: "/tools/ai-copy" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="AI Business Copy Suite"
      subtitle="Unlock full AI-generated ads, WhatsApp, and email packs."
    >
      <AiCopyStudioTool />
    </ToolPageShell>
  );
}
