import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { QrTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Free QR Code Generator",
  description: "Generate QR codes for website links, WhatsApp, and menus.",
  alternates: { canonical: "/tools/qr-generator" },
};

export default function Page() {
  return (
    <ToolPageShell title="QR Code Generator" subtitle="Enter a URL or text to generate a QR code. Great for menus, Wi-Fi, and WhatsApp.">
      <QrTool />
    </ToolPageShell>
  );
}
