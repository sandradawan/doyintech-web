/**
 * Lightweight in-memory rate limiter for serverless.
 * Note: resets per instance — still raises the bar vs unlimited abuse.
 * For production scale, swap to Upstash Redis / Vercel Firewall.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const MAX_KEYS = 5000;

function prune() {
  if (buckets.size < MAX_KEYS) return;
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (v.resetAt < now) buckets.delete(k);
  }
  if (buckets.size >= MAX_KEYS) {
    // drop oldest half
    const keys = [...buckets.keys()].slice(0, Math.floor(MAX_KEYS / 2));
    for (const k of keys) buckets.delete(k);
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; retryAfterSec: number } {
  prune();
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSec: Math.ceil(windowMs / 1000) };
  }
  if (b.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
    };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
}

export function clientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for") || "";
  const real = req.headers.get("x-real-ip") || "";
  const ip = xf.split(",")[0]?.trim() || real.trim() || "unknown";
  return ip.slice(0, 64);
}
