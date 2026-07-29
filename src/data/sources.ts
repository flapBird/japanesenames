import type { SourceReference } from "@/types/names";

export const sources: SourceReference[] = [
  {
    id: "moj-surname-history",
    title: "Changes in Japan’s surname system",
    publisher: "Ministry of Justice, Japan",
    url: "https://www.moj.go.jp/MINJI/minji36-02.html",
    accessedAt: "2026-07-29",
  },
  {
    id: "ndl-surname-research",
    title: "Research guide: Japanese surnames and family names",
    publisher: "National Diet Library",
    url: "https://ndlsearch.ndl.go.jp/rnavi/humanities/post_1126",
    publishedAt: "2022-12-21",
    accessedAt: "2026-07-29",
  },
  {
    id: "bunka-joyo-kanji",
    title: "Index of readings in the Jōyō Kanji Table",
    publisher: "Agency for Cultural Affairs, Japan",
    url: "https://www.bunka.go.jp/kokugo_nihongo/sisaku/joho/joho/kijun/naikaku/kanji/joyokanjisakuin/index.html",
    accessedAt: "2026-07-29",
  },
  {
    id: "gov-kamon-history",
    title: "Kamon, Japanese Family Crests, Their History and Features",
    publisher: "Public Relations Office, Government of Japan",
    url: "https://www.gov-online.go.jp/eng/publicity/book/hlj/html/202212/202212_03_en.html",
    publishedAt: "2022-12",
    accessedAt: "2026-07-29",
  },
];

export const sourceById = new Map(sources.map((source) => [source.id, source]));
