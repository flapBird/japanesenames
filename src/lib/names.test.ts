import { describe, expect, it } from "vitest";
import { generateNames, getFirstNameBySlug, getSurnameBySlug } from "@/lib/names";
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

  it("returns an explicit empty collection when no data matches", () => {
    const results = generateNames({
      filters: { ...filters, meaning: "moon" },
      seed: 7,
    });
    expect(results).toEqual([]);
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
