import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import PdfStudio from "@/components/tools/PdfStudio";

export const metadata: Metadata = {
  title: "PDF Studio (Paid)",
  description:
    "Create professional letters, quotes, and reports as PDF. Preview free — full export is a paid one-time unlock.",
};

export default function PdfStudioPage() {
  return (
    <ToolPageShell
      title="PDF Studio"
      description="Build letters, quotes, and reports in the browser. Preview is free; PDF export requires a one-time ₦5,000 unlock."
    >
      <PdfStudio />
    </ToolPageShell>
  );
}
