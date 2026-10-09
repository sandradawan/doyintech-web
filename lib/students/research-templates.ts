import { formatUsdFromNgn, ngnToKobo, priceLabelFromNgn } from "@/lib/currency";

export type ResearchTemplate = {
  id: string;
  slug: string;
  name: string;
  category: "proposal" | "chapters" | "survey" | "cv" | "bundle";
  blurb: string;
  priceNgn: number;
  amountKobo: number;
  badge?: string;
  includes: string[];
  previewMarkdown: string;
  fullMarkdown: string;
};

export const RESEARCH_TEMPLATES: ResearchTemplate[] = [
  {
    id: "rt-proposal",
    slug: "research-proposal-template",
    name: "Research proposal template",
    category: "proposal",
    blurb: "Title, background, problem, objectives, questions, significance, and outline.",
    priceNgn: 0,
    amountKobo: 0,
    badge: "Free",
    includes: ["Proposal structure", "Objectives sheet", "Supervisor checklist"],
    previewMarkdown: `# Research proposal template\n\n## Working title\n[Your topic]\n\n## Background\n...\n`,
    fullMarkdown: `# Research proposal template\n\n## 1. Working title\nState a clear, focused title.\n\n## 2. Background to the study\nIntroduce the broader issue and why it matters now (1–2 pages).\n\n## 3. Statement of the problem\nDescribe the gap, tension, or practical problem the study addresses.\n\n## 4. Aim and objectives\n- Aim: one sentence.\n- Objectives: 3–5 measurable statements.\n\n## 5. Research questions / hypotheses\nList questions aligned to objectives (or hypotheses for quantitative work).\n\n## 6. Significance of the study\nWho benefits and how (academia, practice, policy).\n\n## 7. Scope and limitations\nBoundaries of population, place, time, and method.\n\n## 8. Brief methodology\nDesign, population, sample, instruments, analysis plan.\n\n## 9. Proposed chapter outline\nChapters 1–5 headings.\n\n## 10. References (starter list)\nAdd sources in your department’s required style.\n\n---\nDoyinTech · Free research template · doyintech.com/students\n`,
  },
  {
    id: "rt-ch1-5",
    slug: "chapter-structure-guide",
    name: "Chapters 1–5 structure guide",
    category: "chapters",
    blurb: "Section-by-section checklist for a standard five-chapter project.",
    priceNgn: 0,
    amountKobo: 0,
    badge: "Free",
    includes: ["Chapter checklists", "Common mistakes list"],
    previewMarkdown: `# Chapters 1–5 structure\n\n## Chapter 1 checklist\n- Background\n- Problem\n...`,
    fullMarkdown: `# Chapters 1–5 structure guide\n\n## Chapter 1 — Introduction\n- Background\n- Problem statement\n- Aim & objectives\n- Questions / hypotheses\n- Significance\n- Scope & limitations\n- Definition of terms\n- Organisation of study\n\n## Chapter 2 — Literature review\n- Concepts\n- Theories\n- Empirical studies\n- Gaps\n- Summary\n\n## Chapter 3 — Methodology\n- Design\n- Population & sample\n- Instruments\n- Validity & reliability\n- Analysis methods\n- Ethics\n\n## Chapter 4 — Results & discussion\n- Demographics\n- Findings by objective\n- Discussion vs literature\n\n## Chapter 5 — Conclusion\n- Summary of findings\n- Conclusion\n- Recommendations\n- Further research\n\n### Common mistakes to avoid\n1. Objectives that do not match questions.\n2. Literature with no gap statement.\n3. Methodology copied without fit to design.\n4. Results without discussion.\n5. Recommendations not tied to findings.\n\n---\nDoyinTech · Free template · doyintech.com/students/studio\n`,
  },
  {
    id: "rt-survey",
    slug: "questionnaire-design-kit",
    name: "Questionnaire design kit",
    category: "survey",
    blurb: "Item writing tips, Likert examples, and pilot checklist.",
    priceNgn: 2500,
    amountKobo: ngnToKobo(2500),
    badge: priceLabelFromNgn(2500),
    includes: ["Item bank examples", "Pilot checklist", "Ethics note"],
    previewMarkdown: `# Questionnaire design kit (preview)\n\n## Principles\nOne idea per item...`,
    fullMarkdown: `# Questionnaire design kit\n\n## Principles\n- One idea per item\n- Neutral wording (avoid leading questions)\n- Clear time frame (“in the last 6 months…”)\n- Consistent response scales\n\n## Example Likert items (1–5)\n1. I clearly understand the process under study.\n2. The available resources are adequate for my role.\n3. Communication within the system is effective.\n4. I am satisfied with current outcomes related to the topic.\n\n## Demographics block\nAge band · Gender · Education · Role · Years of experience\n\n## Pilot checklist\n- [ ] 5–10 pilot respondents\n- [ ] Timed completion\n- [ ] Ambiguous items revised\n- [ ] Cronbach’s alpha planned for multi-item scales\n\n## Ethics\nInformed consent, voluntary participation, anonymity or confidentiality as applicable.\n\n---\nDoyinTech research templates · Pair with /students/analyzer\n`,
  },
  {
    id: "rt-lit",
    slug: "literature-review-matrix",
    name: "Literature review matrix",
    category: "chapters",
    blurb: "Table template to organise authors, methods, findings, and gaps.",
    priceNgn: 0,
    amountKobo: 0,
    badge: "Free",
    includes: ["Matrix table", "Gap extraction prompts"],
    previewMarkdown: `| Author (year) | Method | Key finding | Gap |\n| --- | --- | --- | --- |`,
    fullMarkdown: `# Literature review matrix\n\n| Author (year) | Country / context | Method | Sample | Key finding | Limitation / gap |\n| --- | --- | --- | --- | --- | --- |\n|  |  |  |  |  |  |\n|  |  |  |  |  |  |\n|  |  |  |  |  |  |\n\n## How to use\n1. Add 12–25 core sources.\n2. Group rows by theme before writing Chapter 2.\n3. Write the “gap” column last — it feeds your problem statement.\n\n---\nDoyinTech · Free template\n`,
  },
  {
    id: "rt-cv-pack",
    slug: "student-cv-cover-pack",
    name: "Student CV + cover letter pack",
    category: "cv",
    blurb: "Graduate CV outline and cover letter structure for applications.",
    priceNgn: 0,
    amountKobo: 0,
    badge: "Free",
    includes: ["CV outline", "Cover letter structure", "Link to AI tools"],
    previewMarkdown: `# Student CV outline\n\n## Header\nName · Email · Phone · LinkedIn`,
    fullMarkdown: `# Student CV + cover letter pack\n\n## CV outline\n1. Header — name, email, phone, city, LinkedIn/portfolio\n2. Profile — 3 lines on focus and strengths\n3. Education — degree, institution, dates, key modules\n4. Projects — 2–4 academic or personal projects with outcomes\n5. Experience — internships, NYSC, part-time, volunteering\n6. Skills — tools, languages, methods\n7. Awards / certifications\n\n## Cover letter structure\n1. Role + company + why you\n2. Evidence (project or result)\n3. Fit with their needs\n4. Polite close + availability\n\nGenerate a tailored draft at: /students/cover-letter\nBuild a CV at: /tools/cv-builder\n\n---\nDoyinTech\n`,
  },
];

export function getResearchTemplate(slug: string): ResearchTemplate | undefined {
  return RESEARCH_TEMPLATES.find((t) => t.slug === slug || t.id === slug);
}

export function templatePriceLabel(t: ResearchTemplate): string {
  if (t.priceNgn <= 0) return "Free";
  return formatUsdFromNgn(t.priceNgn);
}
