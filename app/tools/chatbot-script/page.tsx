import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { ChatbotScriptTool } from "@/components/tools/ExtendedTools";

export const metadata: Metadata = {
  title: "Chatbot & WhatsApp Script Generator",
  description: "Generate starter FAQ scripts for website chatbots and WhatsApp Business auto-replies.",
  alternates: { canonical: "/tools/chatbot-script" },
};

export default function Page() {
  return (
    <ToolPageShell title="Chatbot Script Generator" subtitle="Create a simple welcome, hours, prices, and handoff script you can adapt.">
      <ChatbotScriptTool />
    </ToolPageShell>
  );
}
