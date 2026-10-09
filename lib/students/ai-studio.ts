/**
 * DoyinTech AI Project Studio — structured academic generators.
 * Works offline with high-quality scaffolds. If OPENAI_API_KEY is set,
 * optional LLM polish can be enabled via opts.useLlm.
 */

export type StudioMode =
  | "outline"
  | "chapter"
  | "abstract"
  | "narrative"
  | "cover_letter"
  | "citation";

export type OutlineInput = {
  topic: string;
  field?: string;
  level?: "undergraduate" | "postgraduate" | "phd";
  methodology?: string;
  objectives?: string;
};

export type ChapterInput = {
  topic: string;
  chapter: "1" | "2" | "3" | "4" | "5";
  field?: string;
  notes?: string;
};

export type AbstractInput = {
  topic: string;
  field?: string;
  method?: string;
  keyFinding?: string;
};

export type CoverLetterInput = {
  fullName: string;
  role: string;
  company: string;
  experience?: string;
  skills?: string;
  tone?: "professional" | "confident" | "warm";
};

export type CitationInput = {
  style: "apa" | "mla" | "chicago" | "harvard";
  type: "book" | "journal" | "website" | "thesis";
  authors: string;
  title: string;
  year: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  accessed?: string;
  place?: string;
};

function clean(s: string, max = 500): string {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function fieldLabel(field?: string): string {
  return clean(field || "the relevant discipline", 80);
}

export function generateOutline(input: OutlineInput): string {
  const topic = clean(input.topic, 220);
  const field = fieldLabel(input.field);
  const level = input.level || "undergraduate";
  const method = clean(input.methodology || "a mixed or appropriate research design", 120);
  const objectives = clean(
    input.objectives ||
      "to examine the problem, analyse evidence, and recommend practical implications",
    200
  );

  return [
    `# Research project outline`,
    ``,
    `**Topic:** ${topic}`,
    `**Field:** ${field}`,
    `**Level:** ${level}`,
    ``,
    `## Working title`,
    `${topic}: An Empirical Investigation`,
    ``,
    `## Chapter 1 — Introduction`,
    `1.1 Background to the study`,
    `1.2 Statement of the problem`,
    `1.3 Aim and objectives of the study`,
    `1.4 Research questions / hypotheses`,
    `1.5 Significance of the study`,
    `1.6 Scope and limitations`,
    `1.7 Definition of key terms`,
    `1.8 Organisation of the study`,
    ``,
    `## Chapter 2 — Literature review`,
    `2.1 Conceptual framework`,
    `2.2 Theoretical framework`,
    `2.3 Empirical review (local and international studies)`,
    `2.4 Gaps in the literature`,
    `2.5 Summary of the review`,
    ``,
    `## Chapter 3 — Research methodology`,
    `3.1 Research design (${method})`,
    `3.2 Population of the study`,
    `3.3 Sample size and sampling technique`,
    `3.4 Instruments of data collection`,
    `3.5 Validity and reliability`,
    `3.6 Method of data analysis`,
    `3.7 Ethical considerations`,
    ``,
    `## Chapter 4 — Results and discussion`,
    `4.1 Demographic characteristics of respondents`,
    `4.2 Presentation of findings by objective`,
    `4.3 Discussion of findings in relation to literature`,
    ``,
    `## Chapter 5 — Summary, conclusion and recommendations`,
    `5.1 Summary of findings`,
    `5.2 Conclusion`,
    `5.3 Recommendations`,
    `5.4 Suggestions for further research`,
    ``,
    `## Suggested research focus`,
    `Primary objective direction: ${objectives}.`,
    ``,
    `---`,
    `*Draft outline by DoyinTech AI Project Studio. Refine with your supervisor before submission.*`,
  ].join("\n");
}

export function generateChapter(input: ChapterInput): string {
  const topic = clean(input.topic, 220);
  const field = fieldLabel(input.field);
  const notes = clean(input.notes || "", 400);
  const ch = input.chapter;

  const intros: Record<string, string> = {
    "1": [
      `# Chapter 1: Introduction`,
      ``,
      `## 1.1 Background to the study`,
      `The subject of **${topic}** has attracted growing attention within ${field}. Recent developments in practice and policy have made it necessary to examine the issue systematically, especially for stakeholders who rely on evidence-based decisions.`,
      ``,
      `Despite increased discussion, many existing accounts remain descriptive. A structured investigation that clarifies the problem, situates it in theory, and gathers relevant evidence is therefore justified.`,
      ``,
      `## 1.2 Statement of the problem`,
      `Although ${topic.toLowerCase()} is widely discussed, gaps persist in how the phenomenon is measured, explained, and addressed in real contexts. Decision-makers and researchers still face incomplete evidence on causes, patterns, and practical outcomes.`,
      ``,
      `## 1.3 Aim and objectives`,
      `The aim of this study is to investigate ${topic.toLowerCase()} within the context of ${field}. Specific objectives include:`,
      `1. To examine the key dimensions of the problem.`,
      `2. To analyse factors associated with observed patterns.`,
      `3. To assess implications for practice and policy.`,
      `4. To recommend evidence-informed actions.`,
      ``,
      `## 1.4 Research questions`,
      `1. What is the current state of ${topic.toLowerCase()} in the study context?`,
      `2. Which factors most strongly relate to the outcomes of interest?`,
      `3. What practical implications follow from the findings?`,
      ``,
      `## 1.5 Significance of the study`,
      `Findings are expected to inform researchers, practitioners, and institutional stakeholders working in ${field}. The study also contributes to the local evidence base and may guide future projects.`,
      ``,
      `## 1.6 Scope and limitations`,
      `The study focuses on the defined topic, population, and time frame. Constraints may include access to respondents, self-report bias, and resource limits. These are acknowledged and managed through transparent methods.`,
      ``,
      `## 1.7 Organisation of the study`,
      `Chapter Two reviews related literature. Chapter Three presents the methodology. Chapter Four reports and discusses findings. Chapter Five concludes and offers recommendations.`,
      notes ? `\n## Researcher notes\n${notes}\n` : "",
      `---`,
      `*Scaffold by DoyinTech AI Project Studio — expand with citations and local context.*`,
    ].join("\n"),
    "2": [
      `# Chapter 2: Literature review`,
      ``,
      `## 2.1 Introduction`,
      `This chapter reviews concepts, theories, and empirical studies related to **${topic}** in ${field}. The goal is to establish what is known, identify gaps, and frame the present study.`,
      ``,
      `## 2.2 Conceptual framework`,
      `Key concepts linked to the topic are defined and related. Clear definitions reduce ambiguity and guide instrument design and interpretation of results.`,
      ``,
      `## 2.3 Theoretical framework`,
      `Relevant theories that explain behaviour, systems, or outcomes in this domain are summarised. The framework selected for this study will guide hypothesis or research-question development.`,
      ``,
      `## 2.4 Empirical review`,
      `Prior studies (local and international) are synthesised under themes such as prevalence, determinants, interventions, and outcomes. Agreements, contradictions, and methodological strengths or weaknesses are noted.`,
      ``,
      `## 2.5 Gaps in the literature`,
      `Existing work may under-represent certain populations, settings, or variables connected to ${topic.toLowerCase()}. This study responds to those gaps by focusing on the stated objectives and context.`,
      ``,
      `## 2.6 Summary`,
      `The review positions the study within ${field} and justifies the methodological choices in Chapter Three.`,
      notes ? `\n## Researcher notes\n${notes}\n` : "",
      `---`,
      `*Scaffold by DoyinTech AI Project Studio — insert APA/Harvard citations from your sources.*`,
    ].join("\n"),
    "3": [
      `# Chapter 3: Research methodology`,
      ``,
      `## 3.1 Research design`,
      `This study adopts an appropriate design for investigating **${topic}** in ${field}. The design is selected to align objectives with data needs and analytical strategy.`,
      ``,
      `## 3.2 Population of the study`,
      `The target population comprises individuals or units relevant to the research problem. Inclusion and exclusion criteria are stated to define eligibility.`,
      ``,
      `## 3.3 Sample size and sampling technique`,
      `A justified sample size and sampling procedure (probability or non-probability, as appropriate) are used to obtain respondents while balancing representativeness and feasibility.`,
      ``,
      `## 3.4 Instruments of data collection`,
      `Data are collected using structured instruments (for example questionnaires or interview guides). Items are mapped to research objectives and reviewed for clarity.`,
      ``,
      `## 3.5 Validity and reliability`,
      `Content validity is supported through expert review. Reliability is assessed using appropriate statistics (for example Cronbach’s alpha for multi-item scales).`,
      ``,
      `## 3.6 Method of data analysis`,
      `Descriptive statistics summarise the data. Inferential procedures, where applicable, test relationships or differences aligned with the research questions. Results are presented in tables and narrative form.`,
      ``,
      `## 3.7 Ethical considerations`,
      `Participation is voluntary. Informed consent, confidentiality, and responsible data handling are observed throughout the study.`,
      notes ? `\n## Researcher notes\n${notes}\n` : "",
      `---`,
      `*Scaffold by DoyinTech AI Project Studio — align with your department’s methodology template.*`,
    ].join("\n"),
    "4": [
      `# Chapter 4: Results and discussion`,
      ``,
      `## 4.1 Introduction`,
      `This chapter presents findings on **${topic}** and discusses them in light of the literature reviewed in Chapter Two.`,
      ``,
      `## 4.2 Demographic characteristics of respondents`,
      `Respondent profiles (for example age, gender, education, role) are summarised to contextualise subsequent results. Tables should report frequencies and percentages.`,
      ``,
      `## 4.3 Findings by objective`,
      `Results are organised by research objective. For each objective, key statistics (frequencies, means, or test outcomes) are reported, followed by a short interpretation.`,
      ``,
      `## 4.4 Discussion of findings`,
      `Findings are compared with prior studies in ${field}. Agreements strengthen confidence in the patterns observed; differences are explained with reference to context, sample, or method.`,
      ``,
      `## 4.5 Summary of chapter`,
      `The chapter links empirical evidence to the study objectives and prepares the conclusions in Chapter Five.`,
      notes ? `\n## Researcher notes\n${notes}\n` : "",
      `---`,
      `*Scaffold by DoyinTech AI Project Studio — paste tables from the Questionnaire Analyzer here.*`,
    ].join("\n"),
    "5": [
      `# Chapter 5: Summary, conclusion and recommendations`,
      ``,
      `## 5.1 Summary of findings`,
      `This study examined **${topic}** within ${field}. The main findings corresponding to each objective are restated concisely, without introducing new analysis.`,
      ``,
      `## 5.2 Conclusion`,
      `Based on the evidence, the study concludes that the problem and patterns identified have clear implications for practice and further inquiry in ${field}.`,
      ``,
      `## 5.3 Recommendations`,
      `1. Practitioners should apply the most actionable findings in day-to-day decisions.`,
      `2. Institutions should strengthen systems that address the root issues identified.`,
      `3. Training and awareness programmes may improve outcomes where knowledge gaps exist.`,
      `4. Policy stakeholders should consider the evidence when updating guidelines.`,
      ``,
      `## 5.4 Suggestions for further research`,
      `Future studies may use larger samples, longitudinal designs, or mixed methods to deepen understanding of ${topic.toLowerCase()}.`,
      notes ? `\n## Researcher notes\n${notes}\n` : "",
      `---`,
      `*Scaffold by DoyinTech AI Project Studio — personalise recommendations to your findings.*`,
    ].join("\n"),
  };

  return intros[ch] || intros["1"];
}

export function generateAbstract(input: AbstractInput): string {
  const topic = clean(input.topic, 220);
  const field = fieldLabel(input.field);
  const method = clean(input.method || "a structured survey design", 120);
  const finding = clean(
    input.keyFinding ||
      "notable patterns relevant to practice and policy, subject to the study’s limitations",
    200
  );

  return [
    `## Abstract`,
    ``,
    `This study investigated ${topic.toLowerCase()} within the context of ${field}. The research adopted ${method} to collect and analyse relevant data. Findings indicate ${finding}. The study contributes to the evidence base in ${field} and offers practical recommendations for stakeholders. Implications for policy, practice, and further research are discussed.`,
    ``,
    `**Keywords:** ${topic.split(/\s+/).slice(0, 5).join(", ")}, ${field}, research`,
    ``,
    `---`,
    `*Abstract draft by DoyinTech AI Project Studio — replace findings with your actual results.*`,
  ].join("\n");
}

export function enrichAnalysisNarrative(params: {
  rowCount: number;
  columnCount: number;
  columns: {
    name: string;
    kind: string;
    n: number;
    mean?: number;
    sd?: number;
    missing?: number;
    frequencies?: { value: string; count: number; pct: number }[];
  }[];
}): string {
  const { rowCount, columnCount, columns } = params;
  const numeric = columns.filter((c) => c.kind === "numeric");
  const categorical = columns.filter((c) => c.kind === "categorical");

  const lines: string[] = [
    `## Results narrative (draft)`,
    ``,
    `This section presents a descriptive analysis of ${rowCount} valid questionnaire response(s) across ${columnCount} variable(s). The draft is intended to support Chapter Four writing and must be verified with your supervisor before submission.`,
    ``,
    `### Sample overview`,
    `After removing empty rows, ${rowCount} response(s) remained for analysis. ${numeric.length} numeric variable(s) and ${categorical.length} categorical variable(s) were profiled.`,
    ``,
  ];

  if (numeric.length) {
    lines.push(`### Numeric variables`);
    for (const c of numeric.slice(0, 8)) {
      lines.push(
        `For **${c.name}**, valid observations (N) = ${c.n}` +
          (c.mean !== undefined ? `, mean = ${c.mean}` : "") +
          (c.sd !== undefined ? `, SD = ${c.sd}` : "") +
          `.`
      );
    }
    lines.push(``);
  }

  if (categorical.length) {
    lines.push(`### Categorical variables`);
    for (const c of categorical.slice(0, 8)) {
      const top = c.frequencies?.[0];
      if (top) {
        lines.push(
          `For **${c.name}**, the most frequent response was “${top.value}” (${top.count} responses; ${top.pct}%).`
        );
      } else {
        lines.push(`For **${c.name}**, ${c.n} valid response(s) were recorded.`);
      }
    }
    lines.push(``);
  }

  lines.push(
    `### Interpretation note`,
    `Patterns above are descriptive only. Inferential tests (for example chi-square, t-test, or regression) should be applied where research questions require them, using a full statistical package if needed.`,
    ``,
    `### Next steps`,
    `1. Insert corresponding tables from the analysis output into Chapter Four.`,
    `2. Link each finding to a research objective.`,
    `3. Compare results with literature reviewed in Chapter Two.`,
    ``,
    `- Draft generated by DoyinTech Student Analyzer + AI Project Studio.`
  );

  return lines.join("\n");
}

export function formatCitation(input: CitationInput): string {
  const authors = clean(input.authors, 200);
  const title = clean(input.title, 300);
  const year = clean(input.year, 12) || "n.d.";
  const publisher = clean(input.publisher || "", 120);
  const journal = clean(input.journal || "", 120);
  const volume = clean(input.volume || "", 20);
  const issue = clean(input.issue || "", 20);
  const pages = clean(input.pages || "", 40);
  const url = clean(input.url || "", 300);
  const accessed = clean(input.accessed || "", 40);
  const place = clean(input.place || "", 80);
  const style = input.style;
  const type = input.type;

  if (style === "apa") {
    if (type === "journal") {
      const volIss = volume && issue ? `${volume}(${issue})` : volume || "";
      return `${authors} (${year}). ${title}. *${journal || "Journal"}*${volIss ? `, ${volIss}` : ""}${pages ? `, ${pages}` : ""}.${url ? ` ${url}` : ""}`;
    }
    if (type === "website") {
      return `${authors} (${year}). *${title}*.${url ? ` ${url}` : ""}${accessed ? ` (Accessed ${accessed})` : ""}`;
    }
    if (type === "thesis") {
      return `${authors} (${year}). *${title}* [Thesis]. ${publisher || "Institution"}.`;
    }
    return `${authors} (${year}). *${title}*. ${place ? place + ": " : ""}${publisher || "Publisher"}.`;
  }

  if (style === "mla") {
    if (type === "journal") {
      return `${authors}. “${title}.” *${journal || "Journal"}*${volume ? `, vol. ${volume}` : ""}${issue ? `, no. ${issue}` : ""}, ${year}${pages ? `, pp. ${pages}` : ""}.`;
    }
    if (type === "website") {
      return `${authors}. “${title}.” ${year}${url ? `, ${url}` : ""}${accessed ? `. Accessed ${accessed}` : ""}.`;
    }
    return `${authors}. *${title}*. ${publisher || "Publisher"}, ${year}.`;
  }

  if (style === "chicago") {
    if (type === "journal") {
      return `${authors}. “${title}.” *${journal || "Journal"}* ${volume || ""}${issue ? `, no. ${issue}` : ""} (${year})${pages ? `: ${pages}` : ""}.`;
    }
    return `${authors}. *${title}*. ${place ? place + ": " : ""}${publisher || "Publisher"}, ${year}.`;
  }

  if (type === "journal") {
    return `${authors} (${year}) ‘${title}’, *${journal || "Journal"}*${volume ? `, ${volume}` : ""}${issue ? `(${issue})` : ""}${pages ? `, pp. ${pages}` : ""}.`;
  }
  if (type === "website") {
    return `${authors} (${year}) *${title}*. Available at: ${url || "[URL]"}${accessed ? ` (Accessed: ${accessed})` : ""}.`;
  }
  return `${authors} (${year}) *${title}*. ${place ? place + ": " : ""}${publisher || "Publisher"}.`;
}

export function generateCoverLetter(input: CoverLetterInput): string {
  const name = clean(input.fullName, 80) || "Applicant";
  const role = clean(input.role, 100) || "the open role";
  const company = clean(input.company, 100) || "your organisation";
  const experience = clean(input.experience || "relevant academic and practical experience", 280);
  const skills = clean(input.skills || "communication, analysis, and teamwork", 200);
  const tone = input.tone || "professional";

  const open =
    tone === "confident"
      ? `I am writing to apply for the ${role} position at ${company}. I am confident my background makes me a strong match for your team.`
      : tone === "warm"
        ? `I am excited to apply for the ${role} role at ${company}. I admire your work and would welcome the chance to contribute.`
        : `I am writing to express my interest in the ${role} position at ${company}.`;

  return [
    `Dear Hiring Manager,`,
    ``,
    open,
    ``,
    `Through ${experience}, I have developed strengths in ${skills}. I am motivated to bring that preparation to ${company} and to grow with a team that values clear thinking and reliable delivery.`,
    ``,
    `I would welcome the opportunity to discuss how I can support your goals. Thank you for your time and consideration.`,
    ``,
    `Sincerely,`,
    name,
    ``,
    `---`,
    `*Draft by DoyinTech AI Project Studio — personalise with metrics and a real contact name when possible.*`,
  ].join("\n");
}

/** Optional LLM polish when OPENAI_API_KEY is present. */
export async function maybePolishWithLlm(
  text: string,
  instruction: string
): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return text;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 2500,
        messages: [
          {
            role: "system",
            content:
              "You are an academic writing assistant. Improve clarity and structure. Do not invent citations or data. Keep headings. Output markdown only.",
          },
          {
            role: "user",
            content: `${instruction}\n\n---\n${text.slice(0, 12000)}`,
          },
        ],
      }),
    });
    if (!res.ok) return text;
    const data = await res.json();
    const out = data?.choices?.[0]?.message?.content;
    return typeof out === "string" && out.trim() ? out.trim() : text;
  } catch {
    return text;
  }
}
