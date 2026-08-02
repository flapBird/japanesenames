import { generatedFirstNames, generatedSurnames } from "./generated/curated/name-data";
import { firstNames as editorialFirstNames } from "./first-names";
import { surnames as editorialSurnames } from "./surnames";

function mergeEditorialFirstNames() {
  const merged = new Map(
    generatedFirstNames.map((item) => [item.hiragana, item]),
  );
  // Editorial records intentionally win for an existing reading: they carry
  // reviewed meanings, stable slugs, styles, and detail-page source notes.
  for (const item of editorialFirstNames) merged.set(item.hiragana, item);
  return [
    ...editorialFirstNames,
    ...[...merged.values()].filter(
      (item) => !editorialFirstNames.some((editorial) => editorial.id === item.id),
    ),
  ];
}

function mergeEditorialSurnames() {
  const key = (item: { kanji: string; hiragana: string }) =>
    `${item.kanji}:${item.hiragana}`;
  const merged = new Map(generatedSurnames.map((item) => [key(item), item]));
  for (const item of editorialSurnames) merged.set(key(item), item);
  return [
    ...editorialSurnames,
    ...[...merged.values()].filter(
      (item) => !editorialSurnames.some((editorial) => editorial.id === item.id),
    ),
  ];
}

export const firstNames = mergeEditorialFirstNames();
export const surnames = mergeEditorialSurnames();
export const firstNameById = new Map(firstNames.map((item) => [item.id, item]));
export const firstNameBySlug = new Map(firstNames.map((item) => [item.slug, item]));
export const surnameById = new Map(surnames.map((item) => [item.id, item]));
export const surnameBySlug = new Map(surnames.map((item) => [item.slug, item]));
export * from "./sources";
