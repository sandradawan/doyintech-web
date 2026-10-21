"use client";

import { useEffect, useState } from "react";

const REFS_KEY = "dt_purchase_refs";
const MAX_REFS = 8;

export function readPurchaseRefs(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(REFS_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((r) => typeof r === "string").slice(0, MAX_REFS) : [];
  } catch {
    return [];
  }
}

/** Remember a Paystack reference on this device so purchases re-unlock on later visits. */
export function rememberPurchaseRef(reference: string) {
  if (!reference) return;
  try {
    const next = [reference, ...readPurchaseRefs().filter((r) => r !== reference)].slice(0, MAX_REFS);
    localStorage.setItem(REFS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}

export type UnlockState<T> =
  | { status: "checking" }
  | { status: "locked" }
  | { status: "unlocked"; content: T };

/**
 * Asks /api/unlock for paid content using the reference in the URL (fresh checkout) or
 * references remembered on this device. Content never ships in the page itself.
 */
export function usePurchaseUnlock<T>(productId: string): UnlockState<T> {
  const [state, setState] = useState<UnlockState<T>>({ status: "checking" });

  useEffect(() => {
    let cancelled = false;
    const q = new URLSearchParams(window.location.search);
    const fromUrl = q.get("reference") || q.get("trxref") || "";
    const refs = [fromUrl, ...readPurchaseRefs()].filter(
      (r, i, a) => r && a.indexOf(r) === i
    );

    (async () => {
      for (const reference of refs) {
        try {
          const res = await fetch("/api/unlock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, reference }),
          });
          if (!res.ok) continue;
          const data = (await res.json()) as T;
          rememberPurchaseRef(reference);
          if (!cancelled) setState({ status: "unlocked", content: data });
          return;
        } catch {
          /* try the next reference */
        }
      }
      if (!cancelled) setState({ status: "locked" });
    })();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return state;
}
