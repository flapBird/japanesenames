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
          return [
            ...(block.title ? [block.title] : []),
            ...block.entries.map((entry) => `${entry.romaji} ${entry.kanji} ${entry.kana} ${entry.note}`),
          ];
        case "figure":
          return [
            block.label,
            block.caption,
            ...(block.source ? [block.source] : []),
            ...block.bars.map((bar) => `${bar.label} ${bar.value}`),
            ...(block.chips ?? []),
          ];
        case "quoteCard":
          return [block.text, ...(block.tag ? [block.tag] : []), ...(block.note ? [block.note] : [])];
        case "table":
          return [...block.columns, ...block.rows.flat()];
      }
    }),
    ...article.faq.flatMap((item) => [item.question, item.answer]),
  ].join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(4, Math.round(words / 200));
}

export interface ArticleTocEntry {
  id: string;
  number: string;
  label: string;
}

export function articleHeadingAnchor(headingIndex: number) {
  return `section-${headingIndex}`;
}

// TOC entries mirror the anchors ArticleRenderer assigns to headings; both
// number headings in block order, so the ids always line up. The FAQ section
// on the article page anchors at a fixed id appended by the page.
export function articleToc(article: Article): ArticleTocEntry[] {
  const entries: ArticleTocEntry[] = [];
  let headingIndex = 0;
  for (const block of article.blocks) {
    if (block.type !== "heading") continue;
    const match = block.text.match(/^(\d+)\.\s+(.*)$/);
    entries.push({
      id: articleHeadingAnchor(headingIndex),
      number: match ? match[1].padStart(2, "0") : "·",
      label: match ? match[2] : block.text,
    });
    headingIndex += 1;
  }
  return entries;
}

export function articleHref(slug: string) {
  return `/articles/${slug}`;
}
