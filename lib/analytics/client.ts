"use client";

import type { ClientEvent } from "@/lib/analytics/events";

/** Fired on window for every tracked event, so UI (e.g. the tool email box) can react. */
export const TRACK_EVENT = "dt:track";

/** Sends a conversion event without delaying navigation (sendBeacon survives page unload). */
export function track(name: ClientEvent, label?: string) {
  try {
    window.dispatchEvent(new CustomEvent(TRACK_EVENT, { detail: { name, label } }));
    const body = JSON.stringify({ name, label: label?.slice(0, 120), path: window.location.pathname });
    if (navigator.sendBeacon?.("/api/track", new Blob([body], { type: "text/plain" }))) return;
    void fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } });
  } catch {
    /* tracking is best-effort */
  }
}
