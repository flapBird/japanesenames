import { describe, expect, it } from "vitest";
import { firstNames, surnames } from "@/data";
import {
  generateNameBatch,
  generateNames,
  getFirstNameBySlug,
  getKanjiShortcutCount,
  getSurnameBySlug,
} from "@/lib/names";
import type { GeneratorFilters } from "@/types/names";

const filters: GeneratorFilters = { gender: "any", style: "any", mode: "realistic", meaning: "any", kanjiLength: "any", surnamePopularity: "any" };

describe("strict, diverse name generation", () => {
  it("uses only generator-eligible reviewed production records", () => {
    const results = generateNames({ filters, count: 24, seed: 1 });
    expect(results).toHaveLength(24);
    expect(results.every((item) =>
      (item.firstName.generatorEligible ?? item.firstName.verificationStatus !== "needs_review") &&
      (item.surname.generatorEligible ?? item.surname.verificationStatus !== "needs_review") &&
      ["verified", "partially_verified"].includes(item.variation.verificationStatus),
    )).toBe(true);
  });

  it("keeps editorial detail records and their stable slugs", () => {
    expect(getSurnameBySlug("yamamoto")?.literalMeaning).toBe("Base of the mountain");
    expect(getFirstNameBySlug("haruto")?.romaji).toBe("Haruto");
  });

  it("treats fiction-friendly as a usable fiction pool without inventing records", () => {
    const batch = generateNameBatch({
      filters: { ...filters, gender: "boy", mode: "fiction_friendly" },
      seed: 12,
    });
    expect(batch.results).toHaveLength(6);
    expect(batch.results.every((item) => item.firstName.genders.includes("boy"))).toBe(true);
  });

  it("returns only exact given-name Kanji variations", () => {
    const batch = generateNameBatch({ filters, kanjiFilter: { kanji: "月", target: "given-name" }, seed: 2 });
    expect(batch.results.length).toBeGreaterThan(0);
    expect(batch.results.every((item) => item.variation.kanji.includes("月"))).toBe(true);
  });

  it("checks surname Kanji only against surnames and Either against either side", () => {
    const surnameBatch = generateNameBatch({ filters, kanjiFilter: { kanji: "山", target: "surname" }, seed: 3 });
    const eitherBatch = generateNameBatch({ filters, kanjiFilter: { kanji: "月", target: "either" }, seed: 4 });
    expect(surnameBatch.results.every((item) => item.surname.kanji.includes("山"))).toBe(true);
    expect(eitherBatch.results.every((item) => item.surname.kanji.includes("月") || item.variation.kanji.includes("月"))).toBe(true);
  });

  it("never relaxes a Kanji filter when no record matches", () => {
    const batch = generateNameBatch({ filters, kanjiFilter: { kanji: "龘", target: "given-name" }, seed: 5 });
    expect(batch.poolCount).toBe(0);
    expect(batch.results).toEqual([]);
  });

  it("does not reuse full names before the pool is exhausted", () => {
    const first = generateNameBatch({ filters, count: 6, seed: 6 });
    const second = generateNameBatch({ filters, count: 6, seed: 7, excludeKeys: first.results.map((item) => item.key) });
    expect(second.results.every((item) => !first.results.some((prior) => prior.key === item.key))).toBe(true);
  });

  it("returns an empty batch, rather than repeats, after exhausting a pool", () => {
    const pool = generateNameBatch({ filters, lockedSurnameId: surnames[0].id, lockedFirstNameId: firstNames[0].id, count: 6, seed: 8 });
    const exhausted = generateNameBatch({ filters, lockedSurnameId: surnames[0].id, lockedFirstNameId: firstNames[0].id, count: 6, seed: 9, excludeKeys: pool.results.map((item) => item.key) });
    expect(exhausted.poolCount).toBeGreaterThan(0);
    expect(exhausted.results).toEqual([]);
  });

  it("honours dynamically selected surname and first-name locks", () => {
    const surname = surnames[0];
    const firstName = firstNames[0];
    const surnameLocked = generateNames({ filters, lockedSurnameId: surname.id, count: 6, seed: 10 });
    const firstLocked = generateNames({ filters, lockedFirstNameId: firstName.id, count: 6, seed: 11 });
    expect(surnameLocked.every((item) => item.surname.id === surname.id)).toBe(true);
    expect(firstLocked.every((item) => item.firstName.id === firstName.id)).toBe(true);
  });

  it("meets the deterministic ten-batch diversity benchmark", () => {
    const shownKeys: string[] = [];
    const firstCounts: Record<string, number> = {};
    const surnameCounts: Record<string, number> = {};
    const variationCounts: Record<string, number> = {};
    const all = [] as ReturnType<typeof generateNameBatch>["results"];
    for (let seed = 20; seed < 30; seed += 1) {
      const batch = generateNameBatch({ filters, count: 6, seed, excludeKeys: shownKeys, shownFirstNameCounts: firstCounts, shownSurnameCounts: surnameCounts, shownVariationCounts: variationCounts });
      all.push(...batch.results);
      for (const item of batch.results) {
        shownKeys.push(item.key);
        firstCounts[item.firstName.id] = (firstCounts[item.firstName.id] ?? 0) + 1;
        surnameCounts[item.surname.id] = (surnameCounts[item.surname.id] ?? 0) + 1;
        variationCounts[item.variation.kanji] = (variationCounts[item.variation.kanji] ?? 0) + 1;
      }
    }
    expect(new Set(all.map((item) => item.key)).size).toBe(60);
    expect(new Set(all.map((item) => item.firstName.hiragana)).size).toBeGreaterThanOrEqual(20);
    expect(new Set(all.map((item) => item.surname.id)).size).toBeGreaterThanOrEqual(30);
  }, 20_000);

  it("reports shortcut counts as unique readings or surnames", () => {
    expect(getKanjiShortcutCount("月", "given-name", filters)).toBeGreaterThanOrEqual(8);
    expect(getKanjiShortcutCount("田", "surname", filters)).toBeGreaterThanOrEqual(20);
  });
});
