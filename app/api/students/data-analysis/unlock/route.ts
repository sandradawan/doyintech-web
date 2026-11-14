import { NextRequest, NextResponse } from "next/server";
import { verifyPurchase } from "@/lib/payments/purchase";
import { limitRequest } from "@/lib/rate-limit";
import { DATA_ANALYSIS_PRODUCT, DATASET_HASH_RE } from "@/lib/students/analysis/product";

/**
 * Confirms a data analysis payment and returns the fingerprint of the data set it paid for.
 * The tool only unlocks downloads when that fingerprint matches the data the student has loaded.
 */
export async function GET(req: NextRequest) {
  const limited = limitRequest(req, "data-analysis-unlock", 20, 60_000);
  if (limited) return limited;

  const reference = (req.nextUrl.searchParams.get("reference") || "").trim();
  if (!reference || reference.length > 100) {
    return NextResponse.json({ ok: false, error: "Enter your payment reference." }, { status: 400 });
  }

  const check = await verifyPurchase(reference);
  if (!check.ok) {
    const error = check.status === 404 ? "We couldn't find that payment. Check the reference and try again." : check.error;
    return NextResponse.json({ ok: false, error }, { status: check.status });
  }
  if (check.productId !== DATA_ANALYSIS_PRODUCT.id) {
    return NextResponse.json({ ok: false, error: "That payment was for a different product." }, { status: 400 });
  }
  const datasetHash = String(check.tx.metadata?.dataset_hash || "");
  if (!DATASET_HASH_RE.test(datasetHash)) {
    return NextResponse.json({ ok: false, error: "That payment isn't linked to a data file. Please contact support." }, { status: 400 });
  }
  return NextResponse.json({ ok: true, datasetHash, reference });
}
