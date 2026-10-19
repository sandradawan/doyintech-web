import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { WhatsAppLinkGeneratorTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "WhatsApp Link Generator (Free)",
  description:
    "Create a wa.me WhatsApp click-to-chat link with an optional pre-filled message. Free online WhatsApp link generator.",
  alternates: { canonical: "/tools/whatsapp-link-generator" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="WhatsApp Link Generator"
      subtitle="Free wa.me link builder — phone + optional message."
    >
      <WhatsAppLinkGeneratorTool />
    </ToolPageShell>
  );
}
