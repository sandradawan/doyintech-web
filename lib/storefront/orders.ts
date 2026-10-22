import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { PaystackTx } from "@/lib/payments/purchase";
import { formatKobo, type OrderItem } from "@/lib/storefront/shared";
import { absoluteUrl } from "@/lib/site";

type PaidOrder = {
  reference: string;
  amount_kobo: number;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  delivery_zone: string | null;
  delivery_fee_kobo: number;
  delivery_address: string | null;
  discount_code: string | null;
  discount_kobo: number;
};

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
    .select(
      "id, store_id, amount_kobo, status, customer_name, customer_phone, items, delivery_zone, delivery_fee_kobo, delivery_address, discount_code, discount_kobo"
    )
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

  if (order.discount_code) {
    const { data: d } = await sb
      .from("storefront_discounts")
      .select("id, uses")
      .eq("store_id", order.store_id)
      .eq("code", order.discount_code)
      .maybeSingle();
    if (d) await sb.from("storefront_discounts").update({ uses: d.uses + 1 }).eq("id", d.id);
  }

  await notifySeller(order.store_id, { ...(order as Omit<PaidOrder, "reference">), reference: tx.reference });
  return true;
}

async function notifySeller(storeId: string, o: PaidOrder) {
  const key = process.env.RESEND_API_KEY;
  const sb = getSupabaseAdmin();
  if (!key || !sb) return;
  const { data: store } = await sb.from("storefronts").select("name, owner_email").eq("id", storeId).maybeSingle();
  if (!store?.owner_email) return;
  const from = process.env.DELIVERY_FROM_EMAIL || process.env.RESEND_FROM || "DoyinTech <onboarding@resend.dev>";
  const lines = [
    ...o.items.map((i) => `${i.qty} × ${i.name} — ${formatKobo(i.qty * i.price_kobo)}`),
    o.discount_kobo ? `Discount (${o.discount_code}): −${formatKobo(o.discount_kobo)}` : "",
    o.delivery_zone ? `Delivery to ${o.delivery_zone}: ${formatKobo(o.delivery_fee_kobo)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  try {
    await new Resend(key).emails.send({
      from,
      to: store.owner_email,
      subject: `New paid order ${formatKobo(o.amount_kobo)} — ${store.name}`,
      text: [
        `You have a new paid order on ${store.name}.`,
        "",
        lines,
        "",
        `Total paid: ${formatKobo(o.amount_kobo)}`,
        `Customer: ${o.customer_name} (${o.customer_phone})`,
        o.delivery_address ? `Address / note: ${o.delivery_address}` : null,
        `Reference: ${o.reference}`,
        "",
        "The money settles to your bank account through Paystack.",
        `Manage orders: ${absoluteUrl("/stores/dashboard")}`,
      ]
        .filter((l) => l !== null)
        .join("\n"),
    });
  } catch (e) {
    console.error("storefront seller email", e);
  }
}
