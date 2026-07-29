import {
  firstNameById,
  firstNameBySlug,
  firstNames,
  surnameById,
  surnameBySlug,
  surnames,
} from "@/data";
import type {
  FirstNameRecord,
  GeneratedName,
  GeneratorRequest,
  Naturalness,
  PopularityLevel,
  SurnameRecord,
} from "@/types/names";

export function getSurnameBySlug(slug: string) {
  return surnameBySlug.get(slug);
}

export function getFirstNameBySlug(slug: string) {
  return firstNameBySlug.get(slug);
}

export function getIndexableSurnames() {
  return surnames.filter(
    (item) => item.isIndexable && item.verificationStatus !== "needs_review",
  );
}

export function getIndexableFirstNames() {
  return firstNames.filter(
    (item) => item.isIndexable && item.verificationStatus !== "needs_review",
  );
}

function surnameMatchesPopularity(
  popularity: PopularityLevel,
  filter: GeneratorRequest["filters"]["surnamePopularity"],
) {
  if (filter === "any") return true;
  if (filter === "common")
    return popularity === "very_common" || popularity === "common";
  return popularity === filter;
}

function firstNameCandidates(request: GeneratorRequest) {
  const { filters, lockedFirstNameId } = request;
  const pool = lockedFirstNameId
    ? [firstNameById.get(lockedFirstNameId)].filter(
        (item): item is FirstNameRecord => Boolean(item),
      )
    : firstNames;

  return pool.filter((name) => {
    if (name.verificationStatus === "needs_review") return false;
    if (
      filters.gender !== "any" &&
      !name.genders.includes(filters.gender)
    ) {
      return false;
    }
    if (filters.style !== "any" && !name.styles.includes(filters.style)) {
      return false;
    }
    if (
      filters.meaning !== "any" &&
      !name.meaningTags.includes(filters.meaning.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.kanjiLength !== "any" &&
      !name.kanjiLengthOptions.includes(filters.kanjiLength)
    ) {
      return false;
    }
    return name.variations.some((variation) => {
      if (
        filters.kanjiLength !== "any" &&
        [...variation.kanji].length !== filters.kanjiLength
      ) {
        return false;
      }
      if (filters.mode === "realistic") {
        return (
          variation.naturalness === "high" ||
          variation.naturalness === "medium"
        );
      }
      if (filters.mode === "fiction_friendly") {
        return variation.naturalness === "fiction_friendly";
      }
      return true;
    });
  });
}

function surnameCandidates(request: GeneratorRequest) {
  const pool = request.lockedSurnameId
    ? [surnameById.get(request.lockedSurnameId)].filter(
        (item): item is SurnameRecord => Boolean(item),
      )
    : surnames;

  return pool.filter((surname) =>
    surname.verificationStatus !== "needs_review" &&
    surnameMatchesPopularity(
      surname.popularityLevel,
      request.filters.surnamePopularity,
    ),
  );
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed || 1;
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function combinationNaturalness(
  variationNaturalness: Naturalness,
  compatible: boolean,
): Naturalness {
  if (variationNaturalness === "needs_review") return "needs_review";
  if (variationNaturalness === "fiction_friendly") return "fiction_friendly";
  if (!compatible) return "medium";
  return variationNaturalness;
}

export function generateNames(request: GeneratorRequest): GeneratedName[] {
  const count = request.count ?? 6;
  const names = firstNameCandidates(request);
  const familyNames = surnameCandidates(request);
  const combinations: GeneratedName[] = [];

  for (const surname of familyNames) {
    for (const firstName of names) {
      for (const variation of firstName.variations) {
        if (variation.verificationStatus === "needs_review") continue;
        if (
          request.filters.kanjiLength !== "any" &&
          [...variation.kanji].length !== request.filters.kanjiLength
        ) {
          continue;
        }
        if (
          request.filters.mode === "realistic" &&
          !["high", "medium"].includes(variation.naturalness)
        ) {
          continue;
        }
        if (
          request.filters.mode === "fiction_friendly" &&
          variation.naturalness !== "fiction_friendly"
        ) {
          continue;
        }
        combinations.push({
          key: `${surname.id}:${firstName.id}:${variation.kanji}`,
          surname,
          firstName,
          variation,
          naturalness: combinationNaturalness(
            variation.naturalness,
            firstName.compatibleSurnameIds.includes(surname.id),
          ),
        });
      }
    }
  }

  return seededShuffle(combinations, request.seed ?? 1).slice(0, count);
}
