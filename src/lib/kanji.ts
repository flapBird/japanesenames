import type { KanjiTarget } from "@/types/names";

export const kanjiFilterCopy = {
  includeKanji: "Include a Kanji",
  includeKanjiDescription:
    "Choose a meaning or enter a kanji you want in the name.",
  kanjiPlaceholder: "Enter one kanji, e.g. 月",
  popularMeanings: "Popular Meanings",
  useKanjiIn: "Use Kanji In",
  givenName: "Given Name",
  surname: "Surname",
  either: "Either",
  invalidKanji: "Please enter a single kanji character.",
  noMatchingNames: "No matching names found",
  clearKanjiFilter: "Clear Kanji Filter",
} as const;

export const popularKanji = [
  { label: "Moon", kanji: "月" },
  { label: "Love", kanji: "愛" },
  { label: "Cherry Blossom", kanji: "桜" },
  { label: "Flower", kanji: "花" },
  { label: "Light", kanji: "光" },
  { label: "Sky", kanji: "空" },
  { label: "Ocean", kanji: "海" },
  { label: "Beauty", kanji: "美" },
] as const;

export const kanjiTargetOptions: Array<{
  label: string;
  value: KanjiTarget;
}> = [
  { label: kanjiFilterCopy.givenName, value: "given-name" },
  { label: kanjiFilterCopy.surname, value: "surname" },
  { label: kanjiFilterCopy.either, value: "either" },
];

export function normalizeKanjiInput(value: string) {
  return value.trim();
}

export function isSingleKanji(value: string) {
  return /^\p{Script=Han}$/u.test(normalizeKanjiInput(value));
}

export function containsKanji(value: string, kanji?: string) {
  if (!kanji) return true;
  return value.includes(kanji);
}

export function togglePopularKanji(current: string, selected: string) {
  return current === selected ? "" : selected;
}
