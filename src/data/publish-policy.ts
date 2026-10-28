import type { FirstNameRecord, SurnameRecord } from "@/types/names";

// Publishing gate for dictionary-derived (JMnedict + KANJIDIC2) records.
//
// A generated record earns an indexable detail page when the data layer can
// support that page with record-specific content: a source-recorded
// spelling-reading pair and at least one kanji spelling backed by character
// glosses. Records that miss the bar stay noindexed until their data improves.
// Editorial records in src/data/first-names.ts and src/data/surnames.ts are
// hand-reviewed and keep whatever isIndexable flag they carry.
const publishableStatuses = ["verified", "partially_verified"];

export function firstNamePublishReady(name: FirstNameRecord): boolean {
  return (
    publishableStatuses.includes(name.verificationStatus) &&
    name.genders.length > 0 &&
    name.variations.some(
      (variation) =>
        variation.kanji.length > 0 &&
        variation.kanjiBreakdown.length > 0 &&
        variation.meanings.length > 0,
    )
  );
}

export function surnamePublishReady(surname: SurnameRecord): boolean {
  return (
    publishableStatuses.includes(surname.verificationStatus) &&
    surname.kanji.length > 0 &&
    surname.kanjiBreakdown.length > 0 &&
    Boolean(surname.literalMeaning.trim())
  );
}
