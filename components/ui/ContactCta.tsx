"use client";

import { discoveryCallLink } from "@/lib/packages";

const EMAIL = "doyintechnology@outlook.com";

export function emailLink(subject = "Project inquiry — DoyinTech") {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export default function ContactCta({
  title = "Ready to talk?",
  subtitle = "No long forms. Email us or book a call on WhatsApp.",
  emailSubject = "Project inquiry — DoyinTech",
  className = "",
  compact = false,
}: {
  title?: string;
  subtitle?: string;
  emailSubject?: string;
  className?: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className={`flex flex-col gap-2 sm:flex-row ${className}`}>
        <a
          href={emailLink(emailSubject)}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-[#f5f5f7] transition hover:bg-white/5"
        >
          Email us
        </a>
        <a
          href={discoveryCallLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Book a call
        </a>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-black/30 p-5 md:p-6 ${className}`}
    >
      <h3 className="font-display text-lg font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <a
          href={emailLink(emailSubject)}
          className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-[#f5f5f7] transition hover:bg-white/5"
        >
          Email us
        </a>
        <a
          href={discoveryCallLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Book a call
        </a>
      </div>
      <p className="mt-3 text-center text-[12px] text-gray-500">
        {EMAIL} · WhatsApp +234 808 534 3926
      </p>
    </div>
  );
}
