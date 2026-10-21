import { NextRequest, NextResponse } from "next/server";
import { findAnyEbook } from "@/lib/ebooks-catalog";
import { UI_COMPONENTS } from "@/lib/ui-components";
import { PAGE_TEMPLATES } from "@/lib/page-templates";
import { purchaseCovers, verifyPurchase } from "@/lib/payments/purchase";
import { limitRequest } from "@/lib/rate-limit";

/**
 * Returns paid content (ebook chapters, component/template source) only after the
 * Paystack reference is verified server-side as a full payment covering this product.
 */
export async function POST(req: NextRequest) {
  const limited = limitRequest(req, "unlock", 30, 60_000);
  if (limited) return limited;

  let body: { productId?: unknown; reference?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const productId = String(body.productId || "").trim();
  const reference = String(body.reference || "").trim();
  if (!productId || !reference) {
    return NextResponse.json({ error: "Missing product or reference." }, { status: 400 });
  }

  const check = await verifyPurchase(reference);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }
  if (!purchaseCovers(check.productId, productId)) {
    return NextResponse.json(
      { error: "This payment was for a different product." },
      { status: 403 }
    );
  }

  const headers = { "Cache-Control": "private, no-store" };

  const book = findAnyEbook(productId);
  if (book) {
    return NextResponse.json({ ok: true, kind: "ebook", chapters: book.chapters }, { headers });
  }
  const comp = UI_COMPONENTS.find((c) => c.id === productId || c.slug === productId);
  if (comp) {
    return NextResponse.json({ ok: true, kind: "component", fullCode: comp.fullCode }, { headers });
  }
  const tpl = PAGE_TEMPLATES.find((t) => t.id === productId || t.slug === productId);
  if (tpl) {
    return NextResponse.json(
      { ok: true, kind: "template", fullCode: tpl.fullCode, fullGuide: tpl.fullGuide },
      { headers }
    );
  }
  return NextResponse.json({ error: "Nothing to unlock for this product." }, { status: 404 });
}
