"use client";

import { usePathname } from "next/navigation";
import RelatedLinks from "@/components/ui/RelatedLinks";
import { TOOLS_META } from "@/lib/tools/config";

/**
 * Six links at the foot of every tool page: three from the same category and the next three in
 * the list. Following the list guarantees every tool is linked from another tool's page.
 */
export default function RelatedTools() {
  const pathname = usePathname();
  const here = TOOLS_META.findIndex((t) => t.href === pathname);
  const ring = [...TOOLS_META.slice(here + 1), ...TOOLS_META.slice(0, Math.max(here, 0))].filter((t) => t.href !== pathname);
  const next = ring.slice(0, 3);
  const category = here >= 0 ? TOOLS_META[here].category : null;
  const same = ring.filter((t) => t.category === category && !next.includes(t)).slice(0, 3);
  const links = [...same, ...next, ...ring.slice(3)].filter((t, i, all) => all.indexOf(t) === i).slice(0, 6);
  return <RelatedLinks heading="More free tools" links={links.map((t) => ({ href: t.href, label: t.title }))} />;
}
