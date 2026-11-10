import type { Metadata } from "next";
import Footer from "@/components/ui/Footer";
import { discoveryCallLink } from "@/lib/packages";

export const metadata: Metadata = { alternates: { canonical: "/web-design-jos" },
  title: "Web Design Jos · Plateau — Fixed-price SME websites",
  description:
    "Website design in Jos, Plateau State. Fixed-price landing pages and local business sites with WhatsApp booking. Based in Jos, serving Nigeria.",
};

export default function WebDesignJosPage() {
  return (
    <>
      <main className="min-h-screen bg-brand-deep pb-24 pt-24">
        <div className="mx-auto max-w-[720px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-link">
            Jos · Plateau
          </p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-tight text-brand-ink">
            Web design in Jos for SMEs that want enquiries
          </h1>
          <p className="mt-4 text-[17px] text-brand-muted">
            DoyinTech is based in Jos. We build fixed-price websites — not vague hourly quotes — so
            salons, clinics, property firms, lounges, and shops get a professional presence with
            WhatsApp as the booking path.
          </p>
          <ul className="mt-8 space-y-2 text-[15px] text-brand-soft">
            <li>✓ Landing page from ₦100,000</li>
            <li>✓ Local business site from ₦250,000</li>
            <li>✓ 50% deposit on Paystack · live in days to weeks</li>
            <li>✓ Free 3-minute audit of your current link</li>
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="/hire" className="rounded-full bg-brand-accent px-6 py-3 text-[14px] font-semibold text-black">See packages</a>
            <a href="/free-audit" className="rounded-full border border-brand-ink/20 px-6 py-3 text-[14px] font-semibold text-brand-ink">Free audit</a>
            <a href={discoveryCallLink()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-black">WhatsApp Jos team</a>
          </div>
          <p className="mt-8 text-[14px] text-brand-subtle">
            Also serving Abuja and nationwide remotely —{" "}
            <a href="/web-design-abuja" className="text-brand-link hover:underline">web design Abuja</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
