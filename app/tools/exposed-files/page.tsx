import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ExposedFilesTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Exposed Files Checker",
  description: "Probe .env, .git, backups, phpinfo and admin paths with evidence-based flags.",
  alternates: { canonical: "/tools/exposed-files" },
};

export default function Page() {
  return (
    <ToolPageShell title="Exposed Files Checker" subtitle="Sensitive path probes — risk only when the response body supports it.">
      <ExposedFilesTool />
    </ToolPageShell>
  );
}
