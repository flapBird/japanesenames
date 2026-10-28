import { describe, expect, it } from "vitest";
import { articleBySlug, articles } from "@/data/articles";
import {
  articleEntriesWithHref,
  estimateReadingMinutes,
  firstNameHrefFor,
  resolveEntryHref,
  surnameHrefFor,
} from "@/lib/articles";

describe("articles", () => {
  it("has unique slugs and complete metadata", () => {
    const slugs = articles.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const article of articles) {
      expect(article.title.length).toBeGreaterThan(15);
      expect(article.metaTitle.length).toBeGreaterThan(15);
      expect(article.metaTitle.length).toBeLessThanOrEqual(70);
      expect(article.metaDescription.length).toBeGreaterThan(80);
      expect(article.metaDescription.length).toBeLessThanOrEqual(165);
      expect(article.intro.length).toBeGreaterThanOrEqual(2);
      expect(article.faq.length).toBeGreaterThanOrEqual(3);
      expect(article.blocks.length).toBeGreaterThanOrEqual(3);
      for (const related of article.related) {
        expect(articleBySlug.has(related)).toBe(true);
      }
    }
  });

  it("keeps every name entry complete", () => {
    for (const article of articles) {
      for (const block of article.blocks) {
        if (block.type !== "nameEntries") continue;
        for (const entry of block.entries) {
          expect(entry.romaji.length).toBeGreaterThan(0);
          expect(entry.kanji.length).toBeGreaterThan(0);
          expect(entry.kana.length).toBeGreaterThan(0);
          expect(entry.note.length).toBeGreaterThan(20);
        }
      }
    }
  });

  it("links entries only to real dataset pages", () => {
    for (const article of articles) {
      for (const block of article.blocks) {
        if (block.type !== "nameEntries") continue;
        for (const entry of articleEntriesWithHref(block.entries)) {
          if (!entry.detailHref) continue;
          expect(entry.detailHref).toMatch(/^\/(name|surname)\/[a-z0-9-]+$/);
        }
      }
    }
    // Known anchors: the dataset must keep matching these or the tests and
    // pages should be updated together.
    expect(surnameHrefFor("佐藤")).toBe("/surname/sato");
    expect(firstNameHrefFor("はな", "花")).toBe("/name/hana");
    expect(firstNameHrefFor("ひかり", "光")).toBe("/name/hikari");
  });

  it("resolves a meaningful share of article name entries", () => {
    const entries = articles.flatMap((article) =>
      article.blocks.flatMap((block) => (block.type === "nameEntries" ? block.entries : [])),
    );
    const linked = entries.filter((entry) => resolveEntryHref(entry) !== undefined).length;
    expect(entries.length).toBeGreaterThan(200);
    expect(linked / entries.length).toBeGreaterThan(0.4);
  });

  it("estimates reading time sanely", () => {
    for (const article of articles) {
      const minutes = estimateReadingMinutes(article);
      expect(minutes).toBeGreaterThanOrEqual(4);
      expect(minutes).toBeLessThan(30);
    }
  });
});
