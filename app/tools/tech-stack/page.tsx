import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { TechStackTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Tech Stack Advisor",
  description: "Get a recommended technology stack for your website, mobile app, or portal — Flutter, Laravel, Next.js, and more.",
  alternates: { canonical: "/tools/tech-stack" },
};

export default function Page() {
  return (
    <ToolPageShell title="Tech Stack Advisor" subtitle="Answer a few questions for a practical stack recommendation. Not a one-size-fits-all rule — a starting point for discussion.">
      <TechStackTool />
    </ToolPageShell>
  );
}
