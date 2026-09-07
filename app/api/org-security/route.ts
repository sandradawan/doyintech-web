import { NextRequest, NextResponse } from "next/server";
import tls from "tls";
import dns from "dns/promises";

export const runtime = "nodejs";
export const maxDuration = 30;

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  if (/^(10\.|127\.|192\.168\.|169\.254\.)/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  return false;
}

function normalizeHost(raw: string): { host: string; url: string } | null {
  try {
    const withProto = /^https?:\/\//i.test(raw.trim())
      ? raw.trim()
      : `https://${raw.trim()}`;
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (isPrivateHost(u.hostname)) return null;
    return { host: u.hostname, url: `https://${u.hostname}` };
  } catch {
    return null;
  }
}

async function fetchSafe(url: string, timeoutMs = 10000) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "DoyinTech-OrgSecurity/1.0",
        Accept: "text/html,*/*",
      },
    });
    clearTimeout(t);
    return res;
  } catch {
    return null;
  }
}

function checkTls(hostname: string): Promise<{
  ok: boolean;
  daysRemaining?: number;
  validTo?: string;
  issuer?: string;
  error?: string;
}> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false,
        timeout: 8000,
      },
      () => {
        try {
          const cert = socket.getPeerCertificate();
          const validTo = cert.valid_to ? new Date(cert.valid_to) : undefined;
          const daysRemaining = validTo
            ? Math.floor((validTo.getTime() - Date.now()) / 86400000)
            : undefined;
          socket.end();
          resolve({
            ok: daysRemaining !== undefined && daysRemaining > 0,
            daysRemaining,
            validTo: validTo?.toISOString(),
            issuer: cert.issuer
              ? Object.values(cert.issuer).join(", ")
              : undefined,
          });
        } catch (e) {
          socket.end();
          resolve({
            ok: false,
            error: e instanceof Error ? e.message : "TLS failed",
          });
        }
      },
    );
    socket.on("error", (err) => resolve({ ok: false, error: err.message }));
    socket.on("timeout", () => {
      socket.destroy();
      resolve({ ok: false, error: "TLS timeout" });
    });
  });
}

