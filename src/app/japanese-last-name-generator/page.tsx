import type { Metadata } from "next";
import Link from "next/link";
import { SurnameGenerator, type SurnameGeneratorRecord } from "@/components/generator/SurnameGenerator";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { getBrowseableSurnames } from "@/lib/names";
import { breadcrumbJsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Japanese Last Name Generator – Surnames with Meanings",
  description:
    "Generate a Japanese last name with kanji, kana, romaji, meaning, and data-backed commonness. Use the surname in a complete Japanese name.",
  alternates: { canonical: "/japanese-last-name-generator" },
  openGraph: {
    title: "Japanese Last Name Generator – Surnames with Meanings",
    description:
      "Generate a Japanese surname with kanji, kana, romaji, and meaning.",
    url: "/japanese-last-name-generator",
  },
  twitter: {
    card: "summary",
    title: "Japanese Last Name Generator – Surnames with Meanings",
    description:
      "Generate a Japanese surname with kanji, kana, romaji, and meaning.",
  },
};

export default function JapaneseLastNameGeneratorPage() {
  const surnames: SurnameGeneratorRecord[] = getBrowseableSurnames().map(
    (surname) => ({
      id: surname.id,
      slug: surname.slug,
      kanji: surname.kanji,
      hiragana: surname.hiragana,
      katakana: surname.katakana,
      romaji: surname.romaji,
      literalMeaning: surname.literalMeaning,
      kanjiBreakdown: surname.kanjiBreakdown,
      popularityLevel: surname.popularityLevel,
      originTypes: surname.originTypes,
      isIndexable: surname.isIndexable,
    }),
  );
  const initialSurnameId =
    surnames.find((surname) => surname.slug === "sato")?.id ?? surnames[0]?.id ?? "";

  return (
    <div className="container-page themed-page theme-moss">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Japanese Last Name Generator", path: "/japanese-last-name-generator" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Japanese Last Name Generator",
          url: `${siteUrl}/japanese-last-name-generator`,
          applicationCategory: "ReferenceApplication",
          operatingSystem: "Any",
          description:
            "A browser-based generator for source-backed Japanese surnames with kanji, readings, romaji, and literal meanings.",
        }}
      />
      <Breadcrumbs items={[{ label: "Japanese Last Name Generator" }]} />
      <header className="page-intro my-6">
        <p className="eyebrow">Surname-only tool</p>
        <h1 className="section-title mt-2">Japanese Last Name Generator</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#59645d]">
          Generate one Japanese surname at a time and compare its kanji, kana
          reading, romaji, and literal meaning. Filter by documented commonness
          or origin classification, then use the result in the complete Japanese
          Name Generator when you are ready to add a given name.
        </p>
      </header>

      <SurnameGenerator initialSurnameId={initialSurnameId} surnames={surnames} />

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">How surnames work</p>
          <h2 className="section-title mt-2 !text-3xl">
            Family name first in Japanese order
          </h2>
        </div>
        <div className="space-y-4 leading-7 text-[#59645d]">
          <p>
            A Japanese full name normally places the family name before the
            given name in Japanese order. For example, Satō is the surname in
            Satō Akari, while Akari is the given name. Western-order displays
            may reverse those two parts.
          </p>
          <p>
            Surnames are commonly written in kanji, and their hiragana reading
            shows how the stored spelling is pronounced. Romaji represents that
            reading with Latin letters. A kanji breakdown can explain literal
            components, but it cannot establish that every family with the same
            spelling shares one origin.
          </p>
          <p>
            This tool selects complete surname records rather than assembling
            arbitrary kanji. Commonness and origin filters appear only because
            those fields exist in the underlying data; an absent detail link
            means the record is useful for generation but does not yet have an
            indexable research page.
          </p>
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          ["1", "Set optional filters", "Choose a broad commonness group or a documented origin classification."],
          ["2", "Generate again", "Review a new stored surname with its kanji, reading, romaji, and meaning."],
          ["3", "Build a full name", "Send the surname to the complete generator and pair it with a given name."],
        ].map(([number, title, copy]) => (
          <article className="surface p-5" key={number}>
            <span className="text-xs font-bold text-[#a34837]">0{number}</span>
            <h3 className="mt-2 font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#647068]">{copy}</p>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-2xl border border-[#d9ddd6] bg-[#f3f4ef] p-5 sm:p-6">
        <h2 className="text-xl font-semibold">Generate or browse?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#647068]">
          Use this page when you want a random Japanese surname. To compare many
          family names in one place, search the browseable list of Japanese last
          names. To create both parts together, return to the full-name tool.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="button-primary" href="/#generator">
            Create a complete Japanese name
          </Link>
          <Link className="button-secondary" href="/japanese-last-names">
            Browse Japanese last names
          </Link>
        </div>
      </section>
    </div>
  );
}
