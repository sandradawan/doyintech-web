import { NextRequest, NextResponse } from "next/server";
import {
  dbGetDeveloperByEmail,
  dbRegisterDeveloper,
} from "@/lib/store/membership";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  hashPassword,
  validatePasswordPolicy,
  verifyPassword,
  safeEqual,
} from "@/lib/store/password";
import { createSessionToken } from "@/lib/store/session-token";

/**
 * Secure store auth
 * - Register: email + strong password (scrypt hash in DB)
 * - Login: email + password; admin uses STORE_ADMIN_KEY as password
 * - Generic error messages (no user enumeration)
 * - Rate limited per IP and per email
 * - HMAC-signed session tokens
 */
export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const rlIp = rateLimit(`store-auth-ip:${ip}`, 15, 15 * 60 * 1000);
    if (!rlIp.ok) {
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
    const password = String(body.password || "");

    if (!email.includes("@") || email.length > 200) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const rlEmail = rateLimit(`store-auth-email:${email}`, 10, 15 * 60 * 1000);
    if (!rlEmail.ok) {
      return NextResponse.json(
        { error: "Too many attempts for this account. Try again later." },
        { status: 429 }
      );
    }

    if (action === "register") {
      const policyErr = validatePasswordPolicy(password);
      if (policyErr) {
        return NextResponse.json({ error: policyErr }, { status: 400 });
      }
      if (password.toLowerCase().includes(email.split("@")[0])) {
        return NextResponse.json(
          { error: "Password must not contain your email name." },
          { status: 400 }
        );
      }

      const passwordHash = hashPassword(password);
      const result = await dbRegisterDeveloper({
        displayName: String(body.displayName || "").trim(),
        email,
        passwordHash,
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

      const token = createSessionToken({
        email,
        role: "developer",
        displayName: String(body.displayName || "").trim() || email,
        developerId: result.id,
        membershipStatus: result.membershipStatus,
      });

      const session = {
        email,
        role: "developer" as const,
        displayName: String(body.displayName || "").trim() || email,
        developerId: result.id,
        membershipStatus: result.membershipStatus,
        loggedInAt: new Date().toISOString(),
        token,
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

    if (!password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const storeAdminKey = process.env.STORE_ADMIN_KEY || "";
    const adminEmails = (process.env.STORE_ADMIN_EMAILS || process.env.ADMIN_EMAIL || "")
      .toLowerCase()
      .split(/[,\s]+/)
      .filter(Boolean);

    if (storeAdminKey && safeEqual(password, storeAdminKey)) {
      if (adminEmails.length && !adminEmails.includes(email)) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }
      const token = createSessionToken({
        email,
        role: "admin",
        displayName: "Admin",
      });
      return NextResponse.json({
        ok: true,
        role: "admin",
        session: {
          email,
          role: "admin",
          displayName: "Admin",
          loggedInAt: new Date().toISOString(),
          token,
        },
        message: "Signed in as admin.",
      });
    }

    const dev = await dbGetDeveloperByEmail(email);
    if (!dev || !dev.passwordHash) {
      hashPassword("dummy-timing-pad-" + email);
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (!verifyPassword(password, dev.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
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

    const token = createSessionToken({
      email: dev.email,
      role: "developer",
      displayName: dev.displayName,
      developerId: dev.id,
      membershipStatus: dev.membershipStatus,
    });

    return NextResponse.json({
      ok: true,
      role: "developer",
      session: {
        email: dev.email,
        role: "developer",
        displayName: dev.displayName,
        developerId: dev.id,
        membershipStatus: dev.membershipStatus,
        loggedInAt: new Date().toISOString(),
        token,
      },
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
