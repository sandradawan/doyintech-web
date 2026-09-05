import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { BreachHygieneTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "Breach Hygiene Guide",
  description: "What to do if an email or password may have been leaked.",
  alternates: { canonical: "/tools/breach-hygiene" },
};

export default function Page() {
  return (
    <ToolPageShell title="Breach Hygiene Guide" subtitle="Clear steps when credentials may be compromised.">
      <BreachHygieneTool />
    </ToolPageShell>
  );
}
