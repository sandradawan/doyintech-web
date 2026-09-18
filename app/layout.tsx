import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CookieConsent from "@/components/ui/CookieConsent";
import ChatBot from "@/components/ui/ChatBot";
import { ToastProvider } from "@/components/ui/Toast";
import PageTransition from "@/components/ui/PageTransition";
import MobileStickyCta from "@/components/ui/MobileStickyCta";
import SkipToContent from "@/components/ui/SkipToContent";
import ExitOffer from "@/components/ui/ExitOffer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://doyintech.vercel.app"),
  title: {
    default:
      "DoyinTech — Websites, WhatsApp Systems & Digital Products for Nigerian SMEs",
    template: "%s | DoyinTech",
  },
  description:
    "Fixed-price websites that get enquiries, WhatsApp booking systems, free SME tools, and digital products. 50% deposit · Paystack · Live in days. Based in Jos, Nigeria.",
  keywords: [
    "website design Nigeria",
    "fixed price website",
    "WhatsApp business system",
    "SME website Jos",
    "Paystack website",
    "landing page Nigeria",
    "backend engineering",
    "API development",
    "Flutter app Nigeria",
    "Laravel developer",
    "DoyinTech",
    "business website Nigeria",
    "digital products Nigeria",
  ],
  authors: [{ name: "Silas Doyin Jonathan", url: "https://doyintech.vercel.app" }],
  creator: "DoyinTech",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "DoyinTech",
    title:
      "DoyinTech — Websites that get clients · Fixed price · Nigeria",
    description:
      "Growth sites, WhatsApp systems, and digital products SMEs actually buy. 50% deposit. Paystack. Live in days.",
    url: "https://doyintech.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoyinTech — Websites that get clients",
    description:
      "Fixed-price websites, WhatsApp systems & digital products for Nigerian SMEs.",
    creator: "@doyintechnology",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DoyinTech",
  legalName: "DOYIN'S TECHNOLOGY",
  url: "https://doyintech.vercel.app",
  logo: "https://doyintech.vercel.app/logo.png",
  email: "doyintechnology@outlook.com",
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
  areaServed: "NG",
  priceRange: "₦₦",
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
      </head>
      <body className={`${inter.variable} bg-black text-[#f5f5f7] antialiased`}>
        <ToastProvider>
          <SkipToContent />
          <Navbar />
          <PageTransition>
            <div id="main-content">{children}</div>
          </PageTransition>
          <MobileStickyCta />
          <ExitOffer />
          <ChatBot />
          <WhatsAppButton />
          <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  );
}
