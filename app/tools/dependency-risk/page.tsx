import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { DependencyRiskTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Dependency Risk Explainer",
  description: "Why keeping WordPress, npm, and frameworks updated is a security control.",
  alternates: { canonical: "/tools/dependency-risk" },
};

export default function Page() {
  return (
    <ToolPageShell title="Dependency Risk Explainer" subtitle="Understand why updates prevent most small-site breaches.">
      <DependencyRiskTool />
    </ToolPageShell>
  );
}
