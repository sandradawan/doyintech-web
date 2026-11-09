import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PasswordTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Strong Password Generator",
  description: "Generate strong random passwords in your browser. Choose the length and characters you want. Nothing is sent to or stored on our servers. Free.",
  alternates: { canonical: "/tools/password-generator" },
};

export default function Page() {
  return (
    <ToolPageShell title="Password Generator" subtitle="Create strong passwords locally in your browser.">
      <PasswordTool />
    </ToolPageShell>
  );
}
