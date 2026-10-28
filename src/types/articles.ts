export type ArticleCategory = "meanings" | "popular" | "culture" | "lists";

export const articleCategoryLabels: Record<ArticleCategory, string> = {
  meanings: "Names by meaning",
  popular: "Popularity",
  culture: "Naming culture",
  lists: "Name lists",
};

// A single name shown inside an article list. Entries are editorial content;
// detailHref is resolved at render time by matching the stored dataset, so
// entries never link to a page that does not exist.
export interface ArticleNameEntry {
  romaji: string;
  kanji: string;
  kana: string;
  gender?: "girl" | "boy" | "unisex";
  note: string;
  /** Set for surname entries; then `kanji` is matched against the surname dataset. */
  kind?: "given" | "surname";
}

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title?: string; text: string }
  | { type: "nameEntries"; entries: ArticleNameEntry[] };

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  category: ArticleCategory;
  publishedAt: string;
  updatedAt: string;
  intro: string[];
  blocks: ArticleBlock[];
  faq: ArticleFaq[];
  related: string[];
}
