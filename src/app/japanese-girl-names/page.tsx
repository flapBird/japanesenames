import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BROWSE_PAGE_SIZE, browseHref, parseBrowsePage, compareBrowseNames, toBrowseName } from "@/lib/browse";
import { FirstNameExplorer } from "@/components/names/FirstNameExplorer";
import { JsonLd } from "@/components/shared/JsonLd";
import { TopPicksSection } from "@/components/shared/TopPicksSection";
import { firstNames } from "@/data";
import { topGirlPicks } from "@/data/top-picks";

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

const girlFaq = [
  {
    question: "What are the most popular Japanese girl names right now?",
    answer:
      "Recent national surveys of newborns put Himari (陽葵), Rin (凛), Aoi (葵), Hina (陽菜), Yuna (結菜), and Sakura (咲良/桜) at the top for girls. The explorer below covers the full collection; the most-popular-names guide explains how Japan's rankings work.",
  },
  {
    question: "Which Japanese girl names mean flower or beauty?",
    answer:
      "Hana (花) means flower, Sakura (桜) means cherry blossom, Momoka (桃花) means peach blossom, and Himari (陽葵) pairs the sun with the hollyhock. Names built on 美 (beauty) include Mika (美香) and Miyuki (美雪, beautiful snow).",
  },
  {
    question: "Do Japanese girl names have fixed meanings?",
    answer:
      "No — the meaning attaches to the kanji spelling, not the sound. The reading Rin can be 凛 (dignified composure) or 琳 (beautiful jewel). Always compare written forms; every entry below shows the kanji next to the reading.",
  },
  {
    question: "What Japanese girl names are easy to pronounce in English?",
    answer:
      "Hana, Mei, Mika, Rina, Emi, and Yuna all pronounce nearly identically in both languages. The bilingual-names guide covers the full list with pronunciation notes.",
  },
] as const;

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
          "@type": "FAQPage",
          mainEntity: girlFaq.map((item) => ({
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
      <TopPicksSection
        title="Twelve Japanese girl names to start with"
        intro="Hand-picked entries from this collection — each card links to a full detail page with kanji breakdowns, sources, and full-name pairings."
        entries={topGirlPicks}
      />
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
      <section className="mt-14 max-w-3xl">
        <h2 className="section-title !text-3xl">Japanese girl names: questions and answers</h2>
        <div className="mt-6 grid gap-4">
          {girlFaq.map((item) => (
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
          <Link className="surface block p-5 transition hover:border-[#aac0b1]" href="/articles/names-meaning-flower">
            <span className="block font-semibold">Japanese names meaning flower</span>
            <span className="mt-2 block text-sm leading-6 text-[#59645d]">Sakura, Hana, Momoka, Kaede, and 22 more floral names with their written forms.</span>
          </Link>
          <Link className="surface block p-5 transition hover:border-[#aac0b1]" href="/articles/japanese-names-that-work-in-english">
            <span className="block font-semibold">Names that work in English</span>
            <span className="mt-2 block text-sm leading-6 text-[#59645d]">24 bilingual-friendly names and how each one travels between the two languages.</span>
          </Link>
          <Link className="surface block p-5 transition hover:border-[#aac0b1]" href="/articles/unisex-japanese-names">
            <span className="block font-semibold">Unisex Japanese names</span>
            <span className="mt-2 block text-sm leading-6 text-[#59645d]">Ren, Aoi, Hikaru, and 21 more names that register for any gender.</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
