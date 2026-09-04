import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { WhatsAppChecklistTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "WhatsApp Business Setup Checklist",
  description: "Practical checklist to set up WhatsApp Business for Nigerian SMEs — profile, replies, labels, and safety.",
  alternates: { canonical: "/tools/whatsapp-checklist" },
};

export default function Page() {
  return (
    <ToolPageShell title="WhatsApp Business Checklist" subtitle="Tick off the essentials so customers get a professional experience.">
      <WhatsAppChecklistTool />
    </ToolPageShell>
  );
}
