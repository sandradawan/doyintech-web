/**
 * The site's calls to action. One primary everywhere (fixed-price website → /hire),
 * one secondary (free audit). Change them here, not per page.
 */
export const PRIMARY_CTA = {
  href: "/hire",
  label: "Get a fixed-price website",
  short: "Get a website",
} as const;

export const SECONDARY_CTA = {
  href: "/free-audit",
  label: "Free website audit",
} as const;
