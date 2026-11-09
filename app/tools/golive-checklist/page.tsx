import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { GoLiveChecklistTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Website Go-Live Security Checklist",
  description: "A pre-launch security checklist to go through before you put a website live: HTTPS, passwords, backups, admin access and more. Free, with no sign-up.",
  alternates: { canonical: "/tools/golive-checklist" },
};

export default function Page() {
  return (
    <ToolPageShell title="Go-Live Security Checklist" subtitle="Ship safer — tick every box before launch day.">
      <GoLiveChecklistTool />
    </ToolPageShell>
  );
}
