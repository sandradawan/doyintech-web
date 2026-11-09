import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { UrlEncoderTool } from "@/components/tools/SearchDemandTools";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder (Free)",
  description:
    "Encode or decode URL strings for query parameters and safe links. Paste your text and copy the result. A free online tool with no sign-up.",
  alternates: { canonical: "/tools/url-encoder" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="URL Encoder / Decoder"
      subtitle="Encode or decode URL components instantly."
    >
      <UrlEncoderTool />
    </ToolPageShell>
  );
}
