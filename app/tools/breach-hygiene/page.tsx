import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { BreachHygieneTool } from "@/components/tools/SecurityExtraTools";

export const metadata: Metadata = {
  title: "What to Do After a Data Breach: Password Leak Guide",
  description: "What to do if your email or password may have been leaked: the steps to secure your accounts, in order, in plain language for non-technical people.",
  alternates: { canonical: "/tools/breach-hygiene" },
};

export default function Page() {
  return (
    <ToolPageShell title="Breach Hygiene Guide" subtitle="Clear steps when credentials may be compromised.">
      <BreachHygieneTool />
    </ToolPageShell>
  );
}
