/**
 * Paystack Subscriptions: plan provisioning, checkout, webhook sync and entitlement checks.
 * Server-only (uses the Paystack secret and the Supabase service role).
 */
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/site";
import {
  SUBSCRIPTION_PLANS,
  getPlan,
  type PlanFamily,
  type SubscriptionPlan,
} from "@/lib/subscriptions/plans";

const PAYSTACK = "https://api.paystack.co";
const PLAN_CODES_KEY = "paystack_plan_codes";

function secret(): string {
  return process.env.PAYSTACK_SECRET_KEY || "";
}

async function paystack<T = Record<string, unknown>>(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<{ ok: boolean; data?: T; message?: string }> {
  const res = await fetch(`${PAYSTACK}${path}`, {
    method: init.method || "GET",
    headers: {
      Authorization: `Bearer ${secret()}`,
      "Content-Type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as
    | { status?: boolean; data?: T; message?: string }
    | null;
  return { ok: res.ok && !!json?.status, data: json?.data, message: json?.message };
}

function envPlanCode(planId: string): string {
  return (process.env[`PAYSTACK_PLAN_${planId.toUpperCase().replace(/-/g, "_")}`] || "").trim();
}

async function storedPlanCodes(): Promise<Record<string, string>> {
  const sb = getSupabaseAdmin();
  if (!sb) return {};
  const { data } = await sb.from("site_settings").select("value").eq("key", PLAN_CODES_KEY).maybeSingle();
  return (data?.value as Record<string, string>) || {};
}

/**
 * Paystack plan code for one of our plans. Order: env pin → saved code → create it on Paystack.
 * Codes are saved per plan id + amount, so changing a price creates a new Paystack plan instead
 * of silently re-pricing existing subscribers.
 */
export async function getPlanCode(plan: SubscriptionPlan): Promise<string | null> {
  const pinned = envPlanCode(plan.id);
  if (pinned) return pinned;

  const key = `${plan.id}@${plan.amountNgn}`;
  const saved = await storedPlanCodes();
  if (saved[key]) return saved[key];

  const created = await paystack<{ plan_code: string }>("/plan", {
    method: "POST",
    body: {
      name: `${plan.name} (₦${plan.amountNgn.toLocaleString("en-NG")}/${plan.interval === "annually" ? "yr" : "mo"})`,
      interval: plan.interval,
      amount: plan.amountNgn * 100,
      currency: "NGN",
    },
  });
  const code = created.data?.plan_code;
  if (!created.ok || !code) {
    console.error("paystack plan create failed", plan.id, created.message);
    return null;
  }

  const sb = getSupabaseAdmin();
  if (sb) {
    await sb.from("site_settings").upsert(
      { key: PLAN_CODES_KEY, value: { ...saved, [key]: code }, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  }
  return code;
}

/** Reverse lookup used by webhooks (Paystack sends plan_code, we store plan ids). */
export async function planIdForCode(planCode: string): Promise<string | null> {
  for (const p of SUBSCRIPTION_PLANS) {
    if (envPlanCode(p.id) === planCode) return p.id;
  }
  const saved = await storedPlanCodes();
  for (const [key, code] of Object.entries(saved)) {
    if (code === planCode) return key.split("@")[0];
  }
  return null;
}

export async function startSubscriptionCheckout(opts: {
  planId: string;
  email: string;
  name?: string;
}): Promise<{ ok: true; authorizationUrl: string; reference: string } | { ok: false; error: string }> {
  if (!secret()) return { ok: false, error: "Payments are not configured yet." };
  const plan = getPlan(opts.planId);
  if (!plan) return { ok: false, error: "Unknown plan." };

  const planCode = await getPlanCode(plan);
  if (!planCode) return { ok: false, error: "Could not prepare this plan. Please try again shortly." };

  const res = await paystack<{ authorization_url: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: {
      email: opts.email,
      amount: plan.amountNgn * 100, // Paystack uses the plan amount; required field
      currency: "NGN",
      plan: planCode,
      callback_url: `${SITE_URL}/account?subscribed=${encodeURIComponent(plan.id)}`,
      metadata: {
        kind: "subscription",
        plan_id: plan.id,
        customer_name: opts.name || undefined,
      },
    },
  });
  if (!res.ok || !res.data?.authorization_url) {
    return { ok: false, error: res.message || "Could not start checkout." };
  }
  return { ok: true, authorizationUrl: res.data.authorization_url, reference: res.data.reference };
}

type SubscriptionPayload = {
  subscription_code?: string;
  email_token?: string;
  status?: string;
  amount?: number;
  next_payment_date?: string | null;
  plan?: { plan_code?: string };
  customer?: { email?: string; customer_code?: string };
};

const STATUS_MAP: Record<string, string> = {
  active: "active",
  "non-renewing": "non-renewing",
  attention: "attention",
  completed: "completed",
  cancelled: "cancelled",
};

/** Upserts our row from a Paystack subscription object (subscription.* webhook events). */
export async function syncSubscription(sub: SubscriptionPayload, overrideStatus?: string) {
  const sb = getSupabaseAdmin();
  const code = sub.subscription_code;
  const email = (sub.customer?.email || "").toLowerCase();
  if (!sb || !code || !email) return;

  const planId = sub.plan?.plan_code ? await planIdForCode(sub.plan.plan_code) : null;
  const status = STATUS_MAP[overrideStatus || sub.status || "active"] || "active";

  const row: Record<string, unknown> = {
    email,
    subscription_code: code,
    status,
    updated_at: new Date().toISOString(),
  };
  if (planId) row.plan_id = planId;
  if (sub.plan?.plan_code) row.plan_code = sub.plan.plan_code;
  if (sub.email_token) row.email_token = sub.email_token;
  if (sub.customer?.customer_code) row.customer_code = sub.customer.customer_code;
  if (typeof sub.amount === "number") row.amount_kobo = sub.amount;
  if (sub.next_payment_date) row.next_payment_date = sub.next_payment_date;

  // Update-or-insert (not upsert) so a sparse event never overwrites a known plan_id.
  const { data: existing } = await sb
    .from("subscriptions")
    .select("id")
    .eq("subscription_code", code)
    .maybeSingle();
  const { error } = existing
    ? await sb.from("subscriptions").update(row).eq("id", existing.id)
    : await sb.from("subscriptions").insert({ plan_id: planId || "unknown", ...row });
  if (error) console.error("subscriptions sync", error.message);
}

/**
 * Renewal charges (charge.success carrying a plan) extend access. Paystack sends the new
 * next_payment_date via subscription events; until then, push it forward one interval.
 */
export async function recordRenewal(opts: { email: string; planCode: string; reference: string }) {
  const sb = getSupabaseAdmin();
  if (!sb) return;
  const planId = await planIdForCode(opts.planCode);
  const plan = planId ? getPlan(planId) : undefined;
  if (!plan) return;

  const next = new Date();
  if (plan.interval === "annually") next.setFullYear(next.getFullYear() + 1);
  else next.setMonth(next.getMonth() + 1);

  await sb
    .from("subscriptions")
    .update({
      status: "active",
      last_payment_reference: opts.reference,
      next_payment_date: next.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("plan_code", opts.planCode)
    .ilike("email", opts.email);
}

export type ActiveSubscription = {
  planId: string;
  status: string;
  nextPaymentDate: string | null;
  subscriptionCode: string | null;
};

/**
 * Subscriptions that currently grant access. "non-renewing" (cancelled renewal) and
 * "attention" (failed card, Paystack retrying) keep access until the paid period ends.
 */
export async function activeSubscriptions(email: string): Promise<ActiveSubscription[]> {
  const sb = getSupabaseAdmin();
  if (!sb || !email) return [];
  const { data } = await sb
    .from("subscriptions")
    .select("plan_id, status, next_payment_date, subscription_code")
    .ilike("email", email.trim())
    .in("status", ["active", "non-renewing", "attention"]);

  const now = Date.now();
  const GRACE_MS = 3 * 24 * 60 * 60 * 1000;
  return (data || [])
    .filter((s) => !s.next_payment_date || new Date(s.next_payment_date).getTime() + GRACE_MS > now)
    .map((s) => ({
      planId: s.plan_id,
      status: s.status,
      nextPaymentDate: s.next_payment_date,
      subscriptionCode: s.subscription_code,
    }));
}

export async function hasActiveFamily(email: string, family: PlanFamily): Promise<boolean> {
  const subs = await activeSubscriptions(email);
  return subs.some((s) => getPlan(s.planId)?.family === family);
}

/** Paystack-hosted page where the customer updates their card or cancels. */
export async function manageLink(subscriptionCode: string): Promise<string | null> {
  const res = await paystack<{ link: string }>(
    `/subscription/${encodeURIComponent(subscriptionCode)}/manage/link`
  );
  return res.ok ? res.data?.link || null : null;
}
