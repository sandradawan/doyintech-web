import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { EmailSignatureTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Email Signature Generator: Free and Professional",
  description: "Create a clean, professional email signature for your business or freelance work. Add your name, role, phone and website, then copy it into your email.",
  alternates: { canonical: "/tools/email-signature" },
};

export default function Page() {
  return (
    <ToolPageShell title="Email Signature Generator" subtitle="Fill in your details and copy a simple text signature into your email client.">
      <EmailSignatureTool />
    </ToolPageShell>
  );
}
