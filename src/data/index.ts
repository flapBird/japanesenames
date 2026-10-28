import { generatedFirstNames, generatedSurnames } from "./generated/curated/name-data";
import { firstNames as editorialFirstNames } from "./first-names";
import { surnames as editorialSurnames } from "./surnames";
import { editorialPairEvidence } from "./editorial-pair-evidence";
import { firstNamePublishReady, surnamePublishReady } from "./publish-policy";

// The generated module is produced by scripts/curate-name-data.ts and always
// writes isIndexable: false, so the publish gate is applied here at merge
// time instead of hand-editing generated output. Editorial records are
// reviewed by hand and never pass through the gate.
function mergeEditorialFirstNames() {
  const merged = new Map(
    generatedFirstNames.map((item) => [
      item.hiragana,
      firstNamePublishReady(item) ? { ...item, isIndexable: true } : item,
    ]),
  );
  // Editorial records intentionally win for an existing reading: they carry
  // reviewed meanings, stable slugs, styles, and detail-page source notes.
  for (const item of editorialFirstNames) {
    const variations = item.variations.map((variation) => {
      const upstreamIds = editorialPairEvidence[`${variation.kanji}:${item.hiragana}`] ?? [];
      return { ...variation, upstreamIds, sourceIds: upstreamIds.length ? ["edrdg-jmnedict-2026-08-01"] : [] };
    });
    merged.set(item.hiragana, {
      ...item, variations,
      sourceIds: [...item.sourceIds, ...(variations.some((variation) => variation.upstreamIds.length) ? ["edrdg-jmnedict-2026-08-01"] : [])],
    });
  }
  return [
    ...editorialFirstNames.map((item) => merged.get(item.hiragana)!),
    ...[...merged.values()].filter(
      (item) => !editorialFirstNames.some((editorial) => editorial.id === item.id),
    ),
  ];
}

function mergeEditorialSurnames() {
  const key = (item: { kanji: string; hiragana: string }) =>
    `${item.kanji}:${item.hiragana}`;
  const merged = new Map(
    generatedSurnames.map((item) => [
      key(item),
      surnamePublishReady(item) ? { ...item, isIndexable: true } : item,
    ]),
  );
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
