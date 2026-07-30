import { describe, expect, it } from "vitest";
import {
  generateNameBatch,
  generateNames,
  getFirstNameBySlug,
  getSurnameBySlug,
} from "@/lib/names";
import type { GeneratorFilters } from "@/types/names";

const filters: GeneratorFilters = {
  gender: "any",
  style: "any",
  mode: "realistic",
  meaning: "any",
  kanjiLength: "any",
  surnamePopularity: "any",
};

describe("structured name generation", () => {
  it("returns only names matching the gender filter", () => {
    const results = generateNames({
      filters: { ...filters, gender: "boy" },
      count: 30,
      seed: 1,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.firstName.genders.includes("boy"))).toBe(true);
  });

  it("returns only names matching the meaning filter", () => {
    const results = generateNames({
      filters: { ...filters, meaning: "nature" },
      count: 30,
      seed: 2,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.firstName.meaningTags.includes("nature"))).toBe(true);
  });

  it("returns only variations matching the Kanji length", () => {
    const results = generateNames({
      filters: { ...filters, kanjiLength: 2 },
      count: 30,
      seed: 3,
    });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => [...result.variation.kanji].length === 2)).toBe(true);
  });

  it("keeps the surname fixed when a surname is locked", () => {
    const results = generateNames({
      filters,
      lockedSurnameId: "surname-yamamoto",
      count: 20,
      seed: 4,
    });
    expect(results.length).toBeGreaterThan(1);
    expect(results.every((result) => result.surname.id === "surname-yamamoto")).toBe(true);
  });

  it("keeps the first-name reading fixed when a first name is locked", () => {
    const results = generateNames({
      filters,
      lockedFirstNameId: "name-rin",
      count: 20,
      seed: 5,
    });
    expect(results.length).toBeGreaterThan(1);
    expect(results.every((result) => result.firstName.id === "name-rin")).toBe(true);
  });

  it("does not return duplicate full-name records", () => {
    const results = generateNames({ filters, count: 100, seed: 6 });
    expect(new Set(results.map((result) => result.key)).size).toBe(results.length);
  });

  it("maximizes surname and first-name variety within a batch", () => {
    const results = generateNames({ filters, count: 6, seed: 9 });

    expect(new Set(results.map((result) => result.surname.id)).size).toBe(6);
    expect(new Set(results.map((result) => result.firstName.id)).size).toBe(6);
  });

  it("avoids names already shown in the session", () => {
    const firstBatch = generateNames({ filters, count: 6, seed: 10 });
    const secondBatch = generateNames({
      filters,
      count: 6,
      seed: 11,
      excludeKeys: firstBatch.map((result) => result.key),
    });

    expect(
      secondBatch.every(
        (result) => !firstBatch.some((previous) => previous.key === result.key),
      ),
    ).toBe(true);
  });

  it("reuses prior names only after the matching pool is exhausted", () => {
    const completePool = generateNames({ filters, count: 1_000, seed: 12 });
    const fallbackBatch = generateNames({
      filters,
      count: 6,
      seed: 13,
      excludeKeys: completePool.map((result) => result.key),
    });

    expect(fallbackBatch).toHaveLength(6);
    expect(
      fallbackBatch.every((result) =>
        completePool.some((previous) => previous.key === result.key),
      ),
    ).toBe(true);
  });

  it("does not generate from records marked needs_review", () => {
    const results = generateNames({
      filters: { ...filters, mode: "any" },
      count: 200,
      seed: 8,
    });
    expect(
      results.every(
        (result) =>
          result.surname.verificationStatus !== "needs_review" &&
          result.firstName.verificationStatus !== "needs_review" &&
          result.variation.verificationStatus !== "needs_review",
      ),
    ).toBe(true);
  });

  it("returns an explicit empty collection when no reviewed data matches", () => {
    const results = generateNames({
      filters: { ...filters, meaning: "fire" },
      seed: 7,
    });
    expect(results).toEqual([]);
  });

  it("fills an uncovered boy fiction-friendly request with unique reviewed names", () => {
    const batch = generateNameBatch({
      filters: {
        ...filters,
        gender: "boy",
        mode: "fiction_friendly",
      },
      seed: 14,
    });

    expect(batch.results).toHaveLength(6);
    expect(batch.exactCount).toBe(0);
    expect(batch.relaxedFilters).toContain("mode");
    expect(
      batch.results.every((result) => result.firstName.genders.includes("boy")),
    ).toBe(true);
    expect(new Set(batch.results.map((result) => result.key)).size).toBe(6);
  });

  it("returns unique results for every visible generator filter combination", () => {
    const genders = ["girl", "boy", "unisex", "any"] as const;
    const styles = ["modern", "traditional", "timeless", "any"] as const;
    const modes = ["realistic", "fiction_friendly", "any"] as const;
    const meanings = [
      "nature",
      "strength",
      "beauty",
      "light",
      "hope",
      "wisdom",
      "love",
      "peace",
      "water",
      "moon",
      "fire",
      "any",
    ] as const;

    for (const gender of genders) {
      for (const style of styles) {
        for (const mode of modes) {
          for (const meaning of meanings) {
            const batch = generateNameBatch({
              filters: { ...filters, gender, style, mode, meaning },
              seed: 15,
            });
            expect(batch.results).toHaveLength(6);
            expect(new Set(batch.results.map((result) => result.key)).size).toBe(
              6,
            );
          }
        }
      }
    }
  });

  it("filters given-name variations before selecting results", () => {
    const batch = generateNameBatch({
      filters,
      kanjiFilter: { kanji: "月", target: "given-name" },
      seed: 16,
    });

    expect(batch.results).toHaveLength(6);
    expect(
      batch.results.every((result) => result.variation.kanji.includes("月")),
    ).toBe(true);
    expect(
      batch.results.every((result) => result.variation.kanji === "美月"),
    ).toBe(true);
  });

  it("checks only surnames when the surname target is selected", () => {
    const moonInSurname = generateNameBatch({
      filters,
      kanjiFilter: { kanji: "月", target: "surname" },
      seed: 17,
    });
    const mountainInSurname = generateNameBatch({
      filters,
      kanjiFilter: { kanji: "山", target: "surname" },
      seed: 18,
    });

    expect(moonInSurname.results).toEqual([]);
    expect(mountainInSurname.results).toHaveLength(6);
    expect(
      mountainInSurname.results.every((result) =>
        result.surname.kanji.includes("山"),
      ),
    ).toBe(true);
  });

  it("matches either the surname or given-name side when requested", () => {
    const givenMatch = generateNameBatch({
      filters,
      kanjiFilter: { kanji: "月", target: "either" },
      seed: 19,
    });
    const surnameMatch = generateNameBatch({
      filters,
      kanjiFilter: { kanji: "山", target: "either" },
      seed: 20,
    });

    expect(
      givenMatch.results.every(
        (result) =>
          result.variation.kanji.includes("月") ||
          result.surname.kanji.includes("月"),
      ),
    ).toBe(true);
    expect(
      surnameMatch.results.every(
        (result) =>
          result.variation.kanji.includes("山") ||
          result.surname.kanji.includes("山"),
      ),
    ).toBe(true);
  });

  it("does not fall back to unrelated names for an unmatched kanji", () => {
    const batch = generateNameBatch({
      filters,
      kanjiFilter: { kanji: "龍", target: "given-name" },
      seed: 21,
    });

    expect(batch.results).toEqual([]);
    expect(batch.relaxedFilters).toEqual([]);
  });

  it("does not relax other selected filters while a kanji filter is active", () => {
    const batch = generateNameBatch({
      filters: { ...filters, gender: "boy" },
      kanjiFilter: { kanji: "月", target: "given-name" },
      seed: 24,
    });

    expect(batch.results).toEqual([]);
    expect(batch.relaxedFilters).toEqual([]);
  });

  it("restores the normal generator pool when the kanji is cleared", () => {
    const filtered = generateNameBatch({
      filters,
      kanjiFilter: { kanji: "月", target: "given-name" },
      seed: 22,
    });
    const cleared = generateNameBatch({
      filters,
      kanjiFilter: { target: "given-name" },
      seed: 23,
    });

    expect(
      filtered.results.every((result) => result.variation.kanji.includes("月")),
    ).toBe(true);
    expect(cleared.results).toHaveLength(6);
    expect(
      cleared.results.some((result) => !result.variation.kanji.includes("月")),
    ).toBe(true);
  });
});

describe("slug queries", () => {
  it("finds a surname by slug", () => {
    expect(getSurnameBySlug("yamamoto")?.kanji).toBe("山本");
  });

  it("finds a first name by slug", () => {
    expect(getFirstNameBySlug("haruto")?.hiragana).toBe("はると");
  });
});
