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
  GeneratedNameBatch,
  GeneratorFilters,
  GeneratorRequest,
  Naturalness,
  PopularityLevel,
  SurnameRecord,
} from "@/types/names";
import { containsKanji } from "@/lib/kanji";

export function getSurnameBySlug(slug: string) {
  return surnameBySlug.get(slug);
}

export function getFirstNameBySlug(slug: string) {
  return firstNameBySlug.get(slug);
}

export function getIndexableSurnames() {
  return surnames.filter(
    (item) =>
      item.isIndexable &&
      ["verified", "partially_verified"].includes(item.verificationStatus),
  );
}

export function getIndexableFirstNames() {
  return firstNames.filter(
    (item) =>
      item.isIndexable &&
      ["verified", "partially_verified"].includes(item.verificationStatus),
  );
}

export function getBrowseableSurnames() {
  return surnames.filter(
    (item) =>
      (item.generatorEligible ?? item.verificationStatus !== "needs_review") &&
      ["verified", "partially_verified"].includes(item.verificationStatus),
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
    const generatorEligible =
      name.generatorEligible ?? name.verificationStatus !== "needs_review";
    if (!generatorEligible || !["verified", "partially_verified"].includes(name.verificationStatus)) return false;
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
        return variation.naturalness !== "needs_review";
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
    (surname.generatorEligible ?? surname.verificationStatus !== "needs_review") &&
    ["verified", "partially_verified"].includes(surname.verificationStatus) &&
    surnameMatchesPopularity(
      surname.popularityLevel,
      request.filters.surnamePopularity,
    ),
  );
}

export function getKanjiShortcutCount(
  kanji: string,
  target: "given-name" | "surname",
  filters: GeneratorFilters,
) {
  if (target === "given-name") {
    return firstNameCandidates({ filters }).filter((name) =>
      name.variations.some((variation) =>
        ["verified", "partially_verified"].includes(variation.verificationStatus) &&
        containsKanji(variation.kanji, kanji),
      ),
    ).length;
  }
  return surnameCandidates({ filters }).filter((surname) =>
    containsKanji(surname.kanji, kanji),
  ).length;
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

function variationMatchesMode(
  naturalness: Naturalness,
  mode: GeneratorFilters["mode"],
) {
  if (mode === "any") return true;
  if (mode === "realistic") {
    return naturalness === "high" || naturalness === "medium";
  }
  return naturalness !== "needs_review";
}

function matchesKanjiFilter(
  surnameKanji: string,
  givenNameKanji: string,
  request: GeneratorRequest,
) {
  const kanji = request.kanjiFilter?.kanji;
  if (!kanji) return true;

  const target = request.kanjiFilter?.target ?? "given-name";
  if (target === "surname") return containsKanji(surnameKanji, kanji);
  if (target === "either") {
    return (
      containsKanji(givenNameKanji, kanji) ||
      containsKanji(surnameKanji, kanji)
    );
  }
  return containsKanji(givenNameKanji, kanji);
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
      const firstCount = request.shownFirstNameCounts?.[candidate.firstName.id] ?? 0;
      const surnameCount = request.shownSurnameCounts?.[candidate.surname.id] ?? 0;
      const variationCount = request.shownVariationCounts?.[candidate.variation.kanji] ?? 0;
      // Keys already shown are removed before this ranking. Least-used parts
      // then win, with the seeded source order providing deterministic ties.
      score -= firstCount * 1000 + surnameCount * 100 + variationCount * 10;

      // Dictionary breadth remains available for exact Kanji searches, while
      // the default generator favors a smaller usability-reviewed shortlist.
      if (!candidate.firstName.candidateStatus || candidate.firstName.curationPriority === "recommended") score += 100_000;
      if (!candidate.surname.candidateStatus || candidate.surname.curationPriority === "recommended") score += 10_000;
      if (!request.lockedFirstNameId && usedFirstNameIds.has(candidate.firstName.id)) score -= 200_000;
      if (!request.lockedSurnameId && usedSurnameIds.has(candidate.surname.id)) score -= 20_000;

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
  const shuffled = matchingCombinations(request);
  const excludedKeys = new Set(request.excludeKeys ?? []);

  return takeDiverseNames(
    shuffled.filter((item) => !excludedKeys.has(item.key)),
    count,
    request,
  );
}

function matchingCombinations(request: GeneratorRequest) {
  const names = firstNameCandidates(request);
  const familyNames = surnameCandidates(request);
  const combinations: GeneratedName[] = [];

  for (const surname of familyNames) {
    for (const firstName of names) {
      for (const variation of firstName.variations) {
        if (!["verified", "partially_verified"].includes(variation.verificationStatus)) continue;
        if (
          request.filters.kanjiLength !== "any" &&
          [...variation.kanji].length !== request.filters.kanjiLength
        ) {
          continue;
        }
        if (!variationMatchesMode(variation.naturalness, request.filters.mode)) continue;
        if (!matchesKanjiFilter(surname.kanji, variation.kanji, request)) {
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

  return seededShuffle(combinations, request.seed ?? 1);
}

export function generateNameBatch(
  request: GeneratorRequest,
): GeneratedNameBatch {
  const count = request.count ?? 6;
  const excludedKeys = new Set(request.excludeKeys ?? []);
  const allExactMatches = matchingCombinations(request);
  const exactPool = allExactMatches.filter(
    (item) => !excludedKeys.has(item.key),
  );
  const selected = takeDiverseNames(exactPool, count, request);
  return {
    results: selected,
    exactCount: selected.length,
    relaxedFilters: [],
    reusedCount: 0,
    poolCount: allExactMatches.length,
  };
}
