import { readFile } from "node:fs/promises";
import { firstNames, surnames } from "../src/data";
import { generateNameBatch, getKanjiShortcutCount } from "../src/lib/names";
import type { GeneratorFilters } from "../src/types/names";

const filters: GeneratorFilters = { gender: "any", style: "any", mode: "realistic", meaning: "any", kanjiLength: "any", surnamePopularity: "any" };
const givenKanji = ["月", "愛", "桜", "花", "光", "空", "海", "美"];
const surnameKanji = ["山", "田", "川", "中", "木", "本", "林", "島"];
const statusCount = (status: string) => firstNames.filter((item) => item.verificationStatus === status).length + surnames.filter((item) => item.verificationStatus === status).length;
const firstReadingCount = new Set(firstNames.map((item) => item.hiragana)).size;

function diversityBenchmark(batchCount: number) {
  const keys: string[] = [];
  const shownFirstNameCounts: Record<string, number> = {};
  const shownSurnameCounts: Record<string, number> = {};
  const shownVariationCounts: Record<string, number> = {};
  const results: ReturnType<typeof generateNameBatch>["results"] = [];
  for (let batchIndex = 0; batchIndex < batchCount; batchIndex += 1) {
    const batch = generateNameBatch({
      filters,
      count: 6,
      seed: 500 + batchIndex,
      excludeKeys: keys,
      shownFirstNameCounts,
      shownSurnameCounts,
      shownVariationCounts,
    });
    results.push(...batch.results);
    for (const item of batch.results) {
      keys.push(item.key);
      shownFirstNameCounts[item.firstName.id] = (shownFirstNameCounts[item.firstName.id] ?? 0) + 1;
      shownSurnameCounts[item.surname.id] = (shownSurnameCounts[item.surname.id] ?? 0) + 1;
      shownVariationCounts[item.variation.kanji] = (shownVariationCounts[item.variation.kanji] ?? 0) + 1;
    }
  }
  return {
    batches: batchCount,
    results: results.length,
    uniqueFullNames: new Set(results.map((item) => item.key)).size,
    uniqueReadings: new Set(results.map((item) => item.firstName.hiragana)).size,
    uniqueVariations: new Set(results.map((item) => item.variation.kanji)).size,
    uniqueSurnames: new Set(results.map((item) => item.surname.id)).size,
  };
}

const manifest = JSON.parse(await readFile("data-sources/jmnedict/source-manifest.json", "utf8")) as { importedCandidateCount?: number };
console.log(JSON.stringify({
  readings: { unique: firstReadingCount, girl: firstNames.filter((item) => item.genders.includes("girl")).length, boy: firstNames.filter((item) => item.genders.includes("boy")).length, unisex: firstNames.filter((item) => item.genders.includes("unisex")).length },
  kanjiVariations: firstNames.reduce((sum, item) => sum + item.variations.length, 0),
  surnames: surnames.length,
  generatorEligible: {
    firstNameReadings: firstNames.filter((item) => item.generatorEligible ?? item.verificationStatus !== "needs_review").length,
    surnames: surnames.filter((item) => item.generatorEligible ?? item.verificationStatus !== "needs_review").length,
  },
  evidenceCoverage: {
    dictionarySupportedVariations: firstNames.reduce(
      (count, item) =>
        count +
        item.variations.filter(
          (variation) => variation.meaningEvidence === "dictionary_glosses",
        ).length,
      0,
    ),
    dictionarySupportedSurnames: surnames.filter(
      (item) => item.fieldEvidence?.kanjiMeaning === "dictionary_supported",
    ).length,
    placeholderMeanings: firstNames.reduce(
      (count, item) =>
        count +
        item.variations.flatMap((variation) => variation.meanings)
          .filter((meaning) => /not yet reviewed/i.test(meaning)).length,
      0,
    ) + surnames.filter((item) => /not yet reviewed/i.test(item.literalMeaning)).length,
  },
  indexable: firstNames.filter((item) => item.isIndexable).length + surnames.filter((item) => item.isIndexable).length,
  imported_unreviewed: manifest.importedCandidateCount ?? statusCount("imported_unreviewed"),
  partially_verified: statusCount("partially_verified"),
  needs_review: statusCount("needs_review"),
  unknownOrUnranked: firstNames.filter((item) => item.popularityLevel === "unranked").length + surnames.filter((item) => item.popularityLevel === "unranked").length,
  popularKanji: { given: Object.fromEntries(givenKanji.map((kanji) => [kanji, getKanjiShortcutCount(kanji, "given-name", filters)])), surname: Object.fromEntries(surnameKanji.map((kanji) => [kanji, getKanjiShortcutCount(kanji, "surname", filters)])) },
  benchmarks: [
    ["Any / Any / Realistic / Any", filters],
    ["Girl / Modern", { ...filters, gender: "girl", style: "modern" }],
    ["Boy / Timeless", { ...filters, gender: "boy", style: "timeless" }],
    ["Unisex", { ...filters, gender: "unisex" }],
  ].map(([label, current], index) => ({ label, available: generateNameBatch({ filters: current as GeneratorFilters, seed: index + 1 }).poolCount })),
  diversity: [diversityBenchmark(10), diversityBenchmark(50)],
}, null, 2));
