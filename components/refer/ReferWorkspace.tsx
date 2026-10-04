"use client";

import { useEffect, useMemo, useState } from "react";
import {
  normalizeReferralCode,
  referralShareUrl,
  saveReferralCode,
  readReferralCode,
} from "@/lib/referrals";

export default function ReferWorkspace() {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const existing = readReferralCode();
    if (existing) setCode(existing);
  }, []);

  const shareUrl = useMemo(() => {
    if (!code) return "";
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://www.doyintech.com";
    return referralShareUrl(code, origin);
  }, [code]);

  function generate() {
    const base = normalizeReferralCode(name) || "DOYIN";
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const next = `${base.slice(0, 12)}-${suffix}`;
    setCode(next);
    saveReferralCode(next);
  }

  async function copy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const waShare = shareUrl
    ? `https://wa.me/?text=${encodeURIComponent(
        `I recommend DoyinTech for websites & systems. Use my link (₦10k credit for me when you deposit):\n${shareUrl}`
      )}`
    : "";

  const waIntro =
    "https://wa.me/2348085343926?text=" +
    encodeURIComponent(
      `Hi DoyinTech — referral code ${code || "(generate first)"}.\nI want to REFER a business.\nMy name: ${name || ""}\nTheir business / contact:\nWhat they need:`
    );

  return (
    <div className="space-y-8">
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-[18px] font-semibold text-white">Your referral link</h2>
        <p className="mt-2 text-[14px] text-[#a1a1a6]">
          Create a code, share the link. When they deposit, tell us your code so we apply ₦10,000
          credit.
        </p>
        <label className="mt-5 block">
          <span className="text-[12px] text-[#a1a1a6]">Your name (for the code)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[15px] text-white outline-none focus:border-[#ff8c14]/50"
            placeholder="e.g. Ada"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={generate}
            className="rounded-full bg-[#ff8c14] px-5 py-2.5 text-[14px] font-semibold text-black"
          >
            {code ? "Regenerate code" : "Generate code"}
          </button>
          {code && (
            <span className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-[13px] font-mono text-white">
              {code}
            </span>
          )}
        </div>
        {shareUrl && (
          <div className="mt-5 space-y-3">
            <div className="break-all rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[13px] text-[#c7cdd8]">
              {shareUrl}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copy}
                className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                href={waShare}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-2.5 text-[14px] font-semibold text-white"
              >
                Share on WhatsApp
              </a>
              <a
                href={waIntro}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white"
              >
                Notify us of a referral
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
