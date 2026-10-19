import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { MetaTagGeneratorTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "SEO Meta Tag Generator (Free)",
  description:
    "Generate SEO title tags and meta descriptions with a Google-style preview and length checks.",
  alternates: { canonical: "/tools/meta-tag-generator" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="SEO Meta Tag Generator"
      subtitle="Title, description, and canonical with live SERP preview."
    >
      <MetaTagGeneratorTool />
    </ToolPageShell>
  );
}
