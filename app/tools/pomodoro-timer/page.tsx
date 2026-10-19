import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PomodoroTimerTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Pomodoro Focus Timer (Free)",
  description: "Focus timer with daily streak saved in your browser. Free Pomodoro online.",
  alternates: { canonical: "/tools/pomodoro-timer" },
};

export default function Page() {
  return (
    <ToolPageShell
      title="Pomodoro Focus Timer"
      subtitle="25-minute focus sessions with a streak that brings you back."
    >
      <PomodoroTimerTool />
    </ToolPageShell>
  );
}
