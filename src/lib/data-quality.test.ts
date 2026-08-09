import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { firstNames, sources, surnames } from "@/data";
import { validateNameData } from "@/lib/validate-data";

describe("indexing quality gates", () => {
  it("keeps placeholder copy out of all generator-eligible records", () => {
    const placeholder = /not yet reviewed/i;
    const generatorNames = firstNames.filter(
      (item) =>
        item.generatorEligible ?? item.verificationStatus !== "needs_review",
    );
    const generatorSurnames = surnames.filter(
      (item) =>
        item.generatorEligible ?? item.verificationStatus !== "needs_review",
    );

    expect(
      generatorNames.flatMap((name) =>
        name.variations.flatMap((variation) => variation.meanings),
      ),
    ).not.toContainEqual(expect.stringMatching(placeholder));
    expect(generatorSurnames.map((surname) => surname.literalMeaning)).not.toContainEqual(
      expect.stringMatching(placeholder),
    );
  });

  it("preserves field-level evidence for imported dictionary records", () => {
    const importedNames = firstNames.filter((item) => item.candidateStatus);
    const importedSurnames = surnames.filter((item) => item.candidateStatus);

    expect(importedNames.length).toBeGreaterThan(0);
    expect(importedSurnames.length).toBeGreaterThan(0);
    expect(
      importedNames.every(
        (name) =>
          name.fieldEvidence?.spellingReading === "source_recorded" &&
          name.fieldEvidence.kanjiMeaning === "dictionary_supported" &&
          name.sourceIds.includes("edrdg-jmnedict-2026-08-01") &&
          name.sourceIds.includes("edrdg-kanjidic2-2026-08-01") &&
          name.variations.every(
            (variation) =>
              variation.meaningEvidence === "dictionary_glosses" &&
              Boolean(variation.kanjiBreakdown.length) &&
              Boolean(variation.upstreamIds?.length),
          ),
      ),
    ).toBe(true);
    expect(
      importedSurnames.every(
        (surname) =>
          surname.fieldEvidence?.spellingReading === "source_recorded" &&
          surname.fieldEvidence.kanjiMeaning === "dictionary_supported" &&
          Boolean(surname.kanjiBreakdown.length),
      ),
    ).toBe(true);
  });

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

  it("includes restored editorial surname and first-name pages", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://japanesenames.site/surname/yamamoto");
    expect(urls).toContain("https://japanesenames.site/name/haruto");
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
