import type {
  FirstNameRecord,
  SourceReference,
  SurnameRecord,
} from "@/types/names";

export function validateNameData({
  surnames,
  firstNames,
  sources,
}: {
  surnames: SurnameRecord[];
  firstNames: FirstNameRecord[];
  sources: SourceReference[];
}) {
  const errors: string[] = [];
  const sourceIds = new Set(sources.map((source) => source.id));
  const surnameIds = new Set(surnames.map((surname) => surname.id));
  const firstNameIds = new Set(firstNames.map((name) => name.id));

  function duplicates(values: string[]) {
    return values.filter((value, index) => values.indexOf(value) !== index);
  }

  for (const duplicate of duplicates(sources.map((source) => source.id))) {
    errors.push(`Duplicate source id: ${duplicate}`);
  }
  for (const source of sources) {
    try {
      new URL(source.url);
    } catch {
      errors.push(`Invalid source URL: ${source.id}`);
    }
  }

  for (const duplicate of duplicates(surnames.map((item) => item.id))) {
    errors.push(`Duplicate surname id: ${duplicate}`);
  }
  for (const duplicate of duplicates(surnames.map((item) => item.slug))) {
    errors.push(`Duplicate surname slug: ${duplicate}`);
  }
  for (const surname of surnames) {
    if (!surname.slug || !surname.romaji || !surname.hiragana || !surname.kanji) {
      errors.push(`Surname ${surname.id} is missing slug, Romaji, Hiragana, or Kanji`);
    }
    if (surname.isIndexable && !["verified", "partially_verified"].includes(surname.verificationStatus)) {
      errors.push(`Indexable surname ${surname.id} must be verified or partially verified`);
    }
    if (surname.generatorEligible && !["verified", "partially_verified"].includes(surname.verificationStatus)) {
      errors.push(`Generator surname ${surname.id} must be verified or partially verified`);
    }
    if (surname.candidateStatus && ["verified", "partially_verified"].includes(surname.verificationStatus) && (!surname.upstreamIds?.length || !surname.sourceIds.length)) {
      errors.push(`Surname ${surname.id} has no upstream pair evidence`);
    }
    for (const sourceId of surname.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`Surname ${surname.id} references missing source ${sourceId}`);
    }
    for (const event of surname.timeline) {
      if (event.sourceId && !sourceIds.has(event.sourceId)) {
        errors.push(`Surname ${surname.id} timeline references missing source ${event.sourceId}`);
      }
    }
    for (const region of surname.regions) {
      if (region.relativePopularity < 0 || region.relativePopularity > 100) {
        errors.push(`Surname ${surname.id} has out-of-range distribution value`);
      }
      if (region.sourceId && !sourceIds.has(region.sourceId)) {
        errors.push(`Surname ${surname.id} region references missing source ${region.sourceId}`);
      }
    }
    for (const id of surname.compatibleFirstNameIds) {
      if (!firstNameIds.has(id)) errors.push(`Surname ${surname.id} references missing first name ${id}`);
    }
  }

  for (const duplicate of duplicates(firstNames.map((item) => item.id))) {
    errors.push(`Duplicate first-name id: ${duplicate}`);
  }
  for (const duplicate of duplicates(firstNames.map((item) => item.slug))) {
    errors.push(`Duplicate first-name slug: ${duplicate}`);
  }
  for (const name of firstNames) {
    if (!name.slug || !name.romaji || !name.hiragana || name.variations.length === 0) {
      errors.push(`First name ${name.id} is missing slug, Romaji, Hiragana, or Kanji variation`);
    }
    if (name.isIndexable && !["verified", "partially_verified"].includes(name.verificationStatus)) {
      errors.push(`Indexable first name ${name.id} must be verified or partially verified`);
    }
    if (name.generatorEligible && !["verified", "partially_verified"].includes(name.verificationStatus)) {
      errors.push(`Generator first name ${name.id} must be verified or partially verified`);
    }
    if (name.candidateStatus && ["verified", "partially_verified"].includes(name.verificationStatus) && (!name.upstreamIds?.length || !name.sourceIds.length)) {
      errors.push(`First name ${name.id} has no upstream pair evidence`);
    }
    for (const sourceId of name.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`First name ${name.id} references missing source ${sourceId}`);
    }
    for (const id of name.compatibleSurnameIds) {
      if (!surnameIds.has(id)) errors.push(`First name ${name.id} references missing surname ${id}`);
    }
    for (const duplicate of duplicates(name.variations.map((variation) => variation.kanji))) {
      errors.push(`First name ${name.id} has duplicate Kanji variation ${duplicate}`);
    }
    for (const variation of name.variations) {
      if (["verified", "partially_verified"].includes(variation.verificationStatus) && !name.sourceIds.length) {
        errors.push(`Variation ${name.id}/${variation.kanji} has no source evidence`);
      }
    }
  }

  return errors;
}
