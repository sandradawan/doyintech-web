import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CookieConsent from "@/components/ui/CookieConsent";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://doyintech.vercel.app"),
  title: {
    default: "DoyinTech — Scalable Backend, APIs & Mobile Development",
    template: "%s | DoyinTech",
  },
  description:
    "DoyinTech builds secure backend systems, scalable APIs, and high-quality mobile applications designed for performance and growth. Based in Jos, Nigeria.",
  keywords: [
    "backend engineering",
    "API development",
    "mobile development",
    "Flutter",
    "Laravel",
    "system architecture",
    "AI automation",
    "Nigeria tech",
    "DoyinTech",
  ],
  authors: [{ name: "Silas Doyin Jonathan", url: "https://doyintech.vercel.app" }],
  creator: "DoyinTech",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "DoyinTech",
    title: "DoyinTech — Scalable Backend, APIs & Mobile Development",
    description:
      "Premium engineering, clean architecture, and production-ready delivery — built for real business outcomes.",
    url: "https://doyintech.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoyinTech — Scalable Backend, APIs & Mobile Development",
    description:
      "Premium engineering, clean architecture, and production-ready delivery.",
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
      <body
        className={`${inter.variable} ${space.variable} bg-[#0B0E14] text-[#E5E7EB] antialiased`}
      >
        <Navbar />
        {children}
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  );
}
