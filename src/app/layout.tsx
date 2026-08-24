import type { Metadata } from "next";
import "@/app/globals.css";
import { GoogleAdsense } from "@/components/analytics/GoogleAdsense";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Japanese Name Generator with Kanji & Meanings",
    template: `%s | ${siteName}`,
  },
  description:
    "Generate Japanese male and female names with kanji, kana readings, romaji, and meanings. Create complete surname and given-name combinations.",
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
  openGraph: {
    type: "website",
    siteName,
    title: "Japanese Name Generator with Kanji & Meanings",
    description:
      "Generate Japanese full names with kanji, kana readings, romaji, and meanings.",
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Japanese Name Generator with Kanji & Meanings",
    description:
      "Generate Japanese full names with kanji, kana readings, romaji, and meanings.",
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
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <GoogleAdsense />
        {googleAnalyticsId ? (
          <GoogleAnalytics measurementId={googleAnalyticsId} />
        ) : null}
      </body>
    </html>
  );
}
