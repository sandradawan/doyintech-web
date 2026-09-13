import type { ReviewStatus } from "./types";

export type QueuedSubmission = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  developerName: string;
  developerEmail: string;
  platform: string;
  kind: string;
  priceNgn: number;
  category: string;
  version: string;
  packageType?: string;
  fileName?: string;
  privacyPolicyUrl?: string;
  reviewStatus: ReviewStatus;
  virusScanStatus: "pending" | "clean" | "flagged" | "failed";
  securityNotes?: string;
  createdAt: string;
  updatedAt: string;
};

/** Process-local queue (dev/demo). Production: Supabase store_listings */
const g = globalThis as unknown as { __doyinStoreQueue?: QueuedSubmission[] };
if (!g.__doyinStoreQueue) g.__doyinStoreQueue = [];

export function listQueue(): QueuedSubmission[] {
  return [...(g.__doyinStoreQueue || [])].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export function addToQueue(
  input: Omit<
    QueuedSubmission,
    "id" | "reviewStatus" | "virusScanStatus" | "createdAt" | "updatedAt"
  >
): QueuedSubmission {
  const now = new Date().toISOString();
  const row: QueuedSubmission = {
    ...input,
    id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    reviewStatus: "submitted",
    virusScanStatus: "pending",
    createdAt: now,
    updatedAt: now,
  };
  g.__doyinStoreQueue!.unshift(row);
  // Simulate scan → in_review after accept
  setTimeout(() => {
    const item = g.__doyinStoreQueue!.find((x) => x.id === row.id);
    if (item && item.reviewStatus === "submitted") {
      item.reviewStatus = "scanning";
      item.updatedAt = new Date().toISOString();
    }
  }, 500);
  setTimeout(() => {
    const item = g.__doyinStoreQueue!.find((x) => x.id === row.id);
    if (item && item.reviewStatus === "scanning") {
      item.reviewStatus = "in_review";
      item.virusScanStatus = "clean";
      item.updatedAt = new Date().toISOString();
    }
  }, 2500);
  return row;
}

export function updateQueueStatus(
  id: string,
  reviewStatus: ReviewStatus,
  securityNotes?: string
): QueuedSubmission | null {
  const item = g.__doyinStoreQueue!.find((x) => x.id === id);
  if (!item) return null;
  item.reviewStatus = reviewStatus;
  if (securityNotes !== undefined) item.securityNotes = securityNotes;
  if (reviewStatus === "approved") item.virusScanStatus = "clean";
  if (reviewStatus === "rejected") item.virusScanStatus = item.virusScanStatus || "flagged";
  item.updatedAt = new Date().toISOString();
  return item;
}
