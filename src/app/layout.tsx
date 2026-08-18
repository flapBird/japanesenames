import type { Metadata } from "next";
import Script from "next/script";
import "@/app/globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Japanese Name Generator with Meanings & Surname Origins",
    template: `%s | ${siteName}`,
  },
  description:
    "Generate authentic Japanese names with kanji, meanings, pronunciation, and surname origins. Explore Japanese girl names, boy names, and family names.",
  applicationName: siteName,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/japanese-names-icon.svg", type: "image/svg+xml" },
      {
        url: "/japanese-names-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/japanese-names-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    title: "Japanese Name Generator with Meanings & Surname Origins",
    description:
      "Generate structured Japanese names and explore kanji meanings and surname stories.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Japanese Names",
    description:
      "Generate structured Japanese names and explore kanji meanings and surname stories.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const configuredGoogleAnalyticsId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  const googleAnalyticsId =
    configuredGoogleAnalyticsId &&
    /^G-[A-Z0-9]+$/i.test(configuredGoogleAnalyticsId)
      ? configuredGoogleAnalyticsId
      : undefined;

  return (
    <html lang="en">
      <head>
        <Script
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4183802444188513"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        {googleAnalyticsId ? (
          <GoogleAnalytics measurementId={googleAnalyticsId} />
        ) : null}
      </body>
    </html>
  );
}
