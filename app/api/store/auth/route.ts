import { NextRequest, NextResponse } from "next/server";
import {
  dbGetDeveloperByEmail,
  dbRegisterDeveloper,
} from "@/lib/store/membership";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Unified store auth:
 * - action=register → developer application (pending until admin approves)
 * - action=login → admin (email + STORE_ADMIN_KEY) or developer by email
 */
export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`store-auth:${ip}`, 20, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const action = String(body.action || "login").toLowerCase();
    const email = String(body.email || "")
      .toLowerCase()
      .trim();

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    // ── Register developer ──────────────────────────────────
    if (action === "register") {
      const result = await dbRegisterDeveloper({
        displayName: String(body.displayName || "").trim(),
        email,
        phone: body.phone ? String(body.phone).trim() : undefined,
        website: body.website ? String(body.website).trim() : undefined,
        bio: body.bio ? String(body.bio).trim() : undefined,
        companyName: body.companyName ? String(body.companyName).trim() : undefined,
        country: body.country ? String(body.country).trim() : "NG",
        agreedTerms: Boolean(body.agreedTerms),
      });

      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      const session = {
        email,
        role: "developer" as const,
        displayName: String(body.displayName || "").trim() || email,
        developerId: result.id,
        membershipStatus: result.membershipStatus,
        loggedInAt: new Date().toISOString(),
      };

      return NextResponse.json({
        ok: true,
        role: "developer",
        session,
        message:
          result.membershipStatus === "pending"
            ? "Application received. An admin will review your account before you can publish."
            : "Developer account ready.",
      });
    }

    // ── Login ─────────────────────────────────────────────────
    const adminKey = String(body.adminKey || "").trim();
    const storeAdminKey = process.env.STORE_ADMIN_KEY || "";
    const adminEmails = (process.env.STORE_ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
      .toLowerCase()
      .split(/[,\s]+/)
      .filter(Boolean);

    // Admin path: correct key (and optional email allow-list)
    if (adminKey && storeAdminKey && adminKey === storeAdminKey) {
      if (adminEmails.length && !adminEmails.includes(email)) {
        return NextResponse.json(
          { error: "This email is not authorized for admin access." },
          { status: 403 }
        );
      }
      const session = {
        email,
        role: "admin" as const,
        displayName: "Admin",
        loggedInAt: new Date().toISOString(),
      };
      return NextResponse.json({
        ok: true,
        role: "admin",
        session,
        message: "Signed in as admin.",
      });
    }

    // Developer path
    const dev = await dbGetDeveloperByEmail(email);
    if (!dev) {
      return NextResponse.json(
        {
          error:
            "No developer account found for this email. Register first, or use Admin access if you are staff.",
        },
        { status: 404 }
      );
    }

    if (dev.membershipStatus === "rejected" || dev.membershipStatus === "suspended") {
      return NextResponse.json(
        {
          error: `Account is ${dev.membershipStatus}. Contact support if this is a mistake.`,
        },
        { status: 403 }
      );
    }

    const session = {
      email: dev.email,
      role: "developer" as const,
      displayName: dev.displayName,
      developerId: dev.id,
      membershipStatus: dev.membershipStatus,
      loggedInAt: new Date().toISOString(),
    };

    return NextResponse.json({
      ok: true,
      role: "developer",
      session,
      message:
        dev.membershipStatus === "pending"
          ? "Signed in. Your account is still pending admin approval."
          : "Signed in.",
    });
  } catch (e) {
    console.error("store auth", e);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
