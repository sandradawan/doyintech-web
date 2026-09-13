/** DoyinStore — independent app & digital product marketplace */

export type StorePlatform = "android" | "windows" | "macos" | "linux" | "web" | "digital";

export type ReviewStatus =
  | "draft"
  | "submitted"
  | "scanning"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "suspended";

export type ListingKind = "app" | "digital_product";

export type StoreListing = {
  id: string;
  slug: string;
  kind: ListingKind;
  title: string;
  shortDescription: string;
  description: string;
  developerName: string;
  developerEmail: string;
  platform: StorePlatform;
  /** Display price in NGN; 0 = free */
  priceNgn: number;
  amountKobo: number;
  category: string;
  iconEmoji: string;
  version: string;
  /** Allowed binary types for apps */
  packageType?: "apk" | "exe" | "dmg" | "deb" | "zip" | "other";
  fileName?: string;
  fileSizeMb?: number;
  /** Open web apps instantly (no binary) */
  launchUrl?: string;
  /** Security pipeline */
  reviewStatus: ReviewStatus;
  securityNotes?: string;
  virusScanStatus?: "pending" | "clean" | "flagged" | "failed";
  sha256?: string;
  downloads: number;
  ratingAvg: number;
  ratingCount: number;
  features: string[];
  screenshots?: string[];
  createdAt: string;
  publishedAt?: string;
};

export type DeveloperSubmission = {
  title: string;
  shortDescription: string;
  description: string;
  developerName: string;
  developerEmail: string;
  platform: StorePlatform;
  kind: ListingKind;
  priceNgn: number;
  category: string;
  version: string;
  packageType?: string;
  fileName?: string;
  website?: string;
  privacyPolicyUrl?: string;
};

export const APP_PACKAGE_HINTS: Record<string, string> = {
  android: "Upload APK only (not AAB). Users install after download with permission.",
  windows: "Upload signed .exe or .msi installer ZIP.",
  macos: "Upload .dmg or notarized .pkg when possible.",
  linux: "Upload .deb / AppImage / .tar.gz.",
  web: "No binary — provide launch URL in description.",
  digital: "ZIP of templates, code kits, or documents.",
};
