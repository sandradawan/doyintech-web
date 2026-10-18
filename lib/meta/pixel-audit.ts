/**
 * Server-side Meta Pixel audit — static HTML scan only (no JS execution).
 * SSRF defenses: scheme, DNS, IP ranges, redirects, size, timeout.
 */

import dns from "node:dns/promises";
import { isIP } from "node:net";

export type AuditStatus =
  | "passed"
  | "needs_attention"
  | "warning"
  | "not_detected"
  | "unable_to_verify";

export type AuditCheck = {
  id: string;
  title: string;
  status: AuditStatus;
  detail: string;
};

export type PixelAuditReport = {
  url: string;
  finalUrl: string;
  auditedAt: string;
  https: boolean;
  pixelDetected: boolean;
  pixelIds: string[];
  eventsDetected: string[];
  checks: AuditCheck[];
  limitations: string[];
  recommendations: string[];
  score: number;
  scoreNote: string;
};

const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata",
]);

function isPrivateIp(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) {
    const parts = ip.split(".").map(Number);
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a >= 224) return true;
    return false;
  }
  if (v === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::1") return true;
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
  const host = u.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (BLOCKED_HOSTS.has(host) || host.endsWith(".localhost") || host.endsWith(".local")) {
    throw new Error("Local or reserved hostnames are not allowed");
  }
  if (isIP(host)) {
    if (isPrivateIp(host)) throw new Error("Private or loopback IP addresses are not allowed");
  } else {
    let records: string[] = [];
    try {
      const res = await dns.lookup(host, { all: true, verbatim: true });
      records = res.map((r) => r.address);
    } catch {
      throw new Error("Could not resolve the hostname");
    }
    if (!records.length) throw new Error("Could not resolve the hostname");
    for (const ip of records) {
      if (isPrivateIp(ip)) {
        throw new Error("Hostname resolves to a private or blocked network address");
      }
    }
  }
  return u;
}

