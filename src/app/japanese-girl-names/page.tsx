import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BROWSE_PAGE_SIZE, browseHref, parseBrowsePage, compareBrowseNames, toBrowseName } from "@/lib/browse";
import { FirstNameExplorer } from "@/components/names/FirstNameExplorer";
import { JsonLd } from "@/components/shared/JsonLd";
import { firstNames } from "@/data";

import { siteUrl } from "@/lib/seo";

const baseMetadata: Metadata = {
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

type Props = { params: Promise<{ page?: string }> };
const basePath = "/japanese-girl-names";
function getNames() {
  return firstNames.filter((name) => name.genders.includes("girl") && name.verificationStatus !== "needs_review").sort(compareBrowseNames);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parseBrowsePage((await params).page, getNames().length);
  if (!page) return { robots: { index: false } };
  const title = `${baseMetadata.title}${page > 1 ? ` – Page ${page}` : ""}`;
  return { ...baseMetadata, title, alternates: { canonical: browseHref(basePath, page) },
    openGraph: { ...baseMetadata.openGraph, title, url: browseHref(basePath, page) }, twitter: { ...baseMetadata.twitter, title } };
}
export default async function GirlNamesPage({ params }: Props) {
  const rawPage = (await params).page;
  const page = parseBrowsePage(rawPage, getNames().length);
  if (!page) notFound();
  if (rawPage === "1") permanentRedirect(basePath);
  const names = getNames();
  const detailPages = names.slice((page - 1) * BROWSE_PAGE_SIZE, page * BROWSE_PAGE_SIZE);
  return (
    <div className="container-page themed-page theme-sakura">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Japanese girl names",
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
        <h1 className="section-title">Japanese Girl Names with Meanings and Kanji</h1>
        <p className="mt-3 text-base leading-7 text-[#59645d]">
          Explore Japanese girl names with kanji, hiragana, romaji, and meaning
          notes. Compare written forms, listen to the reading, or keep a name
          while finding a surname to pair with it.
        </p>
        <Link
          className="mt-5 inline-flex font-bold text-[#315c4b] underline underline-offset-4"
          href="/?gender=girl#generator"
        >
          Use a girl name in the Japanese Name Generator
        </Link>
      </header>
      <FirstNameExplorer key={page} initialPage={page} gender="girl" names={names.map(toBrowseName)} />
      <p className="mt-4 text-sm leading-6 text-[#647068]">Editorial selection is a browsing order, not a popularity ranking. Style and usage estimates are editorial guidance. Dictionary notes do not establish a name’s intended meaning.</p>
      <section className="mt-16 max-w-3xl">
        <h2 className="section-title !text-3xl">Choosing a spelling, not just a sound</h2>
        <p className="mt-4 leading-7 text-[#59645d]">
          Japanese given names are often discussed by reading and written form.
          Two people called Rin may use different kanji, so a meaning belongs to
          a particular spelling rather than automatically to every person with
          that reading.
        </p>
        <p className="mt-4 leading-7 text-[#59645d]">
          For example, Hana written 花 points to a flower, while Hikari written
          光 points to light. Akari can be written 明里 or 灯 in this collection;
          the character explanation changes with the spelling. Compare the
          displayed kanji as well as the sound before choosing.
        </p>
      </section>
    </div>
  );
}
