import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BROWSE_PAGE_SIZE, browseHref, parseBrowsePage, compareBrowseNames, toBrowseName } from "@/lib/browse";
import { FirstNameExplorer } from "@/components/names/FirstNameExplorer";
import { JsonLd } from "@/components/shared/JsonLd";
import { firstNames } from "@/data";

import { siteUrl } from "@/lib/seo";

const baseMetadata: Metadata = {
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

type Props = { params: Promise<{ page?: string }> };
const basePath = "/japanese-boy-names";
function getNames() {
  return firstNames.filter((name) => name.genders.includes("boy") && name.verificationStatus !== "needs_review").sort(compareBrowseNames);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parseBrowsePage((await params).page, getNames().length);
  if (!page) return { robots: { index: false } };
  const title = `${baseMetadata.title}${page > 1 ? ` – Page ${page}` : ""}`;
  return { ...baseMetadata, title, alternates: { canonical: browseHref(basePath, page) },
    openGraph: { ...baseMetadata.openGraph, title, url: browseHref(basePath, page) }, twitter: { ...baseMetadata.twitter, title } };
}
export default async function BoyNamesPage({ params }: Props) {
  const rawPage = (await params).page;
  const page = parseBrowsePage(rawPage, getNames().length);
  if (!page) notFound();
  if (rawPage === "1") permanentRedirect(basePath);
  const names = getNames();
  const detailPages = names.slice((page - 1) * BROWSE_PAGE_SIZE, page * BROWSE_PAGE_SIZE);
  return (
    <div className="container-page themed-page theme-indigo">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Japanese boy names",
          url: `${siteUrl}${browseHref(basePath, page)}`,
          itemListElement: detailPages.map((name, index) => ({
            "@type": "ListItem",
            position: (page - 1) * BROWSE_PAGE_SIZE + index + 1,
            ...(name.isIndexable ? { url: `${siteUrl}/name/${name.slug}` } : {}),
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
          href="/?gender=boy#generator"
        >
          Use a boy name in the Japanese Name Generator
        </Link>
      </header>
      <FirstNameExplorer key={page} initialPage={page} gender="boy" names={names.map(toBrowseName)} />
      <p className="mt-4 text-sm leading-6 text-[#647068]">Editorial selection is a browsing order, not a popularity ranking. Style and usage estimates are editorial guidance. Dictionary notes do not establish a name’s intended meaning.</p>
      <section className="mt-16 max-w-3xl">
        <h2 className="section-title !text-3xl">Readings and kanji variations</h2>
        <p className="mt-4 leading-7 text-[#59645d]">
          A familiar reading may have several written forms. We show a concise
          recommended form in the list and keep spelling-specific meanings on
          the detail page so distinct variations are not flattened together.
        </p>
        <p className="mt-4 leading-7 text-[#59645d]">
          Ren written 蓮 uses the character for lotus, while Takumi written 匠
          points to an artisan. Haruto written 陽翔 combines characters associated
          with sunlight and soaring. These written-form notes do not establish
          a particular person’s naming intention. Use a name in the generator
          to compare how it reads alongside different surnames.
        </p>
      </section>
    </div>
  );
}
