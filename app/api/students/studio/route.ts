import { NextRequest, NextResponse } from "next/server";
import {
  generateAbstract,
  generateChapter,
  generateCoverLetter,
  generateOutline,
  formatCitation,
  maybePolishWithLlm,
  type ChapterInput,
  type CitationInput,
  type CoverLetterInput,
  type OutlineInput,
  type AbstractInput,
} from "@/lib/students/ai-studio";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`studio:${ip}`, 30, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const mode = String(body.mode || "").trim();
    const useLlm = Boolean(body.useLlm);

    let text = "";
    let meta: Record<string, string> = { mode };

    if (mode === "outline") {
      const input: OutlineInput = {
        topic: String(body.topic || ""),
        field: String(body.field || ""),
        level: body.level,
        methodology: String(body.methodology || ""),
        objectives: String(body.objectives || ""),
      };
      if (!input.topic.trim()) {
        return NextResponse.json({ error: "Topic is required" }, { status: 400 });
      }
      text = generateOutline(input);
      if (useLlm) {
        text = await maybePolishWithLlm(
          text,
          "Polish this research outline for academic clarity. Keep all section headings."
        );
      }
    } else if (mode === "chapter") {
      const input: ChapterInput = {
        topic: String(body.topic || ""),
        chapter: String(body.chapter || "1") as ChapterInput["chapter"],
        field: String(body.field || ""),
        notes: String(body.notes || ""),
      };
      if (!input.topic.trim()) {
        return NextResponse.json({ error: "Topic is required" }, { status: 400 });
      }
      if (!["1", "2", "3", "4", "5"].includes(input.chapter)) {
        return NextResponse.json({ error: "Chapter must be 1–5" }, { status: 400 });
      }
      text = generateChapter(input);
      if (useLlm) {
        text = await maybePolishWithLlm(
          text,
          `Expand and polish Chapter ${input.chapter} scaffold into clearer academic prose. Do not invent citations or data.`
        );
      }
    } else if (mode === "abstract") {
      const input: AbstractInput = {
        topic: String(body.topic || ""),
        field: String(body.field || ""),
        method: String(body.method || ""),
        keyFinding: String(body.keyFinding || ""),
      };
      if (!input.topic.trim()) {
        return NextResponse.json({ error: "Topic is required" }, { status: 400 });
      }
      text = generateAbstract(input);
      if (useLlm) {
        text = await maybePolishWithLlm(text, "Polish this academic abstract. Keep under 250 words.");
      }
    } else if (mode === "cover_letter") {
      const input: CoverLetterInput = {
        fullName: String(body.fullName || ""),
        role: String(body.role || ""),
        company: String(body.company || ""),
        experience: String(body.experience || ""),
        skills: String(body.skills || ""),
        tone: body.tone,
      };
      if (!input.role.trim() || !input.company.trim()) {
        return NextResponse.json(
          { error: "Role and company are required" },
          { status: 400 }
        );
      }
      text = generateCoverLetter(input);
      if (useLlm) {
        text = await maybePolishWithLlm(
          text,
          "Polish this cover letter to sound natural and specific. Keep under 250 words."
        );
      }
    } else if (mode === "citation") {
      const input: CitationInput = {
        style: (body.style || "apa") as CitationInput["style"],
        type: (body.type || "book") as CitationInput["type"],
        authors: String(body.authors || ""),
        title: String(body.title || ""),
        year: String(body.year || ""),
        publisher: String(body.publisher || ""),
        journal: String(body.journal || ""),
        volume: String(body.volume || ""),
        issue: String(body.issue || ""),
        pages: String(body.pages || ""),
        url: String(body.url || ""),
        accessed: String(body.accessed || ""),
        place: String(body.place || ""),
      };
      if (!input.authors.trim() || !input.title.trim()) {
        return NextResponse.json(
          { error: "Authors and title are required" },
          { status: 400 }
        );
      }
      text = formatCitation(input);
      meta.style = input.style;
      meta.type = input.type;
    } else {
      return NextResponse.json(
        {
          error:
            "Unknown mode. Use outline | chapter | abstract | cover_letter | citation",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      text,
      meta,
      llm: useLlm && Boolean(process.env.OPENAI_API_KEY),
    });
  } catch (e) {
    console.error("studio error", e);
    return NextResponse.json({ error: "Studio request failed" }, { status: 500 });
  }
}
