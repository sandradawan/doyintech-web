"use client";

import AcademyCta from "./AcademyCta";
import { SkillGapTool, InterviewTool } from "./ExtendedTools";

/** Skill gap tool with Academy upsell */
export function SkillGapWithAcademy() {
  return (
    <div className="space-y-5">
      <SkillGapTool />
      {/* Academy CTA also injected inside results when gaps shown — page-level fallback */}
      <AcademyCta track="backend" />
    </div>
  );
}

export function InterviewWithAcademy() {
  return (
    <div className="space-y-5">
      <InterviewTool />
      <AcademyCta track="general" />
    </div>
  );
}
