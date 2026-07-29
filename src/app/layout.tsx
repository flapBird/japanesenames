import type { Metadata } from "next";
import "@/app/globals.css";
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
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
