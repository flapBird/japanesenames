import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { getIndexableFirstNames, getIndexableSurnames } from "@/lib/names";

describe("SEO sitemap", () => {
  const staticPageCount = 9;

  it("contains every static page and every published detail page", () => {
    const urls = sitemap().map((item) => item.url);

    expect(urls).toHaveLength(
      staticPageCount +
        getIndexableSurnames().length +
        getIndexableFirstNames().length,
    );
    expect(urls).toContain("https://japanesenames.site");
    expect(urls).toContain(
      "https://japanesenames.site/japanese-last-name-generator",
    );
    expect(urls).toContain("https://japanesenames.site/surname/sato");
    expect(urls).toContain("https://japanesenames.site/name/rin");
    expect(urls.every((url) => !url.includes("?"))).toBe(true);
    expect(urls.every((url) => !url.includes("/favorites"))).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("publishes the dictionary-derived long tail under the data gate", () => {
    const urls = sitemap().map((item) => item.url);

    expect(urls.length).toBeGreaterThan(400);
    expect(
      urls
        .filter((url) => url.includes("/surname/") || url.includes("/name/"))
        .every((url) => /\/(surname|name)\/[a-z0-9-]+$/.test(url)),
    ).toBe(true);
  });
});
