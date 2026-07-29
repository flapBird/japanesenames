import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/JsonLd";
import { SurnameExplorer } from "@/components/surnames/SurnameExplorer";
import { getIndexableSurnames } from "@/lib/names";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Japanese Last Names and Surnames: Meanings and Origins",
  description:
    "Explore Japanese last names, surnames, and family names with kanji meanings, origin types, evidence labels, and source-aware detail pages.",
  alternates: { canonical: "/japanese-last-names" },
  openGraph: {
    title: "Japanese Last Names and Surnames: Meanings and Origins",
    description: "Explore Japanese family-name meanings with careful origin labels.",
    url: "/japanese-last-names",
  },
  twitter: {
    card: "summary",
    title: "Japanese Last Names and Surnames: Meanings and Origins",
    description: "Explore Japanese family-name meanings with careful origin labels.",
  },
};

export default function LastNamesPage() {
  const surnames = getIndexableSurnames();
  return (
    <div className="container-page themed-page theme-moss">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Japanese last names and surnames",
          url: `${siteUrl}/japanese-last-names`,
          itemListElement: surnames.map((surname, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}/surname/${surname.slug}`,
            name: surname.romaji,
          })),
        }}
      />
      <header className="page-intro my-6">
        <p className="eyebrow">Family-name guide</p>
        <h1 className="section-title mt-2">Japanese Last Names &amp; Surnames</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#59645d]">
          Explore Japanese last names—also called Japanese surnames or family
          names—through their kanji, literal meanings, origin types, and
          evidence-aware stories. A shared spelling does not prove shared ancestry.
        </p>
      </header>
      <SurnameExplorer surnames={surnames} />
      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <article>
          <h2 className="section-title !text-3xl">What a literal meaning can tell us</h2>
          <p className="mt-4 leading-7 text-[#59645d]">
            Many Japanese family names use geographic vocabulary such as
            mountain, river, field, village, or bridge. That makes the written
            form interpretable, but it does not identify one birthplace or one
            founding family without additional records.
          </p>
        </article>
        <article>
          <h2 className="section-title !text-3xl">Why confidence labels matter</h2>
          <p className="mt-4 leading-7 text-[#59645d]">
            We separate well-documented history from common interpretation,
            multiple possible origins, literal-only explanation, and uncertainty.
            Regional maps appear only when a distribution source is attached.
          </p>
        </article>
      </section>
    </div>
  );
}
