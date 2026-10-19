import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { AiFaqPackTool } from "@/components/tools/AiStudioSuite";

export const metadata: Metadata = {
  title: "AI FAQ & Objection Pack (Paid)",
  description: "Sales FAQs and objection handlers generated with AI.",
  alternates: { canonical: "/tools/ai-faq-pack" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="AI FAQ & Objection Pack"
      subtitle="Sales FAQs and objection handlers with AI."
    >
      <AiFaqPackTool />
    </ToolPageShell>
  );
}
