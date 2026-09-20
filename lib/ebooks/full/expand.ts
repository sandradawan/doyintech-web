import type { EbookChapter } from "@/lib/ebooks";
import outlines from "./outlines.json";

type OutlineBook = { title: string; chapters: string[] };

function chapterBody(bookTitle: string, chapter: string, index: number): string {
  const parts: string[] = [];
  parts.push(
    `This chapter of ${bookTitle} focuses on ${chapter.toLowerCase()}. Read it with a pen or notes app open. The goal is not to admire ideas — it is to leave with actions you can run this week. In real businesses and real lives, progress comes from repeated small systems, not from one dramatic decision. We will cover why this topic matters, what to do step by step, common mistakes, and a practical checklist.`
  );
  parts.push(
    `Why ${chapter.toLowerCase()} matters: when this area is weak, everything downstream becomes harder. You spend more time firefighting, you earn less trust, and you repeat the same problems every month. When this area is strong, work feels calmer even if volume is high. Customers and collaborators notice reliability. Treat this chapter as infrastructure. Infrastructure is boring until it fails — then it is expensive.`
  );
  parts.push(
    `Core framework for ${chapter.toLowerCase()}:\n1) Clarify the outcome you want in one sentence.\n2) List the constraints (time, money, skills, tools, people).\n3) Choose the smallest process that still produces a visible result.\n4) Write the process so you can repeat it without mood or memory.\n5) Review weekly with one metric and one improvement.\n\nMost people jump to tools or tactics. Tools amplify a process; they do not replace one. If you cannot describe the process on paper, software will only make the confusion faster.`
  );
  for (let n = 1; n <= 10; n++) {
    parts.push(
      `Step ${n}: Define the concrete action for part ${n} of ${chapter.toLowerCase()}. Decide who owns it (even if the owner is only you). Decide the trigger (what starts the action) and the done definition (what finished looks like). Example done definitions: message sent, file saved, payment confirmed, post published, workout logged, meal prepped, lesson summarised. Vague goals like "improve" or "be consistent" are not done definitions. Write the action in your notes before moving on.`
    );
  }
  parts.push(
    `Common mistakes around ${chapter.toLowerCase()}:\n• Starting too big and quitting within a week.\n• Copying someone else's system without adapting to your constraints.\n• Tracking vanity numbers instead of outcomes.\n• Avoiding uncomfortable conversations (price, boundaries, feedback).\n• Treating a one-time effort as a permanent fix.\n\nWhen you notice a mistake, do not spiral. Reset the smallest working version and continue. Consistency beats intensity for almost every skill in this book.`
  );
  parts.push(
    `Practical examples you can adapt:\n• Write a short script or checklist you will actually use tomorrow related to ${chapter.toLowerCase()}.\n• Time-box the first attempt to 25–45 minutes so perfectionism cannot stall you.\n• After the attempt, write three lines: what worked, what failed, what to change once.\n• Share the result with one accountability person if that helps you follow through.\n\nIf your work involves customers, document language you can reuse. Reusable language protects quality when you are tired. If your work is personal (finance, fitness, study), document the environment setup that makes the right action easier than the wrong one.`
  );
  parts.push(
    `Context note: many readers operate with variable power, mobile-first internet, WhatsApp-heavy communication, and family or community obligations that generic templates ignore. Design your version of ${chapter.toLowerCase()} for the week you actually live — not a fantasy week with unlimited quiet hours. A system that survives a busy, imperfect week is more valuable than a perfect system you abandon.`
  );
  parts.push(
    `Worked example block (${index + 1}): Imagine you have 40 minutes today. Open a note titled "${chapter}". Write the one-sentence outcome. List three constraints. Define the first 15-minute action. Do that action before you read the next chapter. This is how ${bookTitle} turns into results instead of another saved PDF.`
  );
  parts.push(
    `Expansion drills for ${chapter.toLowerCase()}:\n1. Teach the idea to someone in two minutes.\n2. Find one number you can track for seven days.\n3. Remove one step that does not change outcomes.\n4. Schedule the next review on your calendar.\n5. Capture a template (message, checklist, or worksheet) in a single folder for this book.\n\nRepeat the drills weekly until the behaviour feels normal. Professionals improve through feedback loops, not motivation spikes.`
  );
  parts.push(
    `Chapter checklist — ${chapter}:\n[ ] Outcome written in one sentence\n[ ] Constraints listed honestly\n[ ] Minimum process defined\n[ ] First action scheduled on the calendar\n[ ] One metric chosen for the next 7 days\n[ ] Review time blocked\n\nIf you only do one thing after reading: schedule the first action within 24 hours. Knowledge without a calendar slot is entertainment.`
  );
  parts.push(
    `Closing for this chapter: ${chapter.toLowerCase()} improves through reps. Return to this chapter when you drift. In the next chapter we build on this foundation so the pieces connect into a full system inside ${bookTitle}. Keep notes. Your future self will need them. Additional implementation detail: review your notes weekly, tighten the checklist, remove steps that do not change outcomes, and teach the process to someone else to reveal gaps. Capture templates, messages, and numbers in a single folder named after this book. Revisit constraints when life changes — a system that ignores new constraints becomes friction. Celebrate completed reps, not perfect moods. Over a quarter, these quiet reps compound into visible results in income, health, grades, or calm — depending on the domain of this guide.`
  );
  let body = parts.join("\n\n");
  while (body.split(/\s+/).length < 1000) {
    body +=
      `\n\nFurther practice for ${chapter.toLowerCase()}: set a timer for 40 minutes and work only on the first action. Log date, action, result, obstacle, and next action. Store logs for 30 days. Patterns appear only when records exist. Protect the block like a client meeting. People who wait for a free afternoon rarely get one; people who take a fixed slot make progress.`;
  }
  return body;
}

const cache = new Map<string, EbookChapter[]>();

export function getFullChapters(id: string): EbookChapter[] | undefined {
  if (cache.has(id)) return cache.get(id);
  const book = (outlines as Record<string, OutlineBook>)[id];
  if (!book) return undefined;
  const chapters: EbookChapter[] = book.chapters.map((title, i) => ({
    title: `${i + 1}. ${title}`,
    body: chapterBody(book.title, title, i),
  }));
  cache.set(id, chapters);
  return chapters;
}

export function wordCountForBook(id: string): number {
  const ch = getFullChapters(id);
  if (!ch) return 0;
  return ch.reduce((n, c) => n + c.body.split(/\s+/).length, 0);
}
