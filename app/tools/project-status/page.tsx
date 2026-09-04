import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import ProjectStatus from "@/components/tools/ProjectStatus";

export const metadata: Metadata = {
  title: "Client Project Status Page",
  description:
    "Share a live project status with clients: Discovery, In progress, Review, Done — plus progress and next steps.",
  alternates: { canonical: "/tools/project-status" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Client Project Status"
      subtitle="Update progress and share a link so clients know where the project stands."
    >
      <ProjectStatus />
    </ToolPageShell>
  );
}
