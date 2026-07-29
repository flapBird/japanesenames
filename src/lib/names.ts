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

function takeDiverseNames(
  candidates: GeneratedName[],
  count: number,
  request: GeneratorRequest,
  selected: GeneratedName[] = [],
) {
  const remaining = [...candidates];
  const usedSurnameIds = new Set(selected.map((item) => item.surname.id));
  const usedFirstNameIds = new Set(selected.map((item) => item.firstName.id));
  const previousSurnameIds = new Set(request.excludeSurnameIds ?? []);
  const previousFirstNameIds = new Set(request.excludeFirstNameIds ?? []);

  while (remaining.length > 0 && selected.length < count) {
    let bestIndex = 0;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < remaining.length; index += 1) {
      const candidate = remaining[index];
      let score = 0;

      if (
        request.lockedSurnameId ||
        !usedSurnameIds.has(candidate.surname.id)
      ) {
        score += 8;
      }
      if (
        request.lockedFirstNameId ||
        !usedFirstNameIds.has(candidate.firstName.id)
      ) {
        score += 8;
      }
      if (
        request.lockedSurnameId ||
        !previousSurnameIds.has(candidate.surname.id)
      ) {
        score += 2;
      }
      if (
        request.lockedFirstNameId ||
        !previousFirstNameIds.has(candidate.firstName.id)
      ) {
        score += 2;
      }

      if (score > bestScore) {
        bestIndex = index;
        bestScore = score;
      }
    }

    const [picked] = remaining.splice(bestIndex, 1);
    selected.push(picked);
    usedSurnameIds.add(picked.surname.id);
    usedFirstNameIds.add(picked.firstName.id);
  }

  return selected;
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

  const shuffled = seededShuffle(combinations, request.seed ?? 1);
  const excludedKeys = new Set(request.excludeKeys ?? []);

  if (excludedKeys.size === 0) {
    return takeDiverseNames(shuffled, count, request);
  }

  const unseen = shuffled.filter((item) => !excludedKeys.has(item.key));
  if (unseen.length >= count) {
    return takeDiverseNames(unseen, count, request);
  }

  // A narrow filter or two locked parts can exhaust the unseen pool.
  // Fill the remainder only then, so the generator stays useful rather
  // than returning fewer cards without explanation.
  const previouslySeen = shuffled.filter((item) => excludedKeys.has(item.key));
  const selected = takeDiverseNames(unseen, count, request);
  return takeDiverseNames(previouslySeen, count, request, selected);
}
