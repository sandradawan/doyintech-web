import type { Metadata } from "next";
import SellerDashboard from "@/components/storefront/SellerDashboard";

export const metadata: Metadata = {
  title: "Your shop dashboard",
  robots: { index: false, follow: false },
};

export default function StoreDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0a0e17] px-5 pb-24 pt-28">
      <div className="mx-auto max-w-[860px]">
        <h1 className="mb-6 text-[28px] font-semibold tracking-tight text-white">Your shop</h1>
        <SellerDashboard />
      </div>
    </main>
  );
}
