/**
 * Multi-sector structured generators for DoyinTech AI Tools.
 * High-quality scaffolds without an API key; optional LLM polish via openai.ts.
 */

function clean(s: string, max = 400): string {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

// ─── Education ───────────────────────────────────────────────

export function genLessonPlan(input: {
  subject: string;
  topic: string;
  level?: string;
  duration?: string;
}): string {
  const subject = clean(input.subject, 80) || "General studies";
  const topic = clean(input.topic, 160) || "Core topic";
  const level = clean(input.level || "Secondary / tertiary", 60);
  const duration = clean(input.duration || "45–60 minutes", 40);

  return [
    `# Lesson plan`,
    ``,
    `**Subject:** ${subject}`,
    `**Topic:** ${topic}`,
    `**Level:** ${level}`,
    `**Duration:** ${duration}`,
    ``,
    `## Learning objectives`,
    `By the end of this lesson, learners will be able to:`,
    `1. Explain the key ideas related to ${topic}.`,
    `2. Apply the concepts in a short guided activity.`,
    `3. Evaluate one real-world example connected to the topic.`,
    ``,
    `## Materials`,
    `- Whiteboard / slides`,
    `- Short reading or example case`,
    `- Worksheet or discussion prompt`,
    ``,
    `## Lesson sequence`,
    `| Stage | Time | Activity |`,
    `| --- | --- | --- |`,
    `| Starter | 5–8 min | Hook question or quick recap |`,
    `| Teach | 12–15 min | Explain core concepts of ${topic} |`,
    `| Guided practice | 10–12 min | Worked example as a group |`,
    `| Independent | 10–12 min | Short task or quiz questions |`,
    `| Plenary | 5 min | Exit ticket: one thing learned |`,
    ``,
    `## Assessment`,
    `- Formative: observation during guided practice`,
    `- Exit ticket: 2–3 questions on ${topic}`,
    ``,
    `## Differentiation`,
    `- Support: sentence starters / glossary`,
    `- Stretch: extension question linking to prior topics in ${subject}`,
    ``,
    `---`,
    `*Draft by DoyinTech AI Tools · Education — adapt to your curriculum.*`,
  ].join("\n");
}

export function genStudyPlan(input: {
  examOrGoal: string;
  subjects?: string;
  weeks?: string;
}): string {
  const goal = clean(input.examOrGoal, 120) || "upcoming assessment";
  const subjects = clean(input.subjects || "core modules", 160);
  const weeks = clean(input.weeks || "4", 8);

  return [
    `# Study plan — ${goal}`,
    ``,
    `**Focus areas:** ${subjects}`,
    `**Horizon:** ${weeks} week(s)`,
    ``,
    `## Weekly rhythm`,
    `1. **Monday** — Review notes + identify weak topics`,
    `2. **Tuesday** — Deep study block (45–90 min)`,
    `3. **Wednesday** — Practice questions / past papers`,
    `4. **Thursday** — Teach-back or summary notes`,
    `5. **Friday** — Mixed quiz + error log`,
    `6. **Weekend** — Light review + rest buffer`,
    ``,
    `## Priority matrix`,
    `- High weight + low confidence → study first`,
    `- High weight + high confidence → maintain with short drills`,
    `- Low weight + low confidence → schedule late in the week`,
    ``,
    `## Daily template (60–90 min)`,
    `1. 5 min — recall previous session`,
    `2. 35–50 min — focused study on one topic from ${subjects}`,
    `3. 15 min — active recall questions`,
    `4. 5 min — log mistakes and next action`,
    ``,
    `## Tracking`,
    `- [ ] Week 1 complete`,
    `- [ ] Week 2 complete`,
    `- [ ] Mock test done`,
    `- [ ] Weak topics revised twice`,
    ``,
    `---`,
    `*DoyinTech AI Tools · Education*`,
  ].join("\n");
}

// ─── Finance ─────────────────────────────────────────────────

export function genPaymentReminder(input: {
  clientName: string;
  amount: string;
  dueDate?: string;
  invoiceRef?: string;
  tone?: string;
}): string {
  const client = clean(input.clientName, 80) || "valued client";
  const amount = clean(input.amount, 40) || "the outstanding balance";
  const due = clean(input.dueDate || "the stated due date", 40);
  const ref = clean(input.invoiceRef || "", 40);
  const tone = (input.tone || "professional").toLowerCase();

  const open =
    tone === "firm"
      ? `I am writing regarding the outstanding payment of **${amount}**`
      : tone === "friendly"
        ? `Hope you are well — a quick note about the payment of **${amount}**`
        : `Please find a polite reminder regarding payment of **${amount}**`;

  return [
    `# Payment reminder`,
    ``,
    `Hi ${client},`,
    ``,
    `${open}${ref ? ` (ref: ${ref})` : ""}, due by **${due}**.`,
    ``,
    `If payment has already been made, please ignore this message or share the transfer reference so we can update our records.`,
    ``,
    `If you need an updated invoice, alternate payment method, or a short extension, reply to this message and we will assist.`,
    ``,
    `Thank you for your business.`,
    ``,
    `Best regards,`,
    `[Your name]`,
    `[Business name]`,
    ``,
    `---`,
    `*DoyinTech AI Tools · Finance — personalise before sending.*`,
  ].join("\n");
}

export function genCashflowChecklist(input: {
  businessType?: string;
}): string {
  const biz = clean(input.businessType || "SME", 80);

  return [
    `# Cash-flow checklist — ${biz}`,
    ``,
    `## This week`,
    `- [ ] List all expected inflows (invoices, deposits, sales)`,
    `- [ ] List fixed outflows (rent, salaries, subscriptions)`,
    `- [ ] Flag any payment more than 7 days overdue`,
    `- [ ] Send one polite reminder for the oldest receivable`,
    ``,
    `## This month`,
    `- [ ] Separate business and personal accounts`,
    `- [ ] Set a minimum cash buffer (e.g. 2–4 weeks of fixed costs)`,
    `- [ ] Review prices on your top 3 products/services`,
    `- [ ] Confirm tax/filing dates on a calendar`,
    ``,
    `## Controls`,
    `- Require deposits before starting large jobs`,
    `- Issue invoices same day work is delivered`,
    `- Track payables with due dates, not memory`,
    `- Review bank balance every Monday`,
    ``,
    `## Red flags`,
    `- Growing receivables while cash is tight`,
    `- Relying on one client for >40% of revenue`,
    `- No written payment terms`,
    ``,
    `---`,
    `*DoyinTech AI Tools · Finance — not formal financial advice.*`,
  ].join("\n");
}

export function genPricingNote(input: {
  offer: string;
  costHint?: string;
  market?: string;
}): string {
  const offer = clean(input.offer, 120) || "your offer";
  const cost = clean(input.costHint || "your direct costs and time", 100);
  const market = clean(input.market || "your local market", 80);

  return [
    `# Pricing worksheet — ${offer}`,
    ``,
    `## Cost floor`,
    `1. Direct costs: materials, tools, subcontractors`,
    `2. Your time (hours × target hourly rate)`,
    `3. Overhead share (software, data, transport)`,
    `4. Risk / revision buffer (10–20%)`,
    ``,
    `Reference cost inputs: ${cost}.`,
    ``,
    `## Value ceiling`,
    `- What outcome does the client buy with **${offer}**?`,
    `- What would they pay a slower or riskier alternative?`,
    `- Comparable offers in ${market}`,
    ``,
    `## Package structure (suggested)`,
    `| Tier | Includes | Who it fits |`,
    `| --- | --- | --- |`,
    `| Starter | Core delivery only | Budget-conscious |`,
    `| Standard | Core + support window | Most clients |`,
    `| Premium | Priority + extras | High-stakes jobs |`,
    ``,
    `## Payment terms`,
    `- 50% deposit to start (recommended for custom work)`,
    `- Balance on delivery / milestone`,
    `- Written scope to reduce unpaid scope creep`,
    ``,
    `---`,
    `*DoyinTech AI Tools · Finance*`,
  ].join("\n");
}

// ─── SME / Business ──────────────────────────────────────────

export function genBusinessPlanOutline(input: {
  businessName: string;
  industry?: string;
  goal?: string;
}): string {
  const name = clean(input.businessName, 100) || "Business";
  const industry = clean(input.industry || "services", 80);
  const goal = clean(input.goal || "grow profitable revenue in the next 12 months", 160);

  return [
    `# Business plan outline — ${name}`,
    ``,
    `**Industry:** ${industry}`,
    `**Primary goal:** ${goal}`,
    ``,
    `## 1. Executive summary`,
    `One-page snapshot: problem, solution, target customer, traction, ask.`,
    ``,
    `## 2. Problem & opportunity`,
    `- Who feels the pain?`,
    `- Why now?`,
    `- Current alternatives and their gaps`,
    ``,
    `## 3. Solution & offer`,
    `- Core product/service of ${name}`,
    `- Delivery model (one-off, retainer, productised)`,
    `- Differentiation`,
    ``,
    `## 4. Market`,
    `- Ideal customer profile`,
    `- Geography and channels`,
    `- Rough market size logic (bottom-up preferred)`,
    ``,
    `## 5. Go-to-market`,
    `- Acquisition channels (WhatsApp, referrals, SEO, ads)`,
    `- Sales process steps`,
    `- Pricing and packaging`,
    ``,
    `## 6. Operations`,
    `- Tools and workflow`,
    `- Roles (even if solo)`,
    `- Quality and delivery standards`,
    ``,
    `## 7. Financials`,
    `- Startup / monthly costs`,
    `- Revenue assumptions`,
    `- Break-even sketch`,
    `- 12-month simple cash view`,
    ``,
    `## 8. Risks & next 90 days`,
    `- Top 5 risks + mitigation`,
    `- 90-day action milestones`,
    ``,
    `---`,
    `*DoyinTech AI Tools · SME — expand each section with your real numbers.*`,
  ].join("\n");
}

export function genElevatorPitch(input: {
  businessName: string;
  whoFor?: string;
  problem?: string;
  outcome?: string;
}): string {
  const name = clean(input.businessName, 80) || "We";
  const who = clean(input.whoFor || "busy local businesses", 100);
  const problem = clean(input.problem || "slow follow-ups and missed enquiries", 140);
  const outcome = clean(input.outcome || "more booked jobs and clearer operations", 140);

  return [
    `# Elevator pitch — ${name}`,
    ``,
    `## 20-second version`,
    `${name} helps ${who} solve ${problem}, so they get ${outcome}.`,
    ``,
    `## 45-second version`,
    `Most ${who} lose revenue to ${problem}. ${name} provides a practical system and support so teams can respond faster, stay organised, and convert more enquiries into paid work — resulting in ${outcome}.`,
    ``,
    `## Proof points to add`,
    `- One concrete result (time saved, jobs booked, revenue)`,
    `- Who you already serve`,
    `- Clear next step (demo, audit, deposit)`,
    ``,
    `## Call to action`,
    `“If this is a priority this month, we can start with a short discovery call.”`,
    ``,
    `---`,
    `*DoyinTech AI Tools · SME*`,
  ].join("\n");
}

export function genSwot(input: {
  businessName: string;
  context?: string;
}): string {
  const name = clean(input.businessName, 80) || "Business";
  const ctx = clean(input.context || "current market conditions", 160);

  return [
    `# SWOT — ${name}`,
    ``,
    `Context: ${ctx}`,
    ``,
    `## Strengths`,
    `- [ ] What do customers already praise?`,
    `- [ ] Unique skills, location, or relationships?`,
    `- [ ] Reliable delivery process?`,
    ``,
    `## Weaknesses`,
    `- [ ] Where do delays or complaints appear?`,
    `- [ ] Capacity or skill gaps?`,
    `- [ ] Weak documentation / cash discipline?`,
    ``,
    `## Opportunities`,
    `- [ ] Underserved customer segment?`,
    `- [ ] New channel (content, partnerships, packages)?`,
    `- [ ] Productise a repeated service?`,
    ``,
    `## Threats`,
    `- [ ] Competitors undercutting on price?`,
    `- [ ] Platform or payment dependency?`,
    `- [ ] Seasonality or regulation changes?`,
    ``,
    `## Priority actions (pick 3)`,
    `1. Double-down on one strength this month`,
    `2. Fix one operational weakness`,
    `3. Test one opportunity with a small experiment`,
    ``,
    `---`,
    `*DoyinTech AI Tools · SME*`,
  ].join("\n");
}

// ─── Real estate ─────────────────────────────────────────────

export function genListingDescription(input: {
  propertyType: string;
  location: string;
  beds?: string;
  features?: string;
  price?: string;
}): string {
  const type = clean(input.propertyType, 60) || "Property";
  const loc = clean(input.location, 100) || "a prime location";
  const beds = clean(input.beds || "", 40);
  const features = clean(input.features || "modern finishes, secure access, good road network", 200);
  const price = clean(input.price || "", 40);

  return [
    `# Listing description`,
    ``,
    `**${type}${beds ? ` · ${beds}` : ""} in ${loc}**`,
    price ? `**Price:** ${price}` : "",
    ``,
    `Discover this ${type.toLowerCase()} situated in ${loc}. Ideal for buyers or tenants who want comfort, accessibility, and long-term value.`,
    ``,
    `## Highlights`,
    features
      .split(/[,;]/)
      .map((f) => f.trim())
      .filter(Boolean)
      .map((f) => `- ${f}`)
      .join("\n") || "- Well-located\n- Ready for inspection",
    ``,
    `## Why this property`,
    `- Convenient access to daily amenities`,
    `- Suitable for family living or investment`,
    `- Available for serious enquiries and scheduled viewings`,
    ``,
    `## Next step`,
    `Message to book an inspection. Serious offers only.`,
    ``,
    `---`,
    `*DoyinTech AI Tools · Real estate — verify all facts before publishing.*`,
  ].join("\n");
}

export function genViewingFollowUp(input: {
  clientName: string;
  propertyLabel: string;
  agentName?: string;
}): string {
  const client = clean(input.clientName, 80) || "there";
  const property = clean(input.propertyLabel, 120) || "the property";
  const agent = clean(input.agentName || "the team", 60);

  return [
    `# Viewing follow-up message`,
    ``,
    `Hi ${client},`,
    ``,
    `Thank you for viewing **${property}** today. I hope the inspection was useful.`,
    ``,
    `If you have questions on price, availability, documentation, or next steps, reply to this message and ${agent} will assist promptly.`,
    ``,
    `If you are still comparing options, share your must-haves (budget, beds, area, timeline) and we can shortlist closer matches.`,
    ``,
    `Looking forward to helping you decide.`,
    ``,
    `Best regards,`,
    agent,
    ``,
    `---`,
    `*DoyinTech AI Tools · Real estate*`,
  ].join("\n");
}

export function genBuyerQualifier(input: {
  market?: string;
}): string {
  const market = clean(input.market || "residential", 60);

  return [
    `# Buyer / tenant qualification questions (${market})`,
    ``,
    `1. What is your target budget (all-in)?`,
    `2. Preferred areas or commute constraints?`,
    `3. Beds / baths / must-have features?`,
    `4. Timeline to move or close?`,
    `5. Financing ready (cash, mortgage pre-approval, company)?`,
    `6. Any deal-breakers (flood risk, generator, estate rules)?`,
    `7. Who else is involved in the decision?`,
    `8. Have you viewed similar properties recently?`,
    ``,
    `## Scoring tip`,
    `- Budget + timeline + decision-maker present = high priority`,
    `- Vague budget + no timeline = nurture list`,
    ``,
    `---`,
    `*DoyinTech AI Tools · Real estate*`,
  ].join("\n");
}

// ─── Sales ───────────────────────────────────────────────────

export function genSalesOutreach(input: {
  product: string;
  audience: string;
  channel?: string;
  pain?: string;
}): string {
  const product = clean(input.product, 100) || "our service";
  const audience = clean(input.audience, 100) || "business owners";
  const channel = clean(input.channel || "WhatsApp", 40);
  const pain = clean(input.pain || "missed enquiries and slow follow-up", 140);

  return [
    `# Outreach scripts — ${product}`,
    ``,
    `**Audience:** ${audience}`,
    `**Channel:** ${channel}`,
    ``,
    `## Opener A (problem-led)`,
    `Hi {{name}} — quick question: are missed enquiries or slow follow-ups costing you jobs this month? We help ${audience} with ${product} so ${pain} becomes less of a bottleneck.`,
    ``,
    `## Opener B (value-led)`,
    `Hi {{name}}, we built ${product} for ${audience} who want clearer pipelines and faster replies. Open to a 10-minute look this week?`,
    ``,
    `## Follow-up (day 2–3)`,
    `Hi {{name}}, sharing a short example of how teams like yours use ${product}. Happy to adapt it to your setup if useful.`,
    ``,
    `## Soft close`,
    `If timing is better later, tell me when to check back. If now is good, reply “demo” and I’ll send two time options.`,
    ``,
    `---`,
    `*DoyinTech AI Tools · Sales — keep messages short and human.*`,
  ].join("\n");
}

export function genProposalOutline(input: {
  client: string;
  project: string;
  outcome?: string;
}): string {
  const client = clean(input.client, 80) || "Client";
  const project = clean(input.project, 120) || "Project";
  const outcome = clean(input.outcome || "clearer results and a measurable next step", 160);

  return [
    `# Proposal outline — ${project}`,
    ``,
    `**Prepared for:** ${client}`,
    ``,
    `## 1. Understanding`,
    `Restate the client’s goal and constraints in their language.`,
    ``,
    `## 2. Recommended approach`,
    `Phases, deliverables, and why this approach fits.`,
    ``,
    `## 3. Scope`,
    `- In scope`,
    `- Out of scope`,
    `- Assumptions`,
    ``,
    `## 4. Timeline`,
    `Milestone table with review points.`,
    ``,
    `## 5. Investment`,
    `Package options + payment terms (deposit / balance).`,
    ``,
    `## 6. Outcomes`,
    `Expected result: ${outcome}.`,
    ``,
    `## 7. Next step`,
    `Accept proposal → pay deposit → kickoff checklist.`,
    ``,
    `---`,
    `*DoyinTech AI Tools · Sales*`,
  ].join("\n");
}

export function genObjectionHandlers(input: {
  offer?: string;
}): string {
  const offer = clean(input.offer || "this solution", 100);

  return [
    `# Objection handlers — ${offer}`,
    ``,
    `## “It’s too expensive”`,
    `Acknowledge → reframe to cost of delay → offer a smaller package or phased start.`,
    ``,
    `## “We already have something”`,
    `Ask what works / what doesn’t → position complementary value → pilot on one workflow.`,
    ``,
    `## “Send me information”`,
    `Send a one-page summary + one relevant example → book a short call for questions.`,
    ``,
    `## “Not now”`,
    `Agree on a review date → leave a useful checklist → stay helpful without pressure.`,
    ``,
    `## “I need to think / ask my partner”`,
    `Clarify the decision criteria → offer to join the next conversation → summarise options in writing.`,
    ``,
    `---`,
    `*DoyinTech AI Tools · Sales*`,
  ].join("\n");
}

// ─── Router ──────────────────────────────────────────────────

export type SectorId = "education" | "finance" | "sme" | "real_estate" | "sales";

export type GenerateMode =
  | "lesson_plan"
  | "study_plan"
  | "payment_reminder"
  | "cashflow_checklist"
  | "pricing_note"
  | "business_plan"
  | "elevator_pitch"
  | "swot"
  | "listing"
  | "viewing_followup"
  | "buyer_qualifier"
  | "sales_outreach"
  | "proposal_outline"
  | "objection_handlers";

export function runGenerator(mode: GenerateMode, body: Record<string, unknown>): string {
  switch (mode) {
    case "lesson_plan":
      return genLessonPlan({
        subject: String(body.subject || ""),
        topic: String(body.topic || ""),
        level: String(body.level || ""),
        duration: String(body.duration || ""),
      });
    case "study_plan":
      return genStudyPlan({
        examOrGoal: String(body.examOrGoal || body.goal || ""),
        subjects: String(body.subjects || ""),
        weeks: String(body.weeks || ""),
      });
    case "payment_reminder":
      return genPaymentReminder({
        clientName: String(body.clientName || ""),
        amount: String(body.amount || ""),
        dueDate: String(body.dueDate || ""),
        invoiceRef: String(body.invoiceRef || ""),
        tone: String(body.tone || ""),
      });
    case "cashflow_checklist":
      return genCashflowChecklist({ businessType: String(body.businessType || "") });
    case "pricing_note":
      return genPricingNote({
        offer: String(body.offer || ""),
        costHint: String(body.costHint || ""),
        market: String(body.market || ""),
      });
    case "business_plan":
      return genBusinessPlanOutline({
        businessName: String(body.businessName || ""),
        industry: String(body.industry || ""),
        goal: String(body.goal || ""),
      });
    case "elevator_pitch":
      return genElevatorPitch({
        businessName: String(body.businessName || ""),
        whoFor: String(body.whoFor || ""),
        problem: String(body.problem || ""),
        outcome: String(body.outcome || ""),
      });
    case "swot":
      return genSwot({
        businessName: String(body.businessName || ""),
        context: String(body.context || ""),
      });
    case "listing":
      return genListingDescription({
        propertyType: String(body.propertyType || ""),
        location: String(body.location || ""),
        beds: String(body.beds || ""),
        features: String(body.features || ""),
        price: String(body.price || ""),
      });
    case "viewing_followup":
      return genViewingFollowUp({
        clientName: String(body.clientName || ""),
        propertyLabel: String(body.propertyLabel || ""),
        agentName: String(body.agentName || ""),
      });
    case "buyer_qualifier":
      return genBuyerQualifier({ market: String(body.market || "") });
    case "sales_outreach":
      return genSalesOutreach({
        product: String(body.product || ""),
        audience: String(body.audience || ""),
        channel: String(body.channel || ""),
        pain: String(body.pain || ""),
      });
    case "proposal_outline":
      return genProposalOutline({
        client: String(body.client || ""),
        project: String(body.project || ""),
        outcome: String(body.outcome || ""),
      });
    case "objection_handlers":
      return genObjectionHandlers({ offer: String(body.offer || "") });
    default:
      return "Unknown mode.";
  }
}

export const MODE_META: Record<
  GenerateMode,
  { sector: SectorId; label: string; polishHint: string }
> = {
  lesson_plan: {
    sector: "education",
    label: "Lesson plan",
    polishHint: "Polish this lesson plan for clarity. Keep structure and timing table.",
  },
  study_plan: {
    sector: "education",
    label: "Study plan",
    polishHint: "Polish this study plan to be motivating and realistic.",
  },
  payment_reminder: {
    sector: "finance",
    label: "Payment reminder",
    polishHint: "Polish this payment reminder. Keep professional and concise.",
  },
  cashflow_checklist: {
    sector: "finance",
    label: "Cash-flow checklist",
    polishHint: "Polish this cash-flow checklist. Keep actionable checkboxes.",
  },
  pricing_note: {
    sector: "finance",
    label: "Pricing worksheet",
    polishHint: "Polish this pricing worksheet. Do not invent specific prices.",
  },
  business_plan: {
    sector: "sme",
    label: "Business plan outline",
    polishHint: "Polish this business plan outline. Keep section structure.",
  },
  elevator_pitch: {
    sector: "sme",
    label: "Elevator pitch",
    polishHint: "Polish this elevator pitch to sound natural and confident.",
  },
  swot: {
    sector: "sme",
    label: "SWOT worksheet",
    polishHint: "Polish this SWOT worksheet. Keep prompts practical.",
  },
  listing: {
    sector: "real_estate",
    label: "Listing description",
    polishHint: "Polish this property listing. Do not invent amenities not listed.",
  },
  viewing_followup: {
    sector: "real_estate",
    label: "Viewing follow-up",
    polishHint: "Polish this viewing follow-up message. Keep short and warm.",
  },
  buyer_qualifier: {
    sector: "real_estate",
    label: "Buyer qualifier",
    polishHint: "Polish these qualification questions for agents.",
  },
  sales_outreach: {
    sector: "sales",
    label: "Sales outreach scripts",
    polishHint: "Polish these outreach scripts. Keep them short for messaging apps.",
  },
  proposal_outline: {
    sector: "sales",
    label: "Proposal outline",
    polishHint: "Polish this proposal outline. Keep professional structure.",
  },
  objection_handlers: {
    sector: "sales",
    label: "Objection handlers",
    polishHint: "Polish these objection handlers. Keep practical and non-manipulative.",
  },
};
