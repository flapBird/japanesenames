import type { SourceReference } from "@/types/names";

export const sources: SourceReference[] = [
  {
    id: "edrdg-kanjidic2-2026-08-01",
    sourceId: "edrdg-kanjidic2-2026-08-01",
    title: "KANJIDIC2 Kanji Database",
    publisher: "Electronic Dictionary Research and Development Group",
    url: "https://ftp.edrdg.org/pub/Nihongo/kanjidic2.xml.gz",
    accessedAt: "2026-08-01",
    license: "CC BY-SA 4.0",
    evidenceType: "meaning",
  },
  {
    id: "edrdg-jmnedict-2026-08-01",
    sourceId: "edrdg-jmnedict-2026-08-01",
    title: "JMnedict Japanese Multilingual Named Entity Dictionary",
    publisher: "Electronic Dictionary Research and Development Group",
    url: "https://ftp.edrdg.org/pub/Nihongo/JMnedict.xml.gz",
    accessedAt: "2026-08-01",
    datasetVersion: "JMnedict created 2026-08-01",
    license: "CC BY-SA 4.0",
    evidenceType: "reading_kanji_pair",
  },
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
