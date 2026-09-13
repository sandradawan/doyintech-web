import { NextRequest, NextResponse } from "next/server";
import { addToQueue } from "@/lib/store/queue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const developerEmail = String(body.developerEmail || "").trim();
    const developerName = String(body.developerName || "").trim();
    const platform = String(body.platform || "");
    const kind = String(body.kind || "app");
    const packageType = String(body.packageType || "").toLowerCase();

    if (!title || !developerEmail.includes("@") || !developerName) {
      return NextResponse.json(
        { error: "Title, developer name, and valid email are required." },
        { status: 400 }
      );
    }

    if (platform === "android" && (packageType === "aab" || packageType === "abb")) {
      return NextResponse.json(
        {
          error:
            "AAB/ABB cannot be installed by users outside Play. Upload an APK build instead.",
        },
        { status: 400 }
      );
    }

    const row = addToQueue({
      title,
      shortDescription: String(body.shortDescription || "").slice(0, 160),
      description: String(body.description || ""),
      developerName,
      developerEmail,
      platform,
      kind,
      priceNgn: Math.max(0, Number(body.priceNgn) || 0),
      category: String(body.category || "Business"),
      version: String(body.version || "1.0.0"),
      packageType: packageType || undefined,
      fileName: body.fileName ? String(body.fileName) : undefined,
      privacyPolicyUrl: body.privacyPolicyUrl
        ? String(body.privacyPolicyUrl)
        : undefined,
    });

    console.log(
      JSON.stringify({
        event: "store_submission",
        id: row.id,
        title: row.title,
        developerEmail: row.developerEmail,
        at: row.createdAt,
      })
    );

    return NextResponse.json({
      ok: true,
      message:
        "Submission received. Pipeline: submitted → scanning → in_review → approved/rejected. You will be contacted at your developer email.",
      submissionId: row.id,
      reviewStatus: row.reviewStatus,
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
