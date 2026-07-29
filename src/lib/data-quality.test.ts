import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { firstNames, sources, surnames } from "@/data";
import { validateNameData } from "@/lib/validate-data";

describe("indexing quality gates", () => {
  it("excludes needs-review records from the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    const unreviewedSurnames = surnames.filter(
      (item) => item.verificationStatus === "needs_review",
    );
    const unreviewedNames = firstNames.filter(
      (item) => item.verificationStatus === "needs_review",
    );
    for (const surname of unreviewedSurnames) {
      expect(urls).not.toContain(`https://japanesenames.site/surname/${surname.slug}`);
    }
    for (const name of unreviewedNames) {
      expect(urls).not.toContain(`https://japanesenames.site/name/${name.slug}`);
    }
  });

  it("detects an invalid source reference", () => {
    const invalidNames = structuredClone(firstNames);
    invalidNames[0].sourceIds = ["source-that-does-not-exist"];
    const errors = validateNameData({
      surnames,
      firstNames: invalidNames,
      sources,
    });
    expect(errors.some((error) => error.includes("source-that-does-not-exist"))).toBe(true);
  });
});
