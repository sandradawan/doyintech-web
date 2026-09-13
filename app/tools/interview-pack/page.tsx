import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { InterviewPackTool } from "@/components/tools/PaidToolKit";

export const metadata: Metadata = { title: "Tech Interview Pack (Paid)" };

export default function Page() {
  return (
    <ToolPageShell title="Tech Interview Pack" subtitle="Pay to unlock full question bank.">
      <InterviewPackTool />
    </ToolPageShell>
  );
}
