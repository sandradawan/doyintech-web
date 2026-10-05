/** Student research project packages (NGN). */

export type StudentPackage = {
  id: string;
  name: string;
  priceNgn: number;
  amountKobo: number;
  depositPercent: number;
  blurb: string;
  includes: string[];
  badge?: string;
};

export const STUDENT_PACKAGES: StudentPackage[] = [
  {
    id: "student-proposal",
    name: "Proposal & outline",
    priceNgn: 15_000,
    amountKobo: 15_000 * 100,
    depositPercent: 100,
    blurb: "Topic refinement, proposal structure, and chapter outline.",
    includes: [
      "Topic review & sharpening",
      "Proposal structure",
      "Chapter outline",
      "Request ID tracking",
    ],
    badge: "From ₦15k",
  },
  {
    id: "student-stats",
    name: "Statistical project",
    priceNgn: 25_000,
    amountKobo: 25_000 * 100,
    depositPercent: 100,
    blurb: "Questionnaire analysis, tables, and results write-up support.",
    includes: [
      "Data cleaning guidance",
      "Descriptive statistics & tables",
      "Results narrative draft",
      "Revisions via feedback box",
    ],
    badge: "₦25k",
  },
  {
    id: "student-full",
    name: "Design & implement (full project)",
    priceNgn: 30_000,
    amountKobo: 30_000 * 100,
    depositPercent: 100,
    blurb: "End-to-end research project writing with stage tracking.",
    includes: [
      "Full chapter workflow",
      "Methodology & literature support",
      "Results & discussion support",
      "Formatting & revision rounds",
    ],
    badge: "₦30k",
  },
];

export function getStudentPackage(id: string): StudentPackage | undefined {
  return STUDENT_PACKAGES.find((p) => p.id === id);
}

export const PROJECT_STAGES = [
  { code: "received", label: "Request received" },
  { code: "topic_review", label: "Topic review" },
  { code: "outline", label: "Outline / chapter plan" },
  { code: "drafting", label: "Drafting in progress" },
  { code: "first_draft", label: "First draft ready" },
  { code: "revisions", label: "Revisions from your feedback" },
  { code: "delivered", label: "Delivered" },
  { code: "completed", label: "Completed" },
] as const;

export type ProjectStageCode = (typeof PROJECT_STAGES)[number]["code"];

export function stageLabel(code: string): string {
  return PROJECT_STAGES.find((s) => s.code === code)?.label || code;
}
