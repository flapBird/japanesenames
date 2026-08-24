import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/shared/JsonLd";
import { SurnameExplorer } from "@/components/surnames/SurnameExplorer";
import { getBrowseableSurnames, getIndexableSurnames } from "@/lib/names";
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
  const surnames = getBrowseableSurnames();
  const indexableSurnames = getIndexableSurnames();
  return (
    <div className="container-page themed-page theme-moss">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Japanese last names and surnames",
          url: `${siteUrl}/japanese-last-names`,
          itemListElement: indexableSurnames.map((surname, index) => ({
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
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="button-primary" href="/japanese-last-name-generator">
            Generate a Japanese last name
          </Link>
          <Link className="button-secondary" href="/#generator">
            Create a complete Japanese name
          </Link>
        </div>
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
      <section className="mt-12 max-w-4xl rounded-2xl border border-[#d9ddd6] bg-[#f3f4ef] p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Browse records without multiplying thin pages</h2>
        <p className="mt-3 leading-7 text-[#59645d]">
          This hub keeps kanji, kana, romaji, short meanings, and available data
          labels together for a broad set of Japanese surnames. A surname links
          to its own story only when that page has enough reviewed context and
          sources; the remaining records stay useful here and in the surname
          generator without entering the sitemap as standalone URLs.
        </p>
      </section>
    </div>
  );
}
