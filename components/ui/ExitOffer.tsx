"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getServiceOffer, serviceWhatsAppLink } from "@/lib/service-offers";

const STORAGE_KEY = "doyin_exit_offer_dismissed";
const COOLDOWN_MS = 18 * 60 * 60 * 1000; // 18 hours
const OFFER = getServiceOffer("service-landing-page-deposit")!;

function wasDismissedRecently() {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const t = Number(raw);
    return Number.isFinite(t) && Date.now() - t < COOLDOWN_MS;
  } catch {
    return false;
  }
}

export default function ExitOffer() {
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (wasDismissedRecently()) return;

    const armTimer = window.setTimeout(() => setArmed(true), 12000);

    const onLeave = (e: MouseEvent) => {
      if (!armed) return;
      if (e.clientY > 12) return;
      setOpen(true);
    };

    let scrolledEnough = false;
    const onScroll = () => {
      if (window.scrollY > 500) scrolledEnough = true;
    };

    const mobileTimer = window.setTimeout(() => {
      if (window.innerWidth < 768 && scrolledEnough && !wasDismissedRecently()) {
        setOpen(true);
      }
    }, 28000);

    document.addEventListener("mouseout", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(armTimer);
      window.clearTimeout(mobileTimer);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [armed]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  async function payDeposit() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: OFFER.id,
          email: email.trim(),
          name: "Landing Page Starter deposit",
        }),
      });
      const data = await res.json();
      if (res.status === 503 || data.code === "NO_KEYS" || !data.authorization_url) {
        window.location.href = serviceWhatsAppLink(OFFER);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      dismiss();
      window.location.href = data.authorization_url;
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Could not start payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-offer-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close offer"
            onClick={dismiss}
          />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#121214] shadow-2xl"
          >
            <div className="border-b border-[#ff8c14]/20 bg-gradient-to-r from-[#ff8c14]/15 to-transparent px-6 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#ff8c14]">
                Before you go
              </p>
            </div>
            <div className="px-6 py-6">
              <h2 id="exit-offer-title" className="text-[22px] font-semibold tracking-tight text-white">
                Free audit — or lock a ₦100k landing page
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#a1a1a6]">
                Not ready to pay? Get a free 3-minute site check. Ready to sell?{" "}
                <span className="font-semibold text-white">{OFFER.name}</span> is{" "}
                <span className="font-semibold text-white">{OFFER.totalNgn}</span> (deposit{" "}
                {OFFER.depositNgn}).
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="/free-audit"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-[14px] font-semibold text-white"
                >
                  Free website audit
                </a>
                <a
                  href="/tools/whatsapp-scripts"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center rounded-full bg-[#25D366]/20 px-5 py-3 text-[14px] font-semibold text-[#25D366]"
                >
                  Free WhatsApp scripts
                </a>
              </div>

              <div className="my-5 h-px bg-white/10" />

              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#ff8c14]">
                Or pay deposit now
              </p>
              <label className="mt-2 block text-[12px] text-[#a1a1a6]">
                Email for Paystack receipt
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-white outline-none focus:border-[#ff8c14]"
                />
              </label>

              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={loading || !email.includes("@")}
                  onClick={payDeposit}
                  className="inline-flex items-center justify-center rounded-full bg-[#ff8c14] px-5 py-3 text-[14px] font-semibold text-black disabled:opacity-50"
                >
                  {loading ? "Redirecting…" : `Pay deposit · ${OFFER.depositNgn}`}
                </button>
                <a
                  href={serviceWhatsAppLink(OFFER)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismiss}
                  className="text-center text-[13px] text-[#2997ff] hover:underline"
                >
                  Prefer WhatsApp · all packages →
                </a>
                <button
                  type="button"
                  onClick={dismiss}
                  className="pt-1 text-center text-[12px] text-[#86868b] hover:text-white"
                >
                  Not now
                </button>
              </div>
              {err && <p className="mt-2 text-center text-sm text-red-400">{err}</p>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
