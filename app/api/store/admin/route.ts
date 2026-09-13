import { NextRequest, NextResponse } from "next/server";
import { listQueue, updateQueueStatus } from "@/lib/store/queue";
import type { ReviewStatus } from "@/lib/store/types";

function authorized(req: NextRequest): boolean {
  const key = process.env.STORE_ADMIN_KEY || "";
  if (!key) {
    // Dev fallback: allow read/update when key not set (lock down in production)
    return process.env.NODE_ENV !== "production";
  }
  const header = req.headers.get("x-store-admin-key") || "";
  const q = req.nextUrl.searchParams.get("key") || "";
  return header === key || q === key;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, submissions: listQueue() });
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const reviewStatus = String(body.reviewStatus || "") as ReviewStatus;
    const securityNotes = body.securityNotes
      ? String(body.securityNotes)
      : undefined;

    const allowed: ReviewStatus[] = [
      "in_review",
      "changes_requested",
      "approved",
      "rejected",
      "suspended",
    ];
    if (!id || !allowed.includes(reviewStatus)) {
      return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
    }

    const updated = updateQueueStatus(id, reviewStatus, securityNotes);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log(
      JSON.stringify({
        event: "store_review_action",
        id,
        reviewStatus,
        at: new Date().toISOString(),
      })
    );

    return NextResponse.json({ ok: true, submission: updated });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
