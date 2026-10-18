"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getMetaPixelId,
  hasAnalyticsConsent,
  isMetaPixelConfigured,
  trackPageView,
} from "@/lib/meta/pixel";

/**
 * Loads Meta Pixel once after analytics consent.
 * Handles App Router path changes without duplicate PageViews for the same path.
 * Missing Pixel ID → silent no-op.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const booted = useRef(false);

  useEffect(() => {
    function boot() {
      if (!isMetaPixelConfigured()) return;
      if (!hasAnalyticsConsent()) return;
      if (typeof window === "undefined") return;
      if (window.__doyinMetaPixelInit) {
        booted.current = true;
        return;
      }

      const pixelId = getMetaPixelId();
      if (!pixelId) return;

      try {
        const w = window as Window & { fbq?: (...args: unknown[]) => void; _fbq?: unknown };
        if (!w.fbq) {
          const n = function (...args: unknown[]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fn = n as any;
            (fn.queue = fn.queue || []).push(args);
          } as unknown as typeof w.fbq;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (n as any).queue = [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (n as any).loaded = true;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (n as any).version = "2.0";
          w.fbq = n;
          if (!w._fbq) w._fbq = n;
        }

        const existing = document.querySelector('script[data-doyin-meta-pixel="1"]');
        if (!existing) {
          const script = document.createElement("script");
          script.async = true;
          script.src = "https://connect.facebook.net/en_US/fbevents.js";
          script.dataset.doyinMetaPixel = "1";
          const first = document.getElementsByTagName("script")[0];
          first?.parentNode?.insertBefore(script, first);
        }

        w.fbq?.("init", pixelId);
        window.__doyinMetaPixelInit = true;
        booted.current = true;

        const path =
          pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
        trackPageView(path || "/");
      } catch {
        /* ignore */
      }
    }

    boot();

    const onConsent = () => boot();
    window.addEventListener("cookie-accepted", onConsent);
    return () => window.removeEventListener("cookie-accepted", onConsent);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!booted.current && !window.__doyinMetaPixelInit) return;
    if (!hasAnalyticsConsent()) return;
    const path =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(path || "/");
  }, [pathname, searchParams]);

  return null;
}