async function dnsTxt(name: string): Promise<string[]> {
  try {
    const records = await dns.resolveTxt(name);
    return records.map((r) => r.join(""));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = normalizeHost(String(body.domain || body.url || ""));
    if (!target) {
      return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
    }

    const signals: {
      id: string;
      level: "ok" | "warn" | "critical" | "info";
      title: string;
      detail: string;
    }[] = [];

    // Reachability
    const siteRes = await fetchSafe(target.url);
    const up = !!(siteRes && siteRes.status > 0 && siteRes.status < 500);
    const status = siteRes?.status ?? null;
    if (!siteRes) {
      signals.push({
        id: "down",
        level: "critical",
        title: "Site unreachable",
        detail: "Could not complete HTTPS request from scanner.",
      });
    } else if (status && status >= 500) {
      signals.push({
        id: "5xx",
        level: "critical",
        title: `Server error HTTP ${status}`,
        detail: "Origin returned a server error.",
      });
    } else if (status && status >= 400) {
      signals.push({
        id: "4xx",
        level: "warn",
        title: `HTTP ${status}`,
        detail: "Site responded with a client error status.",
      });
    } else {
      signals.push({
        id: "up",
        level: "ok",
        title: "Site reachable",
        detail: `HTTP ${status}`,
      });
    }

    // TLS
    const tlsInfo = await checkTls(target.host);
    if (tlsInfo.error) {
      signals.push({
        id: "tls-error",
        level: "critical",
        title: "TLS problem",
        detail: tlsInfo.error,
      });
    } else if (tlsInfo.daysRemaining !== undefined) {
      if (tlsInfo.daysRemaining < 0) {
        signals.push({
          id: "tls-expired",
          level: "critical",
          title: "Certificate expired",
          detail: `Expired ${Math.abs(tlsInfo.daysRemaining)} day(s) ago`,
        });
      } else if (tlsInfo.daysRemaining < 14) {
        signals.push({
          id: "tls-soon",
          level: "critical",
          title: "Certificate expires soon",
          detail: `${tlsInfo.daysRemaining} day(s) remaining`,
        });
      } else if (tlsInfo.daysRemaining < 30) {
        signals.push({
          id: "tls-warn",
          level: "warn",
          title: "Certificate expires within 30 days",
          detail: `${tlsInfo.daysRemaining} day(s) remaining`,
        });
      } else {
        signals.push({
          id: "tls-ok",
          level: "ok",
          title: "TLS certificate healthy",
          detail: `${tlsInfo.daysRemaining} day(s) remaining`,
        });
      }
    }

    // Headers score
    let headerScore = 0;
    const headersPresent: string[] = [];
    if (siteRes) {
      const h = siteRes.headers;
      const checks: [string, string][] = [
        ["strict-transport-security", "HSTS"],
        ["content-security-policy", "CSP"],
        ["x-frame-options", "XFO"],
        ["x-content-type-options", "nosniff"],
        ["referrer-policy", "Referrer-Policy"],
        ["permissions-policy", "Permissions-Policy"],
      ];
      for (const [key, label] of checks) {
        let val = h.get(key);
        if (key === "content-security-policy" && !val) {
          val = h.get("content-security-policy-report-only");
        }
        if (key === "x-frame-options" && !val) {
          const csp = h.get("content-security-policy") || "";
          if (/frame-ancestors/i.test(csp)) val = "csp";
        }
        if (val) {
          headerScore += Math.round(100 / checks.length);
          headersPresent.push(label);
        }
      }
      if (headerScore < 40) {
        signals.push({
          id: "headers-low",
          level: "warn",
          title: "Weak security headers",
          detail: `Score ~${headerScore}/100 · present: ${headersPresent.join(", ") || "none"}`,
        });
      } else if (headerScore < 70) {
        signals.push({
          id: "headers-mid",
          level: "info",
          title: "Partial security headers",
          detail: `Score ~${headerScore}/100`,
        });
      } else {
        signals.push({
          id: "headers-ok",
          level: "ok",
          title: "Security headers look solid",
          detail: `Score ~${headerScore}/100`,
        });
      }
    }

    // Email DNS: SPF + DMARC
    const spfRecords = await dnsTxt(target.host);
    const hasSpf = spfRecords.some((r) => /v=spf1/i.test(r));
    const dmarcRecords = await dnsTxt(`_dmarc.${target.host}`);
    const hasDmarc = dmarcRecords.some((r) => /v=dmarc1/i.test(r));

    if (!hasSpf) {
      signals.push({
        id: "spf-missing",
        level: "warn",
        title: "SPF not detected",
        detail: "No v=spf1 TXT record on domain — email spoofing risk.",
      });
    } else {
      signals.push({
        id: "spf-ok",
        level: "ok",
        title: "SPF present",
        detail: "SPF TXT record found",
      });
    }

    if (!hasDmarc) {
      signals.push({
        id: "dmarc-missing",
        level: "warn",
        title: "DMARC not detected",
        detail: "No _dmarc TXT record — add a DMARC policy.",
      });
    } else {
      signals.push({
        id: "dmarc-ok",
        level: "ok",
        title: "DMARC present",
        detail: dmarcRecords.find((r) => /v=dmarc1/i.test(r))?.slice(0, 120) || "OK",
      });
    }

    // Overall status
    let overall: "healthy" | "attention" | "critical" = "healthy";
    if (signals.some((s) => s.level === "critical")) overall = "critical";
    else if (signals.some((s) => s.level === "warn")) overall = "attention";

    return NextResponse.json({
      ok: true,
      domain: target.host,
      url: target.url,
      overall,
      up,
      httpStatus: status,
      tls: tlsInfo,
      headerScore,
      email: { spf: hasSpf, dmarc: hasDmarc },
      signals,
      checkedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Health check failed" }, { status: 500 });
  }
}
