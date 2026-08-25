import { describe, expect, it } from "vitest";
import { firstNameById, surnameById } from "@/data";
import { parseIntentWithFallback } from "@/lib/ai/fallback-parser";
import { recommendNames } from "@/lib/ai/recommend-names";

describe("database-backed AI recommendations", () => {
  it("returns real girl-name records with direct moon evidence", () => {
    const prompt = "A Japanese girl name related to the moon";
    const output = recommendNames(parseIntentWithFallback(prompt), prompt);
    expect(output.results).toHaveLength(5);
    expect(
      output.results.every((item) =>
        item.gender.includes("girl"),
      ),
    ).toBe(true);
    expect(
      output.results.some((item) =>
        item.matchTags.some(
          (tag) => tag.evidence === "direct" && tag.label === "Moon",
        ),
      ),
    ).toBe(true);
    expect(
      output.results.every((item) =>
        [...firstNameById.values()].some(
          (name) =>
            name.romaji === item.romaji &&
            name.variations.some((variation) => variation.kanji === item.kanji),
        ),
      ),
    ).toBe(true);
  });

  it("uses the existing generator for complete names", () => {
    const prompt = "A modern full Japanese name for a game character";
    const output = recommendNames(parseIntentWithFallback(prompt), prompt);
    expect(output.results).toHaveLength(5);
    expect(output.results.every((item) => item.kind === "full")).toBe(true);
    expect(
      output.results.every((item) =>
        [...surnameById.values()].some((surname) =>
          item.kanji.startsWith(`${surname.kanji} `),
        ),
      ),
    ).toBe(true);
  });

  it("returns only stored surname records for surname intent", () => {
    const prompt = "Give me a common Japanese surname";
    const output = recommendNames(parseIntentWithFallback(prompt), prompt);
    expect(output.results).toHaveLength(5);
    expect(output.results.every((item) => item.kind === "surname")).toBe(true);
    expect(
      output.results.every((item) =>
        [...surnameById.values()].some(
          (surname) =>
            surname.romaji === item.romaji && surname.kanji === item.kanji,
        ),
      ),
    ).toBe(true);
  });

  it("provides a different deterministic set for the next variant", () => {
    const prompt = "Give me something cute";
    const intent = parseIntentWithFallback(prompt);
    const first = recommendNames(intent, prompt, 0).results.map((item) => item.id);
    const second = recommendNames(intent, prompt, 1).results.map((item) => item.id);
    expect(second).not.toEqual(first);
    expect(recommendNames(intent, prompt, 1).results.map((item) => item.id)).toEqual(
      second,
    );
  });
});
