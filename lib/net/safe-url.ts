/**
 * SSRF defenses for any server-side fetch of a user-supplied URL:
 * scheme + credential checks, DNS resolution against private ranges, and
 * manual redirects re-validated on every hop.
 */
import dns from "node:dns/promises";
import { isIP } from "node:net";

const BLOCKED_HOSTS = new Set(["localhost", "metadata.google.internal", "metadata"]);

export function isPrivateIp(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a >= 224) return true;
    return false;
  }
  if (v === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
    if (lower.startsWith("fe80")) return true;
    if (lower.startsWith("::ffff:")) {
      const mapped = lower.slice(7);
      if (isIP(mapped) === 4) return isPrivateIp(mapped);
    }
    return false;
  }
  return true;
}

/** Hostname-only check (for TLS/DNS probes that don't go through fetch). */
export async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (BLOCKED_HOSTS.has(host) || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error("Local or reserved hostnames are not allowed");
  }
  if (isIP(host)) {
    if (isPrivateIp(host)) throw new Error("Private or loopback IP addresses are not allowed");
    return;
  }
  let records: string[] = [];
  try {
    const res = await dns.lookup(host, { all: true, verbatim: true });
    records = res.map((r) => r.address);
  } catch {
    throw new Error("Could not resolve the hostname");
  }
  if (!records.length) throw new Error("Could not resolve the hostname");
  if (records.some(isPrivateIp)) {
    throw new Error("Hostname resolves to a private or blocked network address");
  }
}

export async function assertSafeUrl(raw: string): Promise<URL> {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new Error("Invalid URL. Use a full address like https://example.com");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http and https URLs are allowed");
  }
  if (u.username || u.password) {
    throw new Error("URLs with credentials are not allowed");
  }
  if (u.port && !["80", "443", "8080", "8443"].includes(u.port)) {
    throw new Error("Only standard web ports are allowed");
  }
  await assertPublicHost(u.hostname);
  return u;
}

export type SafeFetchResult = {
  res: Response;
  finalUrl: string;
  chain: { url: string; status: number }[];
};

/**
 * fetch() for untrusted URLs. Every hop (including redirects) is validated, so a public
 * page can't bounce the server to 169.254.169.254 or an internal host.
 */
export async function safeFetch(
  rawUrl: string,
  init: RequestInit & { timeoutMs?: number } = {},
  maxRedirects = 5
): Promise<SafeFetchResult> {
  const { timeoutMs = 10_000, ...rest } = init;
  const chain: { url: string; status: number }[] = [];
  let current = (await assertSafeUrl(rawUrl)).toString();

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const res = await fetch(current, {
      ...rest,
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });
    chain.push({ url: current, status: res.status });

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      // Out of hops (or maxRedirects=0): hand the redirect response back to the caller.
      if (!loc || hop === maxRedirects) return { res, finalUrl: current, chain };
      current = (await assertSafeUrl(new URL(loc, current).toString())).toString();
      continue;
    }
    return { res, finalUrl: current, chain };
  }
  throw new Error("Too many redirects");
}
