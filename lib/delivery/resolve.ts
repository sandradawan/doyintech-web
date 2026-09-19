import { DIGITAL_PRODUCTS } from "@/lib/products";
import { STORE_LISTINGS } from "@/lib/store/catalog";
import { findAnyEbook } from "@/lib/ebooks-catalog";
import path from "path";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

export type ResolvedDelivery = {
  productId: string;
  productName: string;
  mdPaths: string[];
  kind: "digital" | "store" | "ebook" | "other";
};

export function resolveProductDelivery(productId: string): ResolvedDelivery | null {
  if (!productId) return null;

  const digital = DIGITAL_PRODUCTS.find((p) => p.id === productId);
  if (digital) {
    const paths = [
      ...(digital.downloadPaths || []),
      ...(digital.downloadPath ? [digital.downloadPath] : []),
    ].filter((p, i, a) => p && a.indexOf(p) === i);
    return {
      productId: digital.id,
      productName: digital.name,
      mdPaths: paths.filter((p) => p.endsWith(".md") || p.endsWith(".csv") || p.endsWith(".txt")),
      kind: "digital",
    };
  }

  const listing = STORE_LISTINGS.find((l) => l.id === productId || l.slug === productId);
  if (listing && listing.kind === "digital_product") {
    const guess = `/digital-products/${listing.slug}.md`;
    const paths = existsSync(path.join(process.cwd(), "public", guess.replace(/^\//, "")))
      ? [guess]
      : [];
    return {
      productId: listing.slug,
      productName: listing.title,
      mdPaths: paths,
      kind: "store",
    };
  }

  const ebook = findAnyEbook(productId);
  if (ebook) {
    const paths: string[] = [];
    const candidates = [`/ebooks/${ebook.slug}.md`, `/digital-products/${ebook.slug}.md`];
    for (const c of candidates) {
      if (existsSync(path.join(process.cwd(), "public", c.replace(/^\//, "")))) {
        paths.push(c);
      }
    }
    return {
      productId: ebook.id,
      productName: ebook.title,
      mdPaths: paths,
      kind: "ebook",
    };
  }

  return {
    productId,
    productName: productId,
    mdPaths: [],
    kind: "other",
  };
}

export async function readPublicFile(webPath: string): Promise<string | null> {
  const rel = webPath.replace(/^\//, "").replace(/\.\./g, "");
  const full = path.join(process.cwd(), "public", rel);
  if (!existsSync(full)) return null;
  try {
    return await readFile(full, "utf8");
  } catch {
    return null;
  }
}
