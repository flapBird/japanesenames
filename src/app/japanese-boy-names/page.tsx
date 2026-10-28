import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BROWSE_PAGE_SIZE, browseHref, parseBrowsePage, compareBrowseNames, toBrowseName } from "@/lib/browse";
import { FirstNameExplorer } from "@/components/names/FirstNameExplorer";
import { JsonLd } from "@/components/shared/JsonLd";
import { TopPicksSection } from "@/components/shared/TopPicksSection";
import { firstNames } from "@/data";
import { topBoyPicks } from "@/data/top-picks";

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

const boyFaq = [
  {
    question: "What are the most popular Japanese boy names right now?",
    answer:
      "Recent national surveys of newborns put the readings Ao (蒼/碧), Haruto (陽翔), Sota (蒼太/颯太), Minato (湊), and Ren (蓮) at the top for boys. The explorer below covers the full collection; the most-popular-names guide explains how Japan's rankings pool spellings into readings.",
  },
  {
    question: "Which Japanese boy names mean strong or light?",
    answer:
      "Kenji (健二) carries the healthy-and-strong character 健, Takeshi (武) means martial strength, and Takumi (匠) means master artisan. For light: Koki (光輝) is light plus radiance, and Haruto (陽翔) pairs the sun with soaring flight.",
  },
  {
    question: "Why do Japanese boy names end in -to, -ta, -ki, and -suke?",
    answer:
      "Those endings are masculine phonetic patterns, not rules: -to and -ta names (Haruto, Sota, Kenta) read as boy names, -ki endings (Haruki, Daiki) sound bright, and -suke (Daisuke, Keisuke) is a classical masculine suffix. Nothing in the law restricts endings to a gender.",
  },
  {
    question: "Can a Japanese boy name also be a girl name?",
    answer:
      "Yes. Ren, Aoi, Minato, Hinata, and Hikaru all register for both boys and girls, and several chart in both top-20 lists at once. The unisex-names guide explains how the gender lean works.",
  },
] as const;

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
          "@type": "FAQPage",
          mainEntity: boyFaq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
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
      <TopPicksSection
        title="Twelve Japanese boy names to start with"
        intro="Hand-picked entries from this collection — each card links to a full detail page with kanji breakdowns, sources, and full-name pairings."
        entries={topBoyPicks}
      />
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
      <section className="mt-14 max-w-3xl">
        <h2 className="section-title !text-3xl">Japanese boy names: questions and answers</h2>
        <div className="mt-6 grid gap-4">
          {boyFaq.map((item) => (
            <details className="surface p-5" key={item.question}>
              <summary className="cursor-pointer font-semibold">{item.question}</summary>
              <p className="mt-3 text-sm leading-6 text-[#59645d]">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="mt-14 max-w-3xl">
        <h2 className="section-title !text-3xl">Keep exploring</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link className="surface block p-5 transition hover:border-[#aac0b1]" href="/articles/most-popular-japanese-names">
            <span className="block font-semibold">The most popular Japanese names</span>
            <span className="mt-2 block text-sm leading-6 text-[#59645d]">The readings topping Japan’s recent newborn rankings, with kanji and meanings for each.</span>
          </Link>
          <Link className="surface block p-5 transition hover:border-[#aac0b1]" href="/articles/names-meaning-light">
            <span className="block font-semibold">Japanese names meaning light</span>
            <span className="mt-2 block text-sm leading-6 text-[#59645d]">Hikari, Akari, Haruto, Koki, and 18 more names built on light and sun kanji.</span>
          </Link>
          <Link className="surface block p-5 transition hover:border-[#aac0b1]" href="/articles/japanese-anime-names">
            <span className="block font-semibold">Japanese anime names</span>
            <span className="mt-2 block text-sm leading-6 text-[#59645d]">Which anime character names are real, registerable names — and which exist only in fiction.</span>
          </Link>
          <Link className="surface block p-5 transition hover:border-[#aac0b1]" href="/articles/how-japanese-names-work">
            <span className="block font-semibold">How Japanese names work</span>
            <span className="mt-2 block text-sm leading-6 text-[#59645d]">Surname order, legal kanji, unregulated readings, and the customs behind it all.</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
