import type { Article, ArticleNameEntry } from "@/types/articles";
import { firstNames, surnames } from "@/data";

export const ARTICLES_UPDATED = new Date("2026-10-29");

// JMnedict records sometimes keep historical kana (みづき for みずき, あをい
// for あおい), so article kana is normalized before matching.
function normalizeKana(kana: string) {
  return kana.replaceAll("づ", "ず").replaceAll("ヅ", "ズ").replaceAll("を", "お");
}

export function firstNameHrefFor(kana: string, kanji?: string) {
  const wanted = normalizeKana(kana);
  const candidates = firstNames.filter(
    (item) => item.isIndexable && normalizeKana(item.hiragana) === wanted,
  );
  if (candidates.length === 0) return undefined;
  if (kanji) {
    const exact = candidates.find((item) =>
      item.variations.some((variation) => variation.kanji === kanji),
    );
    if (exact) return `/name/${exact.slug}`;
  }
  return `/name/${candidates[0].slug}`;
}

export function surnameHrefFor(kanji: string) {
  const match = surnames.find(
    (item) => item.isIndexable && item.kanji === kanji,
  );
  return match ? `/surname/${match.slug}` : undefined;
}

export function resolveEntryHref(entry: ArticleNameEntry) {
  return entry.kind === "surname"
    ? surnameHrefFor(entry.kanji)
    : firstNameHrefFor(entry.kana, entry.kanji);
}

// Articles resolve links at render time so the entries below never hard-code
// slugs that could drift from the dataset.
export function articleEntriesWithHref(entries: ArticleNameEntry[]) {
  return entries.map((entry) => ({ ...entry, detailHref: resolveEntryHref(entry) }));
}

export function estimateReadingMinutes(article: Article) {
  const text = [
    ...article.intro,
    ...article.blocks.flatMap((block) => {
      switch (block.type) {
        case "paragraph":
          return [block.text];
        case "heading":
          return [block.text];
        case "list":
          return block.items;
        case "callout":
          return [block.text];
        case "nameEntries":
          return block.entries.map((entry) => entry.note);
      }
    }),
    ...article.faq.flatMap((item) => [item.question, item.answer]),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(4, Math.round(words / 200));
}

export function articleHref(slug: string) {
  return `/articles/${slug}`;
}
