/**
 * HMAC-signed session tokens (server-verified).
 * Prevents forging role/email in localStorage alone.
 */
import { createHmac, timingSafeEqual } from "crypto";
import type { StoreRole } from "./session";

export type TokenPayload = {
  email: string;
  role: StoreRole;
  displayName: string;
  developerId?: string;
  membershipStatus?: string;
  exp: number;
};

function secret(): string {
  return (
    process.env.STORE_SESSION_SECRET ||
    process.env.STORE_ADMIN_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "doyinstore-dev-only-change-me"
  );
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

export function createSessionToken(
  payload: Omit<TokenPayload, "exp">,
  ttlMs = 7 * 24 * 60 * 60 * 1000
): string {
  const full: TokenPayload = { ...payload, exp: Date.now() + ttlMs };
  const body = b64url(JSON.stringify(full));
  const sig = createHmac("sha256", secret()).update(body).digest();
  return `${body}.${b64url(sig)}`;
}

export function verifySessionToken(token: string | null | undefined): TokenPayload | null {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  try {
    const [body, sigB64] = token.split(".");
    if (!body || !sigB64) return null;
    const expected = createHmac("sha256", secret()).update(body).digest();
    const actual = fromB64url(sigB64);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      return null;
    }
    const payload = JSON.parse(fromB64url(body).toString("utf8")) as TokenPayload;
    if (!payload?.email || !payload?.role || !payload?.exp) return null;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
