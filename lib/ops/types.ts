/** DoyinOps — SME operations types (browser MVP; Supabase-ready shape) */

export type DealStage =
  | "lead"
  | "contacted"
  | "quoted"
  | "won"
  | "delivering"
  | "paid"
  | "lost";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"
  | "converted";

export type Contact = {
  id: string;
  name: string;
  business?: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
};

export type Deal = {
  id: string;
  contactId: string;
  title: string;
  stage: DealStage;
  valueNgn: number;
  notes?: string;
  nextFollowUp?: string;
  createdAt: string;
  updatedAt: string;
};

export type Invoice = {
  id: string;
  number: string;
  contactId: string;
  dealId?: string;
  amountNgn: number;
  status: InvoiceStatus;
  description: string;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
};

export type Quote = {
  id: string;
  number: string;
  contactId: string;
  amountNgn: number;
  description: string;
  status: QuoteStatus;
  validUntil: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  done: boolean;
  dueDate?: string;
  contactId?: string;
  createdAt: string;
};

export type ActivityEvent = {
  id: string;
  message: string;
  createdAt: string;
};

export type BusinessProfile = {
  legalName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  website?: string;
  bankNote?: string;
};

export type OpsWorkspace = {
  version: 1;
  orgName: string;
  profile: BusinessProfile;
  contacts: Contact[];
  deals: Deal[];
  invoices: Invoice[];
  quotes: Quote[];
  tasks: Task[];
  activity: ActivityEvent[];
};

export const DEAL_STAGES: { id: DealStage; label: string }[] = [
  { id: "lead", label: "Lead" },
  { id: "contacted", label: "Contacted" },
  { id: "quoted", label: "Quoted" },
  { id: "won", label: "Won" },
  { id: "delivering", label: "Delivering" },
  { id: "paid", label: "Paid" },
  { id: "lost", label: "Lost" },
];
