import { createHash, randomBytes } from "crypto";

export type DownloadGrant = {
  token: string;
  slug: string;
  email: string;
  expiresAt: number; // unix ms
};

const g = globalThis as unknown as { __doyinDownloadGrants?: Map<string, DownloadGrant> };
if (!g.__doyinDownloadGrants) g.__doyinDownloadGrants = new Map();

export function issueDownloadToken(slug: string, email: string, ttlMinutes = 60): string {
  const token = randomBytes(24).toString("hex");
  const grant: DownloadGrant = {
    token,
    slug,
    email,
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
  };
  g.__doyinDownloadGrants!.set(token, grant);
  return token;
}

export function verifyDownloadToken(
  token: string,
  slug: string
): { ok: true; grant: DownloadGrant } | { ok: false; error: string } {
  const grant = g.__doyinDownloadGrants!.get(token);
  if (!grant) return { ok: false, error: "Invalid or expired token" };
  if (grant.slug !== slug) return { ok: false, error: "Token mismatch" };
  if (Date.now() > grant.expiresAt) {
    g.__doyinDownloadGrants!.delete(token);
    return { ok: false, error: "Token expired" };
  }
  return { ok: true, grant };
}

export function fingerprintEmail(email: string): string {
  return createHash("sha256").update(email.toLowerCase().trim()).digest("hex").slice(0, 16);
}
