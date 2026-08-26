import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Practical AI Automation for SMEs (Not Hype)",
};

export default function Post() {
  return (
    <>
      <main className="pt-32 pb-24">
        <article className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-sm text-primary hover:underline">
            ← Back to Blog
          </Link>
          <p className="mt-8 text-sm text-primary font-medium">AI Automation · August 2026</p>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold text-white leading-tight">
            Practical AI Automation for SMEs (Not Hype)
          </h1>
          <div className="mt-10 space-y-6 text-gray-300 leading-relaxed">
            <p>
              You do not need a research team to benefit from AI. Many small and medium businesses can automate repetitive work today with focused tools and simple integrations.
            </p>
            <p>
              Common high-ROI areas include lead qualification, customer support replies, document processing, internal reporting, and data entry between systems.
            </p>
            <p>
              The key is starting with a clear process that already exists, measuring the time it consumes, and then designing a reliable automation around it — not chasing every new AI trend.
            </p>
            <p>
              DoyinTech helps businesses identify practical automation opportunities and implement them with proper security and maintainability.
            </p>
            <div className="pt-6">
              <a
                href="/contact"
                className="inline-flex px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Explore automation for your business
              </a>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
