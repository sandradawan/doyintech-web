import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { CountdownTimerTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Event Countdown Timer (Free)",
  description: "Count down to a launch, payment date or exam. Your countdown is saved on your device so you can check it again anytime. Free, with no sign-up.",
  alternates: { canonical: "/tools/countdown-timer" },
};

export default function Page() {
  return (
    <ToolPageShell title="Countdown Timer" subtitle="Set a date and watch the clock tick down.">
      <CountdownTimerTool />
    </ToolPageShell>
  );
}
