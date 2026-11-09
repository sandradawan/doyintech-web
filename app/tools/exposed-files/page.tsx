import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ExposedFilesTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Exposed Files Checker",
  description: "Check your website for exposed .env files, .git folders, backups, phpinfo and admin paths, with evidence for each finding. Only scan sites you own.",
  alternates: { canonical: "/tools/exposed-files" },
};

export default function Page() {
  return (
    <ToolPageShell title="Exposed Files Checker" subtitle="Sensitive path probes — risk only when the response body supports it.">
      <ExposedFilesTool />
    </ToolPageShell>
  );
}
