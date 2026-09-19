import { NextRequest, NextResponse } from "next/server";
import { dbListDevelopers, dbSetDeveloperStatus } from "@/lib/store/membership";

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
  const developers = await dbListDevelopers();
  return NextResponse.json({ ok: true, developers });
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    const status = String(body.status || "") as
      | "pending"
      | "active"
      | "suspended"
      | "rejected";
    const allowed = ["pending", "active", "suspended", "rejected"];
    if (!id || !allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
    }
    const ok = await dbSetDeveloperStatus(id, status, body.reason ? String(body.reason) : undefined);
    if (!ok) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id, status });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
