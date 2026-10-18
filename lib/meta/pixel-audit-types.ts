export type AuditStatus =
  | "passed"
  | "needs_attention"
  | "warning"
  | "not_detected"
  | "unable_to_verify";

export type AuditCheck = {
  id: string;
  title: string;
  status: AuditStatus;
  detail: string;
};

export type PixelAuditReport = {
  url: string;
  finalUrl: string;
  auditedAt: string;
  https: boolean;
  pixelDetected: boolean;
  pixelIds: string[];
  eventsDetected: string[];
  checks: AuditCheck[];
  limitations: string[];
  recommendations: string[];
  score: number;
  scoreNote: string;
};
