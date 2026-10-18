import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminEmails } from "@/lib/admin/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json(
      { ok: false, error: auth.error || "Unauthorized" },
      { status: 401 }
    );
  }
  return NextResponse.json({
    ok: true,
    email: auth.email || null,
    via: auth.via,
    allowlistConfigured: getAdminEmails().length > 0,
  });
}
