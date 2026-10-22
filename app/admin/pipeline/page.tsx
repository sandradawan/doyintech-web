import type { Metadata } from "next";
import PipelineBoard from "@/components/admin/crm/PipelineBoard";

export const metadata: Metadata = { title: "Pipeline" };

export default function PipelinePage() {
  return <PipelineBoard />;
}
