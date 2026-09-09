import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { BROWSE_PAGE_SIZE, browseHref, parseBrowsePage, toBrowseSurname } from "@/lib/browse";
import { JsonLd } from "@/components/shared/JsonLd";
import { SurnameExplorer } from "@/components/surnames/SurnameExplorer";
import { getBrowseableSurnames } from "@/lib/names";
import { siteUrl } from "@/lib/seo";

const baseMetadata: Metadata = {
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

type Props = { params: Promise<{ page?: string }> };
const basePath = "/japanese-last-names";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parseBrowsePage((await params).page, getBrowseableSurnames().length);
  if (!page) return { robots: { index: false } };
  const title = `${baseMetadata.title}${page > 1 ? ` – Page ${page}` : ""}`;
  return { ...baseMetadata, title, alternates: { canonical: browseHref(basePath, page) },
    openGraph: { ...baseMetadata.openGraph, title, url: browseHref(basePath, page) }, twitter: { ...baseMetadata.twitter, title } };
}
export default async function LastNamesPage({ params }: Props) {
  const surnames = getBrowseableSurnames().sort((a, b) => Number(b.isIndexable) - Number(a.isIndexable) || a.romaji.localeCompare(b.romaji));
  const rawPage = (await params).page;
  const page = parseBrowsePage(rawPage, surnames.length);
  if (!page) notFound();
  if (rawPage === "1") permanentRedirect(basePath);
  const indexableSurnames = surnames.slice((page - 1) * BROWSE_PAGE_SIZE, page * BROWSE_PAGE_SIZE);
  return (
    <div className="container-page themed-page theme-moss">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Japanese last names and surnames",
          url: `${siteUrl}${browseHref(basePath, page)}`,
          itemListElement: indexableSurnames.map((surname, index) => ({
            "@type": "ListItem",
            position: (page - 1) * BROWSE_PAGE_SIZE + index + 1,
            ...(surname.isIndexable ? { url: `${siteUrl}/surname/${surname.slug}` } : {}),
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
      <SurnameExplorer key={page} initialPage={page} surnames={surnames.map(toBrowseSurname)} />
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
        <h2 className="text-xl font-semibold">Find a surname, then try a full name</h2>
        <p className="mt-3 leading-7 text-[#59645d]">
          Search by kanji, hiragana, or romaji to find a family name. Use the
          page links to browse the full collection, or choose “Use in generator”
          to keep a surname while trying different given names. Origin stories
          explain the available historical evidence separately from literal
          character meanings.
        </p>
      </section>
    </div>
  );
}
