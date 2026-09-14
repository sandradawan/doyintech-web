import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { TemplateCard } from "@/components/shop/TemplateShop";
import { PAGE_TEMPLATES } from "@/lib/page-templates";

export const metadata: Metadata = {
  title: "Next.js Templates — Buy & build",
  description:
    "Full page templates for agencies, local businesses, SaaS waitlists, portfolios, and digital product sales pages.",
};

export default function TemplatesPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0a0e17] pb-24 pt-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#ff8c14]">
            Page templates
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-white sm:text-[44px]">
            Next.js templates
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[#a1a1a6]">
            Full landing and multi-page kits. Preview the outline free. Pay once, unlock the build
            guide and structure.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PAGE_TEMPLATES.map((item) => (
              <TemplateCard key={item.id} item={item} />
            ))}
          </div>
          <p className="mt-10 text-center text-[14px] text-[#86868b]">
            Need components only?{" "}
            <a href="/components" className="text-[#ff8c14] hover:underline">
              Browse UI components
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
