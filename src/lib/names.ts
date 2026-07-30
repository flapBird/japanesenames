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

function variationMatchesMode(
  naturalness: Naturalness,
  mode: GeneratorFilters["mode"],
) {
  if (mode === "any") return true;
  if (mode === "realistic") {
    return naturalness === "high" || naturalness === "medium";
  }
  return naturalness === "fiction_friendly";
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

function matchingCombinations(request: GeneratorRequest) {
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

const broadFilters: GeneratorFilters = {
  gender: "any",
  style: "any",
  mode: "any",
  meaning: "any",
  kanjiLength: "any",
  surnamePopularity: "any",
};

const filterWeights: Record<keyof GeneratorFilters, number> = {
  gender: 8,
  style: 5,
  mode: 4,
  meaning: 6,
  kanjiLength: 3,
  surnamePopularity: 2,
};

function mismatchedFilters(
  item: GeneratedName,
  filters: GeneratorFilters,
): Array<keyof GeneratorFilters> {
  const mismatches: Array<keyof GeneratorFilters> = [];
  if (
    filters.gender !== "any" &&
    !item.firstName.genders.includes(filters.gender)
  ) {
    mismatches.push("gender");
  }
  if (
    filters.style !== "any" &&
    !item.firstName.styles.includes(filters.style)
  ) {
    mismatches.push("style");
  }
  if (!variationMatchesMode(item.variation.naturalness, filters.mode)) {
    mismatches.push("mode");
  }
  if (
    filters.meaning !== "any" &&
    !item.firstName.meaningTags.includes(filters.meaning.toLowerCase())
  ) {
    mismatches.push("meaning");
  }
  if (
    filters.kanjiLength !== "any" &&
    [...item.variation.kanji].length !== filters.kanjiLength
  ) {
    mismatches.push("kanjiLength");
  }
  if (
    !surnameMatchesPopularity(
      item.surname.popularityLevel,
      filters.surnamePopularity,
    )
  ) {
    mismatches.push("surnamePopularity");
  }
  return mismatches;
}

function takeClosestDiverseNames(
  candidates: GeneratedName[],
  count: number,
  request: GeneratorRequest,
  selected: GeneratedName[],
) {
  const remaining = [...candidates];
  const usedSurnameIds = new Set(selected.map((item) => item.surname.id));
  const usedFirstNameIds = new Set(selected.map((item) => item.firstName.id));

  while (remaining.length > 0 && selected.length < count) {
    let bestIndex = 0;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < remaining.length; index += 1) {
      const candidate = remaining[index];
      const mismatches = new Set(
        mismatchedFilters(candidate, request.filters),
      );
      let score = 0;

      for (const [filter, weight] of Object.entries(filterWeights) as Array<
        [keyof GeneratorFilters, number]
      >) {
        if (request.filters[filter] !== "any" && !mismatches.has(filter)) {
          score += weight * 100;
        }
      }
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
  const exactCount = selected.length;

  if (selected.length === count) {
    return {
      results: selected,
      exactCount,
      relaxedFilters: [],
      reusedCount: 0,
    };
  }

  if (request.kanjiFilter?.kanji) {
    const beforeReuse = selected.length;
    const selectedKeys = new Set(selected.map((item) => item.key));
    const previouslySeenExact = allExactMatches.filter(
      (item) => excludedKeys.has(item.key) && !selectedKeys.has(item.key),
    );
    takeDiverseNames(previouslySeenExact, count, request, selected);

    return {
      results: selected,
      exactCount: selected.length,
      relaxedFilters: [],
      reusedCount: selected.length - beforeReuse,
    };
  }

  const selectedKeys = new Set(selected.map((item) => item.key));
  const broadRequest: GeneratorRequest = {
    ...request,
    filters: broadFilters,
    excludeKeys: [],
  };
  const broadPool = matchingCombinations(broadRequest);
  const unseenFallback = broadPool.filter(
    (item) => !excludedKeys.has(item.key) && !selectedKeys.has(item.key),
  );
  takeClosestDiverseNames(unseenFallback, count, request, selected);

  let reusedCount = 0;
  if (selected.length < count) {
    const beforeReuse = selected.length;
    const currentKeys = new Set(selected.map((item) => item.key));
    const previouslySeen = broadPool.filter(
      (item) => excludedKeys.has(item.key) && !currentKeys.has(item.key),
    );
    takeClosestDiverseNames(previouslySeen, count, request, selected);
    reusedCount = selected.length - beforeReuse;
  }

  const relaxedFilters = [
    ...new Set(
      selected
        .slice(exactCount)
        .flatMap((item) => mismatchedFilters(item, request.filters)),
    ),
  ];

  return {
    results: selected,
    exactCount,
    relaxedFilters,
    reusedCount,
  };
}
