import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CookieConsent from "@/components/ui/CookieConsent";
import { ToastProvider } from "@/components/ui/Toast";
import PageTransition from "@/components/ui/PageTransition";
import SkipToContent from "@/components/ui/SkipToContent";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import ReferralCapture from "@/components/ui/ReferralCapture";
import MetaPixel from "@/components/analytics/MetaPixel";
import ConversionTracker from "@/components/analytics/ConversionTracker";
import OfflinePlayHint from "@/components/game/OfflinePlayHint";
import ServiceWorkerRegister from "@/components/game/ServiceWorkerRegister";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "DoyinTech — Websites, Systems & Digital Products for Growing Businesses",
    template: "%s | DoyinTech",
  },
  description:
    "Fixed-price websites that get enquiries, WhatsApp booking systems, free business tools, and digital products. 50% deposit · Secure Paystack · Live in days. Serving clients worldwide.",
  keywords: [
    "fixed price website",
    "WhatsApp business system",
    "business website design",
    "Paystack website",
    "landing page design",
    "backend engineering",
    "API development",
    "Flutter app development",
    "Laravel developer",
    "DoyinTech",
    "digital products",
    "student research project support",
    "SME website",
  ],
  authors: [{ name: "Silas Doyin Jonathan", url: SITE_URL }],
  creator: "DoyinTech",
  // No site-wide canonical: inherited by every page it told Google they were all the
  // homepage. Pages set their own via alternates.canonical. Share image: app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DoyinTech",
    title: "DoyinTech — Websites that get clients · Fixed price · Global",
    description:
      "Growth sites, WhatsApp systems, and digital products businesses actually buy. 50% deposit. Paystack. Live in days.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "DoyinTech — Websites that get clients",
    description:
      "Fixed-price websites, WhatsApp systems & digital products for businesses worldwide.",
    creator: "@doyintechnology",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DoyinTech",
  legalName: "DOYIN'S TECHNOLOGY",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  email: "hello@doyintech.com",
  telephone: "+2348085343926",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jos",
    addressRegion: "Plateau",
    addressCountry: "NG",
  },
  sameAs: [
    "https://www.youtube.com/@doyintechfoundation",
    "https://x.com/doyintechnology",
    "https://facebook.com/doyintechnology",
    "https://instagram.com/doyintechofficial",
    "https://www.tiktok.com/@doyintechfoundation",
  ],
  founder: {
    "@type": "Person",
    name: "Silas Doyin Jonathan",
  },
  areaServed: ["Worldwide", "NG", "US"],
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className={`${inter.variable} bg-black text-[#f5f5f7] antialiased`}>
        <ToastProvider>
          <SkipToContent />
          <Navbar />
          <PageTransition>
            <div id="main-content">{children}</div>
          </PageTransition>
          <WhatsAppButton />
          <OfflinePlayHint />
          <ServiceWorkerRegister />
          <CookieConsent />
          <ConversionTracker />
          <Suspense fallback={null}>
            <ReferralCapture />
            <MetaPixel />
          </Suspense>
          <Analytics />
        </ToastProvider>
      </body>
    </html>
  );
}
