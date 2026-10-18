"use client";

import { useTheme } from "@/components/ui/ThemeProvider";

type Props = {
  className?: string;
  variant?: "icon" | "chip";
};

export default function ThemeToggle({ className = "", variant = "icon" }: Props) {
  const { theme, toggle, ready } = useTheme();
  const isDark = theme === "dark";

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Light mode" : "Dark mode"}
        className={
          isDark
            ? `inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-[#a1a1a6] transition hover:border-white/30 hover:text-white ${className}`
            : `inline-flex items-center gap-2 rounded-full border border-black/12 bg-black/[0.04] px-3 py-1.5 text-[12px] font-medium text-[#6e6e73] transition hover:border-black/25 hover:text-[#1d1d1f] ${className}`
        }
      >
        <ThemeIcon dark={isDark} />
        <span>{ready ? (isDark ? "Dark" : "Light") : "Theme"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={
        isDark
          ? `flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#f5f5f7] transition hover:border-[#ff8c14]/50 hover:text-[#ff8c14] ${className}`
          : `flex h-9 w-9 items-center justify-center rounded-full border border-black/12 text-[#1d1d1f] transition hover:border-[#ff8c14]/60 hover:text-[#ff8c14] ${className}`
      }
    >
      <ThemeIcon dark={isDark} />
    </button>
  );
}

function ThemeIcon({ dark }: { dark: boolean }) {
  if (dark) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
