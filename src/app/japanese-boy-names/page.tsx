import type { Metadata } from "next";
import Link from "next/link";
import { FirstNameExplorer } from "@/components/names/FirstNameExplorer";
import { JsonLd } from "@/components/shared/JsonLd";
import { firstNames } from "@/data";
import { getIndexableFirstNames } from "@/lib/names";
import { siteUrl } from "@/lib/seo";

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
  const detailPages = getIndexableFirstNames().filter((name) =>
    name.genders.includes("boy"),
  );
  return (
    <div className="container-page themed-page theme-indigo">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Japanese boy names",
          url: `${siteUrl}/japanese-boy-names`,
          itemListElement: detailPages.map((name, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}/name/${name.slug}`,
            name: name.romaji,
          })),
        }}
      />
      <header className="page-intro my-6">
        <h1 className="section-title">Japanese Boy Names with Meanings and Kanji</h1>
        <p className="mt-3 text-base leading-7 text-[#59645d]">
          Browse source-backed Japanese boy names with recommended kanji,
          hiragana readings, romaji, meaning notes, style labels, and
          transparent commonness information.
        </p>
        <Link
          className="mt-5 inline-flex font-bold text-[#315c4b] underline underline-offset-4"
          href="/#generator"
        >
          Use a boy name in the Japanese Name Generator
        </Link>
      </header>
      <FirstNameExplorer gender="boy" names={names} />
      <section className="mt-16 max-w-3xl">
        <h2 className="section-title !text-3xl">Readings and kanji variations</h2>
        <p className="mt-4 leading-7 text-[#59645d]">
          A familiar reading may have several written forms. We show a concise
          recommended form in the list and keep spelling-specific meanings on
          the detail page so distinct variations are not flattened together.
        </p>
        <p className="mt-4 leading-7 text-[#59645d]">
          This hub keeps verified readings and written forms browseable on one
          substantial page. Only a small editorial set receives a separate
          detail URL; every listed record can still be used in the complete
          Japanese name generator.
        </p>
      </section>
    </div>
  );
}
