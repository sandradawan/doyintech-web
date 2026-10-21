import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DoyinStore admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="min-h-screen bg-[#070b12] text-[#94a3b8] p-10">Loading admin…</div>}>{children}</Suspense>;
}
