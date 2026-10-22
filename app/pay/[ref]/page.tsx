import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { REQUEST_REF_RE } from "@/lib/storefront/requests";
import { formatKobo } from "@/lib/storefront/shared";
import PayRequestClient from "@/components/storefront/PayRequestClient";

type Props = { params: Promise<{ ref: string }> };

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Secure payment" },
  robots: { index: false, follow: false },
};

async function load(ref: string) {
  if (!REQUEST_REF_RE.test(ref)) return null;
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { data: r } = await sb
    .from("storefront_payment_requests")
    .select("reference, store_id, title, description, amount_kobo, customer_name, customer_email, due_date, status, paid_at")
    .eq("reference", ref)
    .maybeSingle();
  if (!r) return null;
  const { data: store } = await sb.from("storefronts").select("name, slug, whatsapp").eq("id", r.store_id).maybeSingle();
  return store ? { r, store } : null;
}

/** Public "Pay now" page for a seller's payment link. */
export default async function PayPage({ params }: Props) {
  const { ref } = await params;
  const data = await load(ref);
  if (!data) notFound();
  const { r, store } = data;
  const due = r.due_date
    ? new Date(`${r.due_date}T12:00:00Z`).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
    : null;
  const overdue = r.status === "open" && r.due_date && r.due_date < new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-4 py-10 text-[#111] sm:py-16">
      <div className="mx-auto max-w-md">
        <p className="text-center text-[13px] font-medium text-[#777]">Payment request from</p>
        <h1 className="mt-1 text-center text-[22px] font-semibold tracking-tight">{store.name}</h1>

        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.06]">
          <div className="border-b border-black/[0.06] p-6 text-center">
            <p className="text-[14px] text-[#555]">{r.title}</p>
            <p className="mt-1 text-[40px] font-semibold tracking-tight tabular-nums">{formatKobo(r.amount_kobo)}</p>
            {due && (
              <p className={`mt-1 text-[13px] font-medium ${overdue ? "text-red-600" : "text-[#777]"}`}>
                {overdue ? "Overdue · was due" : "Due"} {due}
              </p>
            )}
          </div>
          <div className="space-y-4 p-6">
            {r.customer_name && (
              <p className="text-[14px] text-[#555]">
                For <span className="font-medium text-[#111]">{r.customer_name}</span>
              </p>
            )}
            {r.description && <p className="whitespace-pre-line text-[14px] leading-relaxed text-[#444]">{r.description}</p>}
            <PayRequestClient reference={r.reference} status={r.status} needsEmail={!r.customer_email} amount={formatKobo(r.amount_kobo)} />
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-[#888]">
          This payment goes to {store.name} through Paystack. DoyinTech provides the payment page only.{" "}
          <a
            href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Hi ${store.name}, about ${r.title} (${r.reference})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#111] underline"
          >
            Questions? Message {store.name}
          </a>
          .
        </p>
        <p className="mt-3 text-center text-[11px] text-[#aaa]">
          Get paid by link for your own invoices with{" "}
          <Link href="/stores" className="underline">
            DoyinTech Store
          </Link>
        </p>
      </div>
    </main>
  );
}
