import type { Metadata } from "next";
import ToolPageShell from "@/components/tools/ToolPageShell";
import { PomodoroTimerTool } from "@/components/tools/RetentionTools";

export const metadata: Metadata = {
  title: "Pomodoro Focus Timer (Free)",
  description: "A free Pomodoro focus timer with a daily streak saved in your browser. Work in short focused blocks, take your break and see your progress build.",
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
