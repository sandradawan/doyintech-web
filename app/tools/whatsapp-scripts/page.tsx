import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import WhatsAppScriptsGenerator from "@/components/tools/WhatsAppScriptsGenerator";

export const metadata: Metadata = {
  title: "Free WhatsApp Reply Scripts Generator | DoyinTech",
  description:
    "Generate 5 ready WhatsApp Business reply scripts for Nigerian SMEs — price enquiry, after-hours, booking, soft close, review request. Free.",
  alternates: { canonical: "/tools/whatsapp-scripts" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="WhatsApp reply scripts"
      subtitle="Pick your business type. Get 5 copy-paste scripts for price questions, after-hours, booking, closing, and reviews."
    >
      <WhatsAppScriptsGenerator />
    </ToolPageShell>
  );
}
