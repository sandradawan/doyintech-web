/**
 * Scaffold generators for paid AI Studio tools.
 */
function clean(s: string, max = 500): string {
  return String(s || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function scaffoldSop(i: {
  businessName: string;
  processName: string;
  owner?: string;
  stepsHint?: string;
}): string {
  const biz = clean(i.businessName, 80) || "[Business]";
  const process = clean(i.processName, 120) || "[Process]";
  const owner = clean(i.owner || "Ops lead", 60);
  const hint = clean(i.stepsHint || "", 300);
  return [
    `# SOP — ${process}`,
    ``,
    `**Org:** ${biz} · **Owner:** ${owner}`,
    ``,
    `## Purpose`,
    `Repeatable execution of **${process}**.`,
    ``,
    `## Steps`,
    `1. Confirm trigger`,
    `2. Gather inputs`,
    `3. Execute ${process}`,
    `4. Log outcome`,
    `5. Notify handoff`,
    `6. Close`,
    hint ? `\n## Operator notes\n${hint}` : "",
    ``,
    `## Quality`,
    `- [ ] Details correct`,
    `- [ ] Timeline met`,
    ``,
    `---`,
    `*DoyinTech AI Studio*`,
  ]
    .filter((x) => x !== undefined)
    .join("\n");
}

export function scaffoldSocialCalendar(i: {
  businessName: string;
  niche: string;
  platforms?: string;
  weeks?: string;
}): string {
  const biz = clean(i.businessName, 80) || "[Business]";
  const niche = clean(i.niche, 120) || "services";
  const platforms = clean(i.platforms || "WhatsApp Status, Instagram", 120);
  const weeks = clean(i.weeks || "2", 8);
  return `# ${weeks}-week calendar — ${biz}\n\n**Niche:** ${niche}\n**Platforms:** ${platforms}\n\n| Day | Theme |\n| --- | --- |\n| Mon | Education tip |\n| Tue | Proof / result |\n| Wed | Offer |\n| Thu | FAQ |\n| Fri | Behind the scenes |\n| Sat | Soft CTA |\n| Sun | Community / value |\n\n## Caption formula\nProblem → tip → CTA (reply YES)\n\n---\n*DoyinTech AI Studio*`;
}

export function scaffoldProductCopy(i: {
  productName: string;
  audience: string;
  benefits?: string;
  priceHint?: string;
}): string {
  const p = clean(i.productName, 100) || "[Product]";
  const a = clean(i.audience, 100) || "[Audience]";
  const b = clean(i.benefits || "clear results", 200);
  const price = clean(i.priceHint || "", 40);
  return `# Copy pack — ${p}\n\n**Audience:** ${a}${price ? `\n**Price:** ${price}` : ""}\n\n## Short\n${p} helps ${a} get ${b}.\n\n## Bullets\n- ${b}\n- Built for ${a}\n- Clear next step after payment\n\n## WhatsApp\nHi — ${p} is for ${a}. Reply YES for details.\n\n## Ad\n${p} for ${a}: ${b}. Message us to start.\n\n---\n*DoyinTech AI Studio*`;
}

export function scaffoldJobDescription(i: {
  roleTitle: string;
  company: string;
  location?: string;
  mustHaves?: string;
}): string {
  const role = clean(i.roleTitle, 100) || "[Role]";
  const company = clean(i.company, 80) || "[Company]";
  const loc = clean(i.location || "Lagos / Hybrid", 80);
  const must = clean(i.mustHaves || "relevant experience", 200);
  return `# JD — ${role}\n\n**Company:** ${company} · **Location:** ${loc}\n\n## About\nWe need a ${role} to deliver reliable work at ${company}.\n\n## Responsibilities\n- Own day-to-day execution\n- Communicate blockers early\n- Follow quality checks\n\n## Requirements\n- ${must}\n- Clear written updates\n\n## Apply\nCV + 5-line note on a result you delivered.\n\n---\n*DoyinTech AI Studio*`;
}

export function scaffoldMeetingActions(i: {
  meetingTitle: string;
  notes: string;
  attendees?: string;
}): string {
  const title = clean(i.meetingTitle, 120) || "Meeting";
  const notes = clean(i.notes, 2000) || "(notes)";
  const att = clean(i.attendees || "Team", 120);
  return `# Summary — ${title}\n\n**Attendees:** ${att}\n\n## Notes\n${notes}\n\n## Decisions\n- [Confirm from discussion]\n\n## Actions\n| Owner | Action | Due |\n| --- | --- | --- |\n| TBD | Next step from notes | This week |\n\n---\n*DoyinTech AI Studio*`;
}

export function scaffoldFaqPack(i: {
  businessName: string;
  productOrService: string;
  objections?: string;
}): string {
  const biz = clean(i.businessName, 80) || "[Business]";
  const offer = clean(i.productOrService, 120) || "[Offer]";
  const obj = clean(i.objections || "price, timeline", 200);
  return `# FAQ — ${biz}\n\n**Offer:** ${offer}\n**Friction:** ${obj}\n\n**Q: What do I get?**\nA: Clear scope for ${offer} with timeline before deposit.\n\n**Q: How long?**\nA: Confirmed after brief; dates before payment.\n\n**Q: Payments?**\nA: Deposit to start, balance on milestone/delivery.\n\n## Objections\n- Too expensive → smaller starter scope\n- Need to think → one-pager + decision date\n\n---\n*DoyinTech AI Studio*`;
}

export function scaffoldContentRepurpose(i: { sourceText: string; brand?: string }): string {
  const source = clean(i.sourceText, 2500) || "(source)";
  const brand = clean(i.brand || "brand", 60);
  return `# Repurpose — ${brand}\n\n## Source\n${source.slice(0, 500)}${source.length > 500 ? "…" : ""}\n\n## LinkedIn\nKey takeaway: [point]. Why it matters for operators…\n\n## Status (3)\n1 Hook · 2 Tip · 3 CTA\n\n## Email\nSubject: Quick insight\nBody: One useful idea — [point]. Reply for the checklist.\n\n---\n*DoyinTech AI Studio*`;
}

export type StudioMode =
  | "sop"
  | "social_calendar"
  | "product_copy"
  | "job_desc"
  | "meeting_actions"
  | "faq_pack"
  | "content_repurpose"
  | "business_copy";

export function runStudioScaffold(mode: StudioMode, body: Record<string, unknown>): string {
  switch (mode) {
    case "sop":
      return scaffoldSop({
        businessName: String(body.businessName || ""),
        processName: String(body.processName || body.topic || ""),
        owner: String(body.owner || ""),
        stepsHint: String(body.stepsHint || body.notes || ""),
      });
    case "social_calendar":
      return scaffoldSocialCalendar({
        businessName: String(body.businessName || ""),
        niche: String(body.niche || body.topic || ""),
        platforms: String(body.platforms || ""),
        weeks: String(body.weeks || ""),
      });
    case "product_copy":
    case "business_copy":
      return scaffoldProductCopy({
        productName: String(body.productName || body.topic || ""),
        audience: String(body.audience || ""),
        benefits: String(body.benefits || ""),
        priceHint: String(body.priceHint || ""),
      });
    case "job_desc":
      return scaffoldJobDescription({
        roleTitle: String(body.roleTitle || body.topic || ""),
        company: String(body.company || body.businessName || ""),
        location: String(body.location || ""),
        mustHaves: String(body.mustHaves || body.notes || ""),
      });
    case "meeting_actions":
      return scaffoldMeetingActions({
        meetingTitle: String(body.meetingTitle || body.topic || ""),
        notes: String(body.notes || ""),
        attendees: String(body.attendees || ""),
      });
    case "faq_pack":
      return scaffoldFaqPack({
        businessName: String(body.businessName || ""),
        productOrService: String(body.productOrService || body.topic || ""),
        objections: String(body.objections || body.notes || ""),
      });
    case "content_repurpose":
      return scaffoldContentRepurpose({
        sourceText: String(body.sourceText || body.notes || ""),
        brand: String(body.brand || body.businessName || ""),
      });
    default:
      return "Unknown studio mode.";
  }
}

export const STUDIO_META: Record<
  StudioMode,
  { label: string; system: string; polishHint: string }
> = {
  sop: {
    label: "SOP / process document",
    system: "You write practical SOPs for African SMEs. Clear headings, checklists, no invented legal claims.",
    polishHint: "Expand into a complete usable SOP in markdown.",
  },
  social_calendar: {
    label: "Social content calendar",
    system: "You plan realistic social calendars for small businesses. No fake metrics.",
    polishHint: "Produce a concrete calendar with captions.",
  },
  product_copy: {
    label: "Product / service copy",
    system: "You write conversion copy. No invented testimonials or statistics.",
    polishHint: "Full copy pack: short desc, bullets, WhatsApp, ads, headlines.",
  },
  job_desc: {
    label: "Job description",
    system: "You write clear SME job descriptions. Practical, not corporate fluff.",
    polishHint: "Complete JD ready to post.",
  },
  meeting_actions: {
    label: "Meeting notes → actions",
    system: "Turn messy notes into decisions and actions. Never invent commitments.",
    polishHint: "Extract decisions and action table.",
  },
  faq_pack: {
    label: "FAQ & objections",
    system: "FAQ and objection packs for service businesses. Honest tone.",
    polishHint: "Expand FAQs and objection handlers.",
  },
  content_repurpose: {
    label: "Content repurposing",
    system: "Repurpose long content into posts, Status, email, scripts. Stay faithful to source.",
    polishHint: "Multi-channel pack from the source.",
  },
  business_copy: {
    label: "Business copy suite",
    system: "Ads, WhatsApp, and email copy for SMEs. Clear CTAs, no hype numbers.",
    polishHint: "Produce ads, WhatsApp, and email variants.",
  },
};
