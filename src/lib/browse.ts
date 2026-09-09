import type { FirstNameRecord, SurnameRecord } from "@/types/names";

export const BROWSE_PAGE_SIZE = 24;

export function browseHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
}

export function parseBrowsePage(value: string | undefined, count: number) {
  if (value === undefined) return 1;
  if (!/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) && page <= Math.max(1, Math.ceil(count / BROWSE_PAGE_SIZE))
    ? page
    : null;
}

// Explicit editorial ordering, not a claim about measured name popularity.
export function compareBrowseNames(
  a: Pick<FirstNameRecord, "isIndexable" | "curationPriority" | "romaji" | "id">,
  b: Pick<FirstNameRecord, "isIndexable" | "curationPriority" | "romaji" | "id">,
) {
  const score = (name: typeof a) => name.isIndexable ? 0 : name.curationPriority === "recommended" ? 1 : 2;
  return score(a) - score(b) || a.romaji.localeCompare(b.romaji, "en") || a.id.localeCompare(b.id);
}

export function toBrowseName(name: FirstNameRecord) {
  const variation = name.variations[0];
  return {
    id: name.id, slug: name.slug, romaji: name.romaji, hiragana: name.hiragana,
    genders: name.genders, styles: name.styles, meaningTags: name.meaningTags,
    popularityLevel: name.popularityLevel, kanjiLengthOptions: name.kanjiLengthOptions,
    isIndexable: name.isIndexable, curationPriority: name.curationPriority,
    popularityEvidence: name.popularityEvidence,
    variations: [{
      kanji: variation.kanji, meanings: variation.meanings,
      meaningEvidence: variation.meaningEvidence,
      kanjiBreakdown: variation.kanjiBreakdown,
      naturalness: variation.naturalness, verificationStatus: variation.verificationStatus,
    }],
  };
}

export function toBrowseSurname(name: SurnameRecord) {
  return {
    id: name.id, slug: name.slug, romaji: name.romaji, kanji: name.kanji,
    hiragana: name.hiragana, literalMeaning: name.literalMeaning,
    popularityLevel: name.popularityLevel, originTypes: name.originTypes,
    regions: name.regions.map(({ prefectureCode }) => ({ prefectureCode })),
    isIndexable: name.isIndexable,
  };
}

export type BrowseName = ReturnType<typeof toBrowseName>;
export type BrowseSurname = ReturnType<typeof toBrowseSurname>;
