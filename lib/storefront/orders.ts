import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { PaystackTx } from "@/lib/payments/purchase";
import { formatKobo, type OrderItem } from "@/lib/storefront/shared";
import { absoluteUrl } from "@/lib/site";

/**
 * Marks a storefront order paid when `tx` is a successful NGN payment for that order's
 * reference covering its amount. Conditional update makes webhook + return-page races safe.
 * Returns true when this call flipped the order to paid.
 */
export async function markStorefrontOrderPaid(tx: PaystackTx): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (!sb || tx.status !== "success" || (tx.currency || "NGN").toUpperCase() !== "NGN") return false;

  const { data: order } = await sb
    .from("storefront_orders")
    .select("id, store_id, amount_kobo, status, customer_name, customer_phone, items")
    .eq("reference", tx.reference)
    .maybeSingle();
  if (!order || order.status !== "pending" || tx.amount < order.amount_kobo) return false;

  const { data: updated } = await sb
    .from("storefront_orders")
    .update({ status: "paid", paid_at: tx.paid_at || new Date().toISOString() })
    .eq("id", order.id)
    .eq("status", "pending")
    .select("id");
  if (!updated?.length) return false;

  await notifySeller(order.store_id, {
    reference: tx.reference,
    amount_kobo: order.amount_kobo,
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    items: order.items as OrderItem[],
  });
  return true;
}

async function notifySeller(
  storeId: string,
  o: { reference: string; amount_kobo: number; customer_name: string; customer_phone: string; items: OrderItem[] }
) {
  const key = process.env.RESEND_API_KEY;
  const sb = getSupabaseAdmin();
  if (!key || !sb) return;
  const { data: store } = await sb.from("storefronts").select("name, owner_email").eq("id", storeId).maybeSingle();
  if (!store?.owner_email) return;
  const from = process.env.DELIVERY_FROM_EMAIL || process.env.RESEND_FROM || "DoyinTech <onboarding@resend.dev>";
  const lines = o.items.map((i) => `${i.qty} × ${i.name} — ${formatKobo(i.qty * i.price_kobo)}`).join("\n");
  try {
    await new Resend(key).emails.send({
      from,
      to: store.owner_email,
      subject: `New paid order ${formatKobo(o.amount_kobo)} — ${store.name}`,
      text: `You have a new paid order on ${store.name}.\n\n${lines}\n\nTotal paid: ${formatKobo(
        o.amount_kobo
      )}\nCustomer: ${o.customer_name} (${o.customer_phone})\nReference: ${o.reference}\n\nThe money settles to your bank account through Paystack.\nManage orders: ${absoluteUrl("/stores/dashboard")}`,
    });
  } catch (e) {
    console.error("storefront seller email", e);
  }
}
