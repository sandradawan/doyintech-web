import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/resources";
import ResourceManager from "@/components/admin/crm/ResourceManager";

type Props = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = getResource((await params).resource);
  return { title: r?.label || "Records" };
}

export default async function ResourcePage({ params }: Props) {
  const r = getResource((await params).resource);
  if (!r) notFound();
  return (
    <Suspense fallback={<p className="text-[13px] text-[#86868b]">Loading…</p>}>
      <ResourceManager key={r.id} resource={r} />
    </Suspense>
  );
}
