import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const developerEmail = String(body.developerEmail || "").trim();
    const developerName = String(body.developerName || "").trim();
    const platform = String(body.platform || "");
    const kind = String(body.kind || "app");

    if (!title || !developerEmail.includes("@") || !developerName) {
      return NextResponse.json(
        { error: "Title, developer name, and valid email are required." },
        { status: 400 }
      );
    }

    if (platform === "android" && body.packageType === "aab") {
      return NextResponse.json(
        {
          error:
            "AAB cannot be installed by users outside Play. Upload an APK build instead.",
        },
        { status: 400 }
      );
    }

    const submission = {
      id: `sub_${Date.now()}`,
      ...body,
      title,
      developerEmail,
      developerName,
      kind,
      platform,
      reviewStatus: "submitted",
      virusScanStatus: "pending",
      pipeline: ["submitted", "scanning", "in_review"],
      at: new Date().toISOString(),
    };

    // Persist later in Supabase; for now structured log + notify path
    console.log(JSON.stringify({ event: "store_submission", submission }));

    return NextResponse.json({
      ok: true,
      message:
        "Submission received. It enters security scan → human review before any public listing. You will be contacted at your developer email.",
      submissionId: submission.id,
      nextSteps: [
        "Automated package checks",
        "Malware scan queue",
        "Human QA on test device",
        "Approved listings appear on /store",
      ],
    });
  } catch {
    return NextResponse.json({ error: "Submission failed." }, { status: 500 });
  }
}
