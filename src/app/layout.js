import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
export const metadata = {
  metadataBase: new URL("http://localhost:3000"), // Change to https://zedxsmp.fun when live!
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
    url: "https://zedxsmp.fun",
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// 2. Viewport Configuration
export const viewport = {
  themeColor: "#9333ea",
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
      <body className="bg-black text-white antialiased selection:bg-purple-600/30 selection:text-purple-200">
        <div className="min-h-screen flex flex-col bg-dark-zedx">
          {children}
        </div>
      </body>
    </html>
  );
}
