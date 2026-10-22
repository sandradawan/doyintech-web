import { redirect } from "next/navigation";

/** Old orders page; payments are in the payments ledger. */
export default function OrdersRedirect() {
  redirect("/admin/r/payment_claims");
}
