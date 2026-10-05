import { NextRequest, NextResponse } from "next/server";
import { analyzeQuestionnaireCsv } from "@/lib/students/analyzer";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`student-analyzer:${ip}`, 15, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many analyses. Try again later." },
        { status: 429 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let csvText = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (file && typeof file === "object" && "text" in file) {
        const f = file as File;
        if (f.size > 3_000_000) {
          return NextResponse.json(
            { error: "File too large (max 3MB)." },
            { status: 400 }
          );
        }
        csvText = await f.text();
      }
    } else {
      const body = await req.json();
      csvText = String(body.csv || body.text || "");
    }

    if (!csvText || csvText.trim().length < 10) {
      return NextResponse.json(
        { error: "Upload a CSV file or paste CSV text." },
        { status: 400 }
      );
    }

    const result = analyzeQuestionnaireCsv(csvText);
    return NextResponse.json({ ok: true, result });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Analysis failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
