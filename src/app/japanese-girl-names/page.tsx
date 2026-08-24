import type { Metadata } from "next";
import Link from "next/link";
import { FirstNameExplorer } from "@/components/names/FirstNameExplorer";
import { JsonLd } from "@/components/shared/JsonLd";
import { firstNames } from "@/data";
import { getIndexableFirstNames } from "@/lib/names";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Japanese Girl Names with Meanings and Kanji",
  description:
    "Browse Japanese girl names by meaning, style, popularity, and kanji length. See recommended kanji, hiragana, and clear meaning notes.",
  alternates: { canonical: "/japanese-girl-names" },
  openGraph: {
    title: "Japanese Girl Names with Meanings and Kanji",
    description: "Explore structured Japanese girl-name readings and kanji spellings.",
    url: "/japanese-girl-names",
  },
  twitter: {
    card: "summary",
    title: "Japanese Girl Names with Meanings and Kanji",
    description: "Explore structured Japanese girl-name readings and kanji spellings.",
  },
};

export default function GirlNamesPage() {
  const names = firstNames.filter(
    (name) =>
      name.genders.includes("girl") &&
      name.verificationStatus !== "needs_review",
  );
  const detailPages = getIndexableFirstNames().filter((name) =>
    name.genders.includes("girl"),
  );
  return (
    <div className="container-page themed-page theme-sakura">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Japanese girl names",
          url: `${siteUrl}/japanese-girl-names`,
          itemListElement: detailPages.map((name, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}/name/${name.slug}`,
            name: name.romaji,
          })),
        }}
      />
      <header className="page-intro my-6">
        <h1 className="section-title">Japanese Girl Names with Meanings and Kanji</h1>
        <p className="mt-3 text-base leading-7 text-[#59645d]">
          Browse source-backed Japanese girl names by meaning, style,
          commonness, and written length. Each result shows a recommended kanji
          spelling, hiragana reading, romaji, and a spelling-specific meaning;
          only editorially expanded records link to a separate detail page.
        </p>
        <Link
          className="mt-5 inline-flex font-bold text-[#315c4b] underline underline-offset-4"
          href="/#generator"
        >
          Use a girl name in the Japanese Name Generator
        </Link>
      </header>
      <FirstNameExplorer gender="girl" names={names} />
      <section className="mt-16 max-w-3xl">
        <h2 className="section-title !text-3xl">Choosing a spelling, not just a sound</h2>
        <p className="mt-4 leading-7 text-[#59645d]">
          Japanese given names are often discussed by reading and written form.
          Two people called Rin may use different kanji, so a meaning belongs to
          a particular spelling rather than automatically to every person with
          that reading.
        </p>
        <p className="mt-4 leading-7 text-[#59645d]">
          The list keeps many verified readings together on this hub rather
          than turning every database record into a thin search page. Use the
          filters to compare themes and written forms, then send a choice to the
          full-name generator to pair it with a Japanese surname.
        </p>
      </section>
    </div>
  );
}
