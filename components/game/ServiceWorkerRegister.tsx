"use client";

import { useEffect } from "react";

/**
 * Registers the offline service worker so /play works without the network
 * and Chrome does not replace it with the dinosaur offline page.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // Warm the play cache while online so offline visits use Signal Runner
        if (navigator.onLine) {
          try {
            await fetch("/play", { credentials: "same-origin" });
          } catch {
            /* ignore */
          }
        }

        // Prefer the new worker immediately after deploy
        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              // New version ready; next load picks it up
            }
          });
        });
      } catch {
        /* registration can fail on first private-window visit */
      }
    };

    void register();
  }, []);

  return null;
}
