import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FirstNameExplorer } from "@/components/names/FirstNameExplorer";
import { JsonLd } from "@/components/shared/JsonLd";
import { firstNames } from "@/data";
import { breadcrumbJsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Japanese Boy Names with Meanings and Kanji",
  description:
    "Browse Japanese boy names by meaning, style, popularity, and kanji length. Compare recommended kanji, hiragana, and naturalness.",
  alternates: { canonical: "/japanese-boy-names" },
  openGraph: {
    title: "Japanese Boy Names with Meanings and Kanji",
    description: "Explore structured Japanese boy-name readings and kanji spellings.",
    url: "/japanese-boy-names",
  },
  twitter: {
    card: "summary",
    title: "Japanese Boy Names with Meanings and Kanji",
    description: "Explore structured Japanese boy-name readings and kanji spellings.",
  },
};

export default function BoyNamesPage() {
  const names = firstNames.filter(
    (name) =>
      name.genders.includes("boy") &&
      name.verificationStatus !== "needs_review",
  );
  return (
    <div className="container-page">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Japanese Boy Names", path: "/japanese-boy-names" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Japanese boy names",
          url: `${siteUrl}/japanese-boy-names`,
          itemListElement: names.map((name, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}/name/${name.slug}`,
            name: name.romaji,
          })),
        }}
      />
      <Breadcrumbs items={[{ label: "Japanese Boy Names" }]} />
      <header className="max-w-3xl py-8">
        <p className="eyebrow">Given-name guide</p>
        <h1 className="section-title mt-2">Japanese Boy Names with Meanings and Kanji</h1>
        <p className="mt-4 text-base leading-7 text-[#59645d]">
          Browse Japanese boy names with recommended kanji, hiragana, meaning
          tags, era labels, and transparent naturalness notes.
        </p>
      </header>
      <FirstNameExplorer gender="boy" names={names} />
      <section className="mt-16 max-w-3xl">
        <h2 className="section-title !text-3xl">Readings and kanji variations</h2>
        <p className="mt-4 leading-7 text-[#59645d]">
          A familiar reading may have several written forms. We show a concise
          recommended form in the list and keep spelling-specific meanings on
          the detail page so distinct variations are not flattened together.
        </p>
      </section>
    </div>
  );
}
