import { NextRequest, NextResponse } from "next/server";
import { listQueue, updateQueueStatus } from "@/lib/store/queue";
import { dbListQueue, dbUpdateStatus } from "@/lib/store/db";
import type { ReviewStatus } from "@/lib/store/types";

function authorized(req: NextRequest): boolean {
  const key = process.env.STORE_ADMIN_KEY || "";
  if (!key) return false;
  const header = req.headers.get("x-store-admin-key") || "";
  return header === key;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fromDb = await dbListQueue();
  const submissions = fromDb ?? listQueue();

  return NextResponse.json({
    ok: true,
    submissions,
    source: fromDb ? "supabase" : "memory",
  });
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
      ? String(body.securityNotes).slice(0, 2000)
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

    const updated =
      (await dbUpdateStatus(id, reviewStatus, securityNotes)) ||
      updateQueueStatus(id, reviewStatus, securityNotes);

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
