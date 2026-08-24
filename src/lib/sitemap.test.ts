import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("SEO sitemap allowlist", () => {
  it("contains only the intended canonical page set", () => {
    const urls = sitemap().map((item) => item.url);

    expect(urls).toHaveLength(30);
    expect(urls).toContain("https://japanesenames.site");
    expect(urls).toContain(
      "https://japanesenames.site/japanese-last-name-generator",
    );
    expect(urls).toContain("https://japanesenames.site/surname/sato");
    expect(urls).toContain("https://japanesenames.site/name/rin");
    expect(urls.every((url) => !url.includes("?"))).toBe(true);
    expect(urls.every((url) => !url.includes("/favorites"))).toBe(true);
  });
});
