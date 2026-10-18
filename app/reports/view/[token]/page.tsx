import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { GeneratedReport } from "@/lib/reports/generate";
import ReportDocument from "@/components/reports/ReportDocument";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export default async function ReportViewPage({ params }: Props) {
  const { token } = await params;
  if (!token || token.length < 12) notFound();

  const sb = getSupabaseAdmin();
  if (!sb) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center text-[#a1a1a6]">
        Report service is temporarily unavailable.
      </main>
    );
  }

  const { data, error } = await sb
    .from("report_orders")
    .select("order_id, product_name, status, name, report_content, delivered_at")
    .eq("delivery_token", token)
    .maybeSingle();

  if (error || !data) notFound();

  if (
    data.status !== "completed" &&
    data.status !== "delivered" &&
    !data.report_content
  ) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-white">Report not ready</h1>
        <p className="mt-3 text-[15px] text-[#a1a1a6]">
          Status: {data.status}. Check back shortly or track order{" "}
          <code className="text-white">{data.order_id}</code>.
        </p>
      </main>
    );
  }

  const content = data.report_content as GeneratedReport | null;
  if (!content || !content.sections) notFound();

  return (
    <ReportDocument
      report={content}
      orderId={data.order_id}
      productName={data.product_name}
    />
  );
}
