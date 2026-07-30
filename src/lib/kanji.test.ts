import { describe, expect, it } from "vitest";
import {
  containsKanji,
  isSingleKanji,
  normalizeKanjiInput,
  popularKanji,
  togglePopularKanji,
} from "@/lib/kanji";

describe("kanji filter helpers", () => {
  it("accepts exactly one Han character and trims surrounding whitespace", () => {
    expect(normalizeKanjiInput("  月  ")).toBe("月");
    expect(isSingleKanji("月")).toBe(true);
    expect(isSingleKanji(" 月 ")).toBe(true);
  });

  it("rejects English, numbers, kana, and multiple kanji", () => {
    for (const value of ["Moon", "1", "つき", "月光", ""]) {
      expect(isSingleKanji(value)).toBe(false);
    }
  });

  it("toggles a popular meaning into and out of the input", () => {
    const moon = popularKanji.find((item) => item.label === "Moon");
    expect(moon?.kanji).toBe("月");
    expect(togglePopularKanji("", "月")).toBe("月");
    expect(togglePopularKanji("月", "月")).toBe("");
    expect(togglePopularKanji("月", "光")).toBe("光");
  });

  it("matches an optional kanji without changing the no-filter behavior", () => {
    expect(containsKanji("美月", "月")).toBe(true);
    expect(containsKanji("美津希", "月")).toBe(false);
    expect(containsKanji("美津希")).toBe(true);
  });
});
