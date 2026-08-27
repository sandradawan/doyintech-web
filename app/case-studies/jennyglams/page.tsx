import Footer from "@/components/ui/Footer";
import Link from "next/link";

export const metadata = {
  title: "Case Study — JennyGlams Makeup Artistry",
  description:
    "Portfolio and booking website for JennyGlams — Jos-based makeup artist specialising in bridal, soft glam and editorial looks.",
};

export default function JennyGlamsCaseStudy() {
  return (
    <>
      <main className="pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/portfolio" className="text-sm text-primary hover:underline">
            ← Back to Portfolio
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-wider text-primary">
            Case Study
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold text-white leading-tight">
            JennyGlams — Makeup Artistry Brand
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            An elegant portfolio and booking site that turns social followers into booked clients.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Next.js", "Portfolio", "Booking", "Brand Site"].map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-12 space-y-10 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">The Challenge</h2>
              <p>
                Jennifer needed more than Instagram posts. Clients wanted a professional place to view work, understand services (bridal, soft glam, editorial, masterclasses), and book without long back-and-forth in DMs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">The Solution</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Clean, feminine portfolio layout optimised for photos</li>
                <li>Clear service categories and pricing pathways</li>
                <li>WhatsApp-first booking so clients can reserve in minutes</li>
                <li>Mobile-first design for clients browsing on the go</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Results</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Professional brand presence beyond social media</li>
                <li>Faster path from discovery to booking</li>
                <li>A site the artist can share with brides, stylists and collaborators</li>
              </ul>
            </section>

            <div className="pt-6 flex flex-wrap gap-4">
              <a
                href="https://jennyglams.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
              >
                Visit Live Site
              </a>
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition"
              >
                Start a Similar Project
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
