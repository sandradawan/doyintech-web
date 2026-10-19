import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiProductCopyTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI Product Copy Studio (Paid)",
  description: "Landing, ads, and WhatsApp product copy with AI.",
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
