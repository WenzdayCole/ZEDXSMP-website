import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "./providers";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// 1. Metadata Configuration
const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ZEDX SMP | The Ultimate Vanilla+ Experience",
    template: "%s | ZEDX SMP",
  },
  description:
    "Join ZEDX SMP at zedxsmp.fun. A premium Minecraft community featuring custom ranks, balanced economy, and a grief-free environment.",
  keywords: [
    "Minecraft",
    "SMP",
    "Vanilla Plus",
    "ZEDX",
    "Minecraft Server",
    "zedxsmp.fun",
  ],
  openGraph: {
    title: "ZEDX SMP",
    description:
      "The most immersive Vanilla+ Minecraft experience. Join us today!",
    url: "https://shop.zedxsmp.fun",
    siteName: "ZEDX SMP",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

// 2. Viewport Configuration
export const viewport = {
  themeColor: "#9333ea",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      // Added data-scroll-behavior to fix the Next.js console warning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-[#050208] text-white antialiased selection:bg-purple-600/30 selection:text-purple-200">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
