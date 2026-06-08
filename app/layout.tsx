import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
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
    "system architecture",
    "Nigeria tech",
    "DoyinTech",
  ],
  authors: [{ name: "Silas Doyin Jonathan", url: "https://doyintech.com" }],
  creator: "DoyinTech",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "DoyinTech",
    title: "DoyinTech — Scalable Backend, APIs & Mobile Development",
    description:
      "Premium engineering, clean architecture, and production-ready delivery — built for real business outcomes.",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${space.variable} bg-[#0B0E14] text-[#E5E7EB] antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
