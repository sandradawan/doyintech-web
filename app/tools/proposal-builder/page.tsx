import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import ProposalBuilder from "@/components/tools/ProposalBuilder";

export const metadata: Metadata = {
  title: "Free Proposal & Quote Builder",
  description:
    "Create a professional project proposal with scope, timeline, investment, and deposit — print-ready PDF for clients.",
  alternates: { canonical: "/tools/proposal-builder" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Proposal Builder"
      subtitle="Turn a project brief into a clean client proposal. Print only the proposal sheet."
    >
      <ProposalBuilder />
    </ToolPageShell>
  );
}
