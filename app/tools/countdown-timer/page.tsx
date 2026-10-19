import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CountdownTimerTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Event Countdown Timer (Free)",
  description: "Countdown to a launch, payment, or exam. Saved so you can check anytime.",
  alternates: { canonical: "/tools/countdown-timer" },
};

export default function Page() {
  return (
    <ToolPageShell title="Countdown Timer" subtitle="Set a date and watch the clock tick down.">
      <CountdownTimerTool />
    </ToolPageShell>
  );
}
