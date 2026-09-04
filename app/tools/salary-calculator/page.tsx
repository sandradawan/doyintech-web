import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { SalaryTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Nigeria Tech Salary & Freelance Rate Calculator",
  description: "Indicative monthly salary and day-rate ranges for frontend, backend, mobile, and fullstack roles in Nigeria.",
  alternates: { canonical: "/tools/salary-calculator" },
};

export default function Page() {
  return (
    <ToolPageShell title="Tech Salary & Rate Calculator" subtitle="Planning ranges only — real offers vary by city, company, and skills.">
      <SalaryTool />
    </ToolPageShell>
  );
}
