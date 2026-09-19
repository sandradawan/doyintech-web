import { NextRequest, NextResponse } from "next/server";
import { dbGetDeveloperByEmail, dbRegisterDeveloper } from "@/lib/store/membership";
import { clientIp, rateLimit } from "@/lib/rate-limit";

function adminEmails(): Set<string> {
  const raw = process.env.STORE_ADMIN_EMAILS || process.env.ADMIN_EMAILS || "";
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

function isAdminEmail(email: string): boolean {
  return adminEmails().has(email.toLowerCase().trim());
}

function adminKeyOk(key: string): boolean {
  const expected = process.env.STORE_ADMIN_KEY || "";
  return Boolean(expected && key && key === expected);
}

/** POST: login or register */
export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`store-auth:${ip}`, 30, 60 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
    }

    const body = await req.json();
    const action = String(body.action || "login");
    const email = String(body.email || "")
      .toLowerCase()
      .trim();
    const adminKey = String(body.adminKey || "").trim();

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    if (action === "register") {
      const result = await dbRegisterDeveloper({
        displayName: String(body.displayName || "").trim(),
        email,
        website: body.website ? String(body.website).trim() : undefined,
        phone: body.phone ? String(body.phone).trim() : undefined,
        companyName: body.companyName ? String(body.companyName).trim() : undefined,
        bio: body.bio ? String(body.bio).trim() : undefined,
        country: body.country ? String(body.country).trim() : "NG",
        agreedTerms: Boolean(body.agreedTerms),
      });
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        ok: true,
        role: "developer",
        developerId: result.id,
        membershipStatus: result.membershipStatus,
        message:
          result.membershipStatus === "pending"
            ? "Application received. An admin must approve your account before you can publish."
            : "Welcome back — your developer account is active.",
        session: {
          email,
          role: "developer" as const,
          displayName: String(body.displayName || email).trim(),
          developerId: result.id,
          membershipStatus: result.membershipStatus,
          loggedInAt: new Date().toISOString(),
        },
      });
    }

    if (isAdminEmail(email) || adminKeyOk(adminKey)) {
      return NextResponse.json({
        ok: true,
        role: "admin",
        message: "Admin signed in.",
        session: {
          email,
          role: "admin" as const,
          displayName: "Admin",
          loggedInAt: new Date().toISOString(),
        },
      });
    }

    const dev = await dbGetDeveloperByEmail(email);
    if (!dev) {
      return NextResponse.json(
        {
          error:
            "No developer account for this email. Register first — approval is required before publishing.",
        },
        { status: 404 }
      );
    }

    if (dev.membershipStatus === "rejected") {
      return NextResponse.json(
        { error: "This developer account was rejected. Contact support." },
        { status: 403 }
      );
    }
    if (dev.membershipStatus === "suspended") {
      return NextResponse.json(
        { error: "This account is suspended. Contact support." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      role: "developer",
      membershipStatus: dev.membershipStatus,
      message:
        dev.membershipStatus === "pending"
          ? "Signed in. Your account is pending admin approval — you can view the dashboard but cannot publish yet."
          : "Signed in.",
      session: {
        email: dev.email,
        role: "developer" as const,
        displayName: dev.displayName,
        developerId: dev.id,
        membershipStatus: dev.membershipStatus,
        loggedInAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Auth failed." }, { status: 500 });
  }
}
