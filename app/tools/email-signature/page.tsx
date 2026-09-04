import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { EmailSignatureTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Email Signature Generator",
  description: "Create a clean professional email signature for business and freelancing.",
  alternates: { canonical: "/tools/email-signature" },
};

export default function Page() {
  return (
    <ToolPageShell title="Email Signature Generator" subtitle="Fill in your details and copy a simple text signature into your email client.">
      <EmailSignatureTool />
    </ToolPageShell>
  );
}
