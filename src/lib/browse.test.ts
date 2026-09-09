import { describe, expect, it } from "vitest";
import { firstNames } from "@/data";
import { BROWSE_PAGE_SIZE, browseHref, compareBrowseNames, parseBrowsePage, toBrowseName } from "./browse";

describe("crawlable name lists", () => {
  it("rejects ambiguous and out-of-range page URLs", () => {
    for (const value of ["0", "-1", "01", "1.5", "2x", "", "4", "999999999999999999999"]) {
      expect(parseBrowsePage(value, 72)).toBeNull();
    }
    expect(parseBrowsePage(undefined, 72)).toBe(1);
    expect(parseBrowsePage("3", 72)).toBe(3);
    expect(browseHref("/japanese-girl-names", 1)).toBe("/japanese-girl-names");
  });

  it("preserves the server ordering after client data projection across every page", () => {
    for (const gender of ["girl", "boy"] as const) {
      const records = firstNames.filter((name) => name.genders.includes(gender) && name.verificationStatus !== "needs_review").sort(compareBrowseNames);
      const projected = records.map(toBrowseName).sort(compareBrowseNames);
      const visited: string[] = [];
      for (let start = 0; start < records.length; start += BROWSE_PAGE_SIZE) {
        const ids = projected.slice(start, start + BROWSE_PAGE_SIZE).map((name) => name.id);
        expect(ids).toEqual(records.slice(start, start + BROWSE_PAGE_SIZE).map((name) => name.id));
        visited.push(...ids);
      }
      expect(new Set(visited).size).toBe(records.length);
    }
  });

  it("keeps source matches separate from unmatched editorial spellings", () => {
    const rin = firstNames.find((name) => name.slug === "rin")!;
    expect(rin.variations.find((variation) => variation.kanji === "凛")?.upstreamIds).toContain("5720427");
    const mizuki = firstNames.find((name) => name.slug === "mizuki")!;
    expect(mizuki.variations.find((variation) => variation.kanji === "美津希")?.upstreamIds).toEqual([]);
  });
});
