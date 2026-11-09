import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { BusinessNameGeneratorTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Business Name Generator (Free)",
  description: "Generate brandable business name ideas from a keyword, free. Get a shortlist, then check the name is available before you register it with CAC.",
  alternates: { canonical: "/tools/business-name-generator" },
};

export default function Page() {
  return (
    <ToolPageShell title="Business Name Generator" subtitle="Keyword → brandable name ideas in seconds.">
      <BusinessNameGeneratorTool />
    </ToolPageShell>
  );
}
