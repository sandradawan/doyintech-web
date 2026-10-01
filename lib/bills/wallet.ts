import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ensureProfileWallet } from "@/lib/bills/session";
import { buyAirtime, buyData } from "@/lib/bills/vtpass";
import {
  NETWORKS,
  DATA_PLANS,
  normalizeNgPhone,
  type NetworkId,
} from "@/lib/bills/catalog";

export function vtpassRequestId(prefix: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "00";
  const stamp = `${get("year")}${get("month")}${get("day")}${get("hour")}${get("minute")}`;
  return `${stamp}${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

export async function getBalanceKobo(userId: string): Promise<number> {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("Database not configured");
  await ensureProfileWallet(userId);
  const { data, error } = await admin
    .from("wallets")
    .select("balance_kobo")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return Number(data?.balance_kobo ?? 0);
}

export async function creditWallet(opts: {
  userId: string;
  amountKobo: number;
  reference: string;
  reason: string;
  meta?: Record<string, unknown>;
}) {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("Database not configured");
  await ensureProfileWallet(opts.userId);
  const { data, error } = await admin.rpc("wallet_credit", {
    p_user_id: opts.userId,
    p_amount_kobo: opts.amountKobo,
    p_reference: opts.reference,
    p_reason: opts.reason,
    p_meta: opts.meta || {},
  });
  if (error) throw new Error(error.message);
  return Number(data);
}

export async function debitWallet(opts: {
  userId: string;
  amountKobo: number;
  reference: string;
  reason: string;
  meta?: Record<string, unknown>;
}) {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("Database not configured");
  const { data, error } = await admin.rpc("wallet_try_debit", {
    p_user_id: opts.userId,
    p_amount_kobo: opts.amountKobo,
    p_reference: opts.reference,
    p_reason: opts.reason,
    p_meta: opts.meta || {},
  });
  if (error) {
    if (error.message.includes("insufficient_balance")) {
      const err = new Error("Insufficient wallet balance");
      (err as Error & { code?: string }).code = "INSUFFICIENT";
      throw err;
    }
    throw new Error(error.message);
  }
  return Number(data);
}

export async function buyFromWallet(opts: {
  userId: string;
  kind: "airtime" | "data";
  network: NetworkId;
  phone: string;
  amountNaira?: number;
  variation_code?: string;
}) {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("Database not configured");

  const phone = normalizeNgPhone(opts.phone);
  if (!phone) throw new Error("Invalid phone number");

  const net = NETWORKS.find((n) => n.id === opts.network);
  if (!net) throw new Error("Invalid network");

  let amountNaira = 0;
  let variation_code = opts.variation_code || "";

  if (opts.kind === "airtime") {
    amountNaira = Math.floor(Number(opts.amountNaira) || 0);
    if (amountNaira < 50 || amountNaira > 50000) {
      throw new Error("Airtime must be between ₦50 and ₦50,000");
    }
  } else {
    const plan = DATA_PLANS.find(
      (p) => p.network === net.id && p.variation_code === opts.variation_code
    );
    if (!plan) throw new Error("Invalid data plan");
    amountNaira = plan.amount;
    variation_code = plan.variation_code;
  }

  const amountKobo = amountNaira * 100;
  const reqId = vtpassRequestId(opts.kind === "airtime" ? "AIR" : "DAT");

  const { data: order, error: orderErr } = await admin
    .from("bill_orders")
    .insert({
      user_id: opts.userId,
      kind: opts.kind,
      network: net.id,
      phone,
      amount_kobo: amountKobo,
      status: "pending",
      request_id: reqId,
      variation_code: variation_code || null,
      provider: "vtpass",
    })
    .select("id")
    .single();

  if (orderErr || !order) throw new Error(orderErr?.message || "Could not create order");

  try {
    await debitWallet({
      userId: opts.userId,
      amountKobo,
      reference: reqId,
      reason: "bill_purchase",
      meta: { kind: opts.kind, phone, network: net.id, order_id: order.id },
    });
  } catch (e) {
    await admin
      .from("bill_orders")
      .update({
        status: "failed",
        error_message: (e as Error).message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);
    throw e;
  }

  await admin
    .from("bill_orders")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", order.id);

  let providerResult: Record<string, unknown>;
  try {
    if (opts.kind === "airtime") {
      providerResult = (await buyAirtime({
        serviceID: net.serviceID,
        phone,
        amount: amountNaira,
        request_id: reqId,
      })) as Record<string, unknown>;
    } else {
      providerResult = (await buyData({
        serviceID: net.serviceID,
        phone,
        variation_code,
        amount: amountNaira,
        request_id: reqId,
      })) as Record<string, unknown>;
    }
  } catch (e) {
    await creditWallet({
      userId: opts.userId,
      amountKobo,
      reference: `${reqId}_refund`,
      reason: "bill_refund",
      meta: { order_id: order.id },
    });
    await admin
      .from("bill_orders")
      .update({
        status: "refunded",
        error_message: (e as Error).message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);
    throw e;
  }

  const code = String(providerResult.code || providerResult.status || "");
  const demo = Boolean(providerResult.demo);
  const ok =
    demo ||
    code === "000" ||
    code === "demo" ||
    String(providerResult.response_description || "")
      .toLowerCase()
      .includes("success");

  if (ok) {
    await admin
      .from("bill_orders")
      .update({
        status: "success",
        provider_response: providerResult,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);
    return {
      ok: true,
      demo,
      orderId: order.id,
      requestId: reqId,
      amountNaira,
      phone,
      kind: opts.kind,
      provider: providerResult,
      message: demo
        ? "Wallet debited. Add VTpass keys for live delivery."
        : `${opts.kind === "airtime" ? "Airtime" : "Data"} sent to ${phone}`,
    };
  }

  await creditWallet({
    userId: opts.userId,
    amountKobo,
    reference: `${reqId}_refund`,
    reason: "bill_refund",
    meta: { order_id: order.id, provider: providerResult },
  });
  await admin
    .from("bill_orders")
    .update({
      status: "refunded",
      provider_response: providerResult,
      error_message: String(
        providerResult.response_description || providerResult.message || "Provider failed"
      ),
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  throw new Error(
    String(providerResult.response_description || "Purchase failed — wallet refunded")
  );
}
