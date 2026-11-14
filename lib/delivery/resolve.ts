import { DIGITAL_PRODUCTS } from "@/lib/products";
import { findAnyEbook } from "@/lib/ebooks-catalog";
import path from "path";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

export type ResolvedDelivery = {
  productId: string;
  productName: string;
  mdPaths: string[];
  kind: "digital" | "ebook" | "other";
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
      mdPaths: paths.filter((p) => /\.(md|csv|txt|xlsx|pptx)$/.test(p)),
      kind: "digital",
    };
  }

  const ebook = findAnyEbook(productId);
  if (ebook) {
    const paths: string[] = [];
    const candidates = [`/ebooks/${ebook.slug}.md`, `/digital-products/${ebook.slug}.md`];
    for (const c of candidates) {
      if (productFileExists(c)) paths.push(c);
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

/**
 * Paid files live in /private (not web-served) and are only read here after a
 * delivery token is verified. Paths keep their historical "/digital-products/..." form.
 */
const FILE_ROOTS = ["private", "public"];

function locateProductFile(webPath: string): string | null {
  const rel = path.normalize(webPath.replace(/^\/+/, ""));
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  for (const root of FILE_ROOTS) {
    const base = path.join(process.cwd(), root);
    const full = path.join(base, rel);
    if (full.startsWith(base + path.sep) && existsSync(full)) return full;
  }
  return null;
}

function productFileExists(webPath: string): boolean {
  return locateProductFile(webPath) !== null;
}

/** Binary files (Excel workbooks) are delivered as-is, never folded into the text/PDF pack. */
export function isBinaryProductFile(webPath: string): boolean {
  return /\.(xlsx|pptx)$/.test(webPath);
}

const BINARY_TYPES: Record<string, string> = {
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export function binaryContentType(webPath: string): string {
  return BINARY_TYPES[webPath.split(".").pop() || ""] || "application/octet-stream";
}

export async function readProductFileBuffer(webPath: string): Promise<Buffer | null> {
  const full = locateProductFile(webPath);
  if (!full) return null;
  try {
    return await readFile(full);
  } catch {
    return null;
  }
}

export async function readPublicFile(webPath: string): Promise<string | null> {
  if (isBinaryProductFile(webPath)) return null;
  const full = locateProductFile(webPath);
  if (!full) return null;
  try {
    return await readFile(full, "utf8");
  } catch {
    return null;
  }
}
