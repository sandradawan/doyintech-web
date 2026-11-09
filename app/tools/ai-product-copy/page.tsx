import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiProductCopyTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Product Copy Studio (Paid)",
  description: "Generate landing page, ad and WhatsApp copy for your product with AI, from a few details about what you sell. One-time unlock, no subscription.",
  alternates: { canonical: "/tools/ai-product-copy" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="AI Product Copy Studio"
      subtitle="Landing, ads, and WhatsApp copy with AI."
    >
      <AiProductCopyTool />
    </ToolPageShell>
  );
}
