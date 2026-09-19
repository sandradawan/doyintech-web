import { NextRequest, NextResponse } from "next/server";
import { addToQueue } from "@/lib/store/queue";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`store-submit:${ip}`, 8, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many submissions. Try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
      );
    }

    const body = await req.json();
    const title = String(body.title || "").trim().slice(0, 120);
    const developerEmail = String(body.developerEmail || "").trim().slice(0, 200);
    const developerName = String(body.developerName || "").trim().slice(0, 120);
    const platform = String(body.platform || "").slice(0, 40);
    const kind = String(body.kind || "app").slice(0, 40);
    const packageType = String(body.packageType || "").toLowerCase().slice(0, 20);

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
      description: String(body.description || "").slice(0, 5000),
      developerName,
      developerEmail,
      platform,
      kind,
      priceNgn: Math.max(0, Math.min(Number(body.priceNgn) || 0, 50_000_000)),
      category: String(body.category || "Business").slice(0, 60),
      version: String(body.version || "1.0.0").slice(0, 40),
      packageType: packageType || undefined,
      fileName: body.fileName ? String(body.fileName).slice(0, 120) : undefined,
      privacyPolicyUrl: body.privacyPolicyUrl
        ? String(body.privacyPolicyUrl).slice(0, 300)
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
