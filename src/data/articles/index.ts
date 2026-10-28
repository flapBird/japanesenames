import type { Article, ArticleCategory } from "@/types/articles";
import { mostCommonJapaneseSurnames } from "./most-common-japanese-surnames";
import { mostPopularJapaneseNames } from "./most-popular-japanese-names";
import { namesMeaningMoon } from "./names-meaning-moon";
import { namesMeaningLight } from "./names-meaning-light";
import { namesMeaningFlower } from "./names-meaning-flower";
import { namesMeaningSnow } from "./names-meaning-snow";
import { namesMeaningLove } from "./names-meaning-love";
import { unisexJapaneseNames } from "./unisex-japanese-names";
import { animeJapaneseNames } from "./anime-japanese-names";
import { namesThatWorkInEnglish } from "./names-that-work-in-english";
import { howJapaneseNamesWork } from "./how-japanese-names-work";
import { coolJapaneseLastNames } from "./cool-japanese-last-names";

// Articles are ordered newest-first for the index page; publication dates are
// set in each file.
export const articles: Article[] = [
  howJapaneseNamesWork,
  mostPopularJapaneseNames,
  mostCommonJapaneseSurnames,
  namesMeaningMoon,
  namesMeaningLight,
  namesMeaningFlower,
  namesMeaningSnow,
  namesMeaningLove,
  unisexJapaneseNames,
  animeJapaneseNames,
  namesThatWorkInEnglish,
  coolJapaneseLastNames,
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const articleBySlug = new Map(articles.map((article) => [article.slug, article]));

export function articlesByCategory(category: ArticleCategory) {
  return articles.filter((article) => article.category === category);
}