async function fetchSafeHtml(start: URL): Promise<{ html: string; finalUrl: string; status: number }> {
  let current = start;
  const maxRedirects = 3;
  let lastStatus = 0;

  for (let i = 0; i <= maxRedirects; i++) {
    await assertSafeUrl(current.toString());

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(current.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "DoyinTechPixelAudit/1.0 (+https://www.doyintech.com/tools/pixel-audit)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
      lastStatus = res.status;

      if ([301, 302, 303, 307, 308].includes(res.status)) {
        const loc = res.headers.get("location");
        if (!loc) throw new Error("Redirect without Location header");
        current = new URL(loc, current);
        continue;
      }

      if (!res.ok) {
        throw new Error(`Website returned HTTP ${res.status}`);
      }

      const ctype = (res.headers.get("content-type") || "").toLowerCase();
      if (ctype && !ctype.includes("text/html") && !ctype.includes("application/xhtml")) {
        throw new Error("Response is not HTML");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Empty response body");
      const chunks: Uint8Array[] = [];
      let total = 0;
      const maxBytes = 500_000;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          total += value.length;
          if (total > maxBytes) {
            reader.cancel().catch(() => {});
            break;
          }
          chunks.push(value);
        }
      }
      const buf = Buffer.concat(chunks.map((c) => Buffer.from(c)));
      const html = buf.toString("utf8");
      return { html, finalUrl: current.toString(), status: lastStatus };
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("Too many redirects");
}

const EVENT_NAMES = [
  "PageView",
  "ViewContent",
  "Lead",
  "Contact",
  "CompleteRegistration",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
  "Search",
  "Subscribe",
];

export async function runPixelAudit(inputUrl: string): Promise<PixelAuditReport> {
  const start = await assertSafeUrl(inputUrl);
  const { html, finalUrl } = await fetchSafeHtml(start);
  const lower = html.toLowerCase();

  const checks: AuditCheck[] = [];
  const recommendations: string[] = [];
  const limitations = [
    "This audit inspects HTML only — it does not execute JavaScript.",
    "Tag managers, consent gates, and delayed loaders may hide a working Pixel.",
    "Detection is not proof that Meta Events Manager received events.",
    "Use Meta Pixel Helper and Events Manager Test Events for runtime verification.",
  ];

  const https = finalUrl.startsWith("https://");
  checks.push({
    id: "https",
    title: "HTTPS",
    status: https ? "passed" : "needs_attention",
    detail: https ? "Site is served over HTTPS." : "Site is not on HTTPS — tracking and trust are weaker.",
  });
  if (!https) recommendations.push("Enable HTTPS (TLS) for the whole site.");

  const hasFbq = /\bfbq\s*\(/.test(html) || lower.includes("fbq(");
  const hasFbevents = lower.includes("fbevents.js") || lower.includes("connect.facebook.net");
  const idMatches = [
    ...html.matchAll(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d{5,20})['"]/gi),
    ...html.matchAll(/facebook\.com\/tr\?id=(\d{5,20})/gi),
  ];
  const pixelIds = [...new Set(idMatches.map((m) => m[1]))];
  const pixelDetected = hasFbq || hasFbevents || pixelIds.length > 0;

  checks.push({
    id: "pixel_detect",
    title: "Meta Pixel detection",
    status: pixelDetected ? "passed" : "not_detected",
    detail: pixelDetected
      ? `Pixel-related code found${pixelIds.length ? ` (ID candidates: ${pixelIds.join(", ")})` : ""}.`
      : "No fbq / fbevents.js / Meta tr endpoint detected in HTML.",
  });
  if (!pixelDetected) {
    recommendations.push("Install Meta Pixel base code or load it via a consent-aware tag manager.");
  }

  checks.push({
    id: "pixel_id",
    title: "Pixel ID in source",
    status: pixelIds.length ? "passed" : pixelDetected ? "warning" : "not_detected",
    detail: pixelIds.length
      ? `Plausible Pixel ID(s) in markup: ${pixelIds.join(", ")}. Ownership not verified.`
      : "No clear numeric Pixel ID found in static HTML.",
  });

  const initCount = (html.match(/fbq\s*\(\s*['"]init['"]/gi) || []).length;
  const scriptCount = (html.match(/fbevents\.js/gi) || []).length;
  const dup = initCount > 1 || scriptCount > 1;
  checks.push({
    id: "duplicates",
    title: "Possible duplicate installation",
    status: dup ? "warning" : pixelDetected ? "passed" : "unable_to_verify",
    detail: dup
      ? `Multiple init (${initCount}) or fbevents.js references (${scriptCount}) — risk of double PageView.`
      : "No obvious duplicate base snippets in HTML.",
  });
  if (dup) recommendations.push("Keep a single Pixel init; remove plugin + manual doubles.");

  const hasPageView = /fbq\s*\(\s*['"]track['"]\s*,\s*['"]PageView['"]/i.test(html);
  checks.push({
    id: "pageview",
    title: "PageView in source",
    status: hasPageView ? "passed" : pixelDetected ? "warning" : "not_detected",
    detail: hasPageView
      ? "PageView track call found in HTML."
      : "No static PageView track found (may still fire from external JS).",
  });

  const eventsDetected: string[] = [];
  for (const ev of EVENT_NAMES) {
    const re = new RegExp(`fbq\\s*\\(\\s*['"]track['"]\\s*,\\s*['"]${ev}['"]`, "i");
    if (re.test(html)) eventsDetected.push(ev);
  }
  checks.push({
    id: "events",
    title: "Standard events in source",
    status: eventsDetected.length ? "passed" : pixelDetected ? "warning" : "not_detected",
    detail: eventsDetected.length
      ? `Detectable events: ${eventsDetected.join(", ")}.`
      : "No standard event track() calls found in static HTML.",
  });
  if (pixelDetected && eventsDetected.length <= 1) {
    recommendations.push("Add conversion events (Lead, Purchase, etc.) only where real success happens.");
  }

  const consentHints =
    /cookiebot|onetrust|cookieyes|complianz|cookie-consent|gdpr|consent\.mode|osano/i.test(html);
  checks.push({
    id: "consent",
    title: "Consent mechanism (technical)",
    status: consentHints ? "passed" : "warning",
    detail: consentHints
      ? "Possible consent/CMP markers found in HTML."
      : "No common consent manager markers found — ensure ads tags wait for consent where required.",
  });
  if (!consentHints) {
    recommendations.push("Load advertising pixels only after appropriate cookie consent.");
  }

  checks.push({
    id: "diagnostics",
    title: "Manual diagnostics",
    status: "unable_to_verify",
    detail:
      "Confirm in Meta Events Manager → Test Events, and with Meta Pixel Helper on a consented browser session.",
  });
  recommendations.push("Open Events Manager Test Events while browsing the live site.");
  recommendations.push(
    "Need help? Contact DoyinTech — WhatsApp +2348085343926 or doyintechnology@outlook.com"
  );

  let score = 0;
  if (https) score += 15;
  if (pixelDetected) score += 35;
  if (pixelIds.length) score += 15;
  if (hasPageView) score += 15;
  if (eventsDetected.length >= 2) score += 10;
  else if (eventsDetected.length === 1) score += 5;
  if (!dup) score += 5;
  if (consentHints) score += 5;
  score = Math.min(100, score);

  return {
    url: start.toString(),
    finalUrl,
    auditedAt: new Date().toISOString(),
    https,
    pixelDetected,
    pixelIds,
    eventsDetected,
    checks,
    limitations,
    recommendations: [...new Set(recommendations)],
    score,
    scoreNote: "DoyinTech technical score (0–100), not an official Meta score.",
  };
}
