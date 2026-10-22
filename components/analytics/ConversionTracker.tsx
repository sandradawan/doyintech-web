"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/client";
import { ATTR_COOKIE, MONEY_PATHS, type ClientEvent } from "@/lib/analytics/events";

/** Seller shops and admin pages aren't our funnel; their clicks would skew the numbers. */
function ignored(path: string) {
  return path.startsWith("/s/") || path.startsWith("/admin");
}

function hasAnalyticsConsent() {
  try {
    const v = localStorage.getItem("cookie-consent");
    return v === "all" || v === "true";
  } catch {
    return false;
  }
}

/** First-party attribution cookie (random session id + where the visitor came from). Consent only. */
function saveAttribution() {
  if (!hasAnalyticsConsent()) return;
  const params = new URLSearchParams(window.location.search);
  const existing = document.cookie.split("; ").some((c) => c.startsWith(`${ATTR_COOKIE}=`));
  const src = params.get("utm_source");
  if (existing && !src) return; // keep first touch unless a new campaign brought them back
  let ref = "";
  try {
    const host = document.referrer ? new URL(document.referrer).host : "";
    ref = host && host !== window.location.host ? host : "";
  } catch {
    /* ignore */
  }
  const value = {
    sid: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    src: src || (ref ? ref : "direct"),
    med: params.get("utm_medium") || (ref ? "referral" : ""),
    cmp: params.get("utm_campaign") || "",
    ref,
  };
  document.cookie = `${ATTR_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${60 * 60 * 24 * 90}; SameSite=Lax; Secure`;
}

function classify(a: HTMLAnchorElement): { name: ClientEvent; label: string } | null {
  const href = a.getAttribute("href") || "";
  if (/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(href)) return { name: "whatsapp_click", label: a.textContent?.trim().slice(0, 60) || "WhatsApp" };
  if (href.startsWith("tel:")) return { name: "phone_click", label: href.slice(4) };
  if (href.startsWith("mailto:")) return { name: "email_click", label: href.slice(7).split("?")[0] };
  try {
    const url = new URL(href, window.location.href);
    if (url.host === window.location.host && MONEY_PATHS.some((p) => url.pathname === p || url.pathname.startsWith(p + "/"))) {
      if (url.pathname !== window.location.pathname) return { name: "cta_click", label: url.pathname };
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Site-wide: records WhatsApp/phone/email clicks, clicks towards money pages, and [data-track] elements. */
export default function ConversionTracker() {
  useEffect(() => {
    saveAttribution();
    const onConsent = () => saveAttribution();
    window.addEventListener("cookie-accepted", onConsent);

    const onClick = (e: MouseEvent) => {
      if (ignored(window.location.pathname)) return;
      const el = (e.target as Element | null)?.closest?.("a, [data-track]");
      if (!el) return;
      const custom = el.getAttribute("data-track") as ClientEvent | null;
      if (custom) {
        track(custom, el.getAttribute("data-track-label") || undefined);
        return;
      }
      if (el instanceof HTMLAnchorElement) {
        const hit = classify(el);
        if (hit) track(hit.name, hit.label);
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      window.removeEventListener("cookie-accepted", onConsent);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
