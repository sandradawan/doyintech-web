import { NextRequest, NextResponse } from "next/server";
import { verifyDeliveryToken } from "@/lib/delivery/tokens";
import { readPublicFile, resolveProductDelivery } from "@/lib/delivery/resolve";
import { textToPdfBuffer } from "@/lib/delivery/pdf";
import { findAnyEbook } from "@/lib/ebooks-catalog";
import { buildEbookPdf, ebookPdfFilename } from "@/lib/ebooks/pdf";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const format = (req.nextUrl.searchParams.get("format") || "md") as
    | "md"
    | "pdf"
    | "raw"
    | "ebook-pdf";
  const pathParam = req.nextUrl.searchParams.get("path") || "";
  const productParam = req.nextUrl.searchParams.get("product") || "";

  const verified = verifyDeliveryToken(token);
  if (!verified.ok) {
    return new NextResponse(verified.error, { status: 403 });
  }
  const { grant } = verified;

  if (format === "ebook-pdf") {
    const book = findAnyEbook(productParam || grant.productId);
    if (!book) return new NextResponse("Ebook not found", { status: 404 });
    if (
      grant.productId !== book.id &&
      grant.productId !== book.slug &&
      productParam &&
      productParam !== book.id &&
      productParam !== book.slug
    ) {
      return new NextResponse("Token product mismatch", { status: 403 });
    }
    const pdf = buildEbookPdf(book);
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${ebookPdfFilename(book)}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  const resolved = resolveProductDelivery(grant.productId);
  const productName = resolved?.productName || grant.productId;

  if (format === "raw") {
    if (!pathParam || !grant.paths.includes(pathParam)) {
      return new NextResponse("File not in grant", { status: 403 });
    }
    const content = await readPublicFile(pathParam);
    if (!content) return new NextResponse("File not found", { status: 404 });
    const name = pathParam.split("/").pop() || "file.md";
    const type = name.endsWith(".csv")
      ? "text/csv; charset=utf-8"
      : "text/markdown; charset=utf-8";
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Content-Disposition": `attachment; filename="${name}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  let combined = `# ${productName}\n\nDelivered by DoyinTech after payment.\n\n`;
  for (const p of grant.paths) {
    const content = await readPublicFile(p);
    if (content) {
      const base = p.split("/").pop() || p;
      combined += `\n\n---\n\n## ${base}\n\n${content}`;
    }
  }
  if (grant.paths.length === 0) {
    combined +=
      "\nNo file pack attached to this product id. Contact support with your payment reference.\n";
  }

  if (format === "pdf") {
    const pdf = textToPdfBuffer(productName, combined.slice(0, 50000));
    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${grant.productId}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return new NextResponse(combined, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${grant.productId}.md"`,
      "Cache-Control": "no-store",
    },
  });
}
