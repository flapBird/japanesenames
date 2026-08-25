import { firstNames } from "@/data";
import {
  type AINameMatchTag,
  type AINameRecommendation,
  type IntentSoftSignal,
  type IntentStyle,
  type IntentTheme,
  type NameIntent,
} from "@/lib/ai/schema";
import { getMeaningPreview } from "@/lib/name-display";
import { generateNameBatch, getBrowseableSurnames } from "@/lib/names";
import type {
  FirstNameRecord,
  FirstNameVariation,
  GeneratorFilters,
  SurnameRecord,
} from "@/types/names";

const themeEvidenceTerms: Record<IntentTheme, string[]> = {
  nature: ["nature", "natural", "forest", "tree", "earth", "leaf"],
  beauty: ["beauty", "beautiful"],
  hope: ["hope", "wish", "future"],
  light: ["light", "bright", "shine", "radiance", "ray"],
  strength: ["strength", "strong", "power", "healthy"],
  wisdom: ["wisdom", "wise", "intelligence", "knowledge"],
  love: ["love", "affection", "beloved"],
  peace: ["peace", "harmony", "calm"],
  moon: ["moon", "lunar"],
  water: ["water", "river", "rain"],
  fire: ["fire", "flame", "blaze"],
  night: ["night", "midnight", "evening"],
  flower: ["flower", "blossom", "bloom", "cherry"],
  ocean: ["ocean", "sea", "marine"],
  sky: ["sky", "heaven", "firmament"],
  sun: ["sun", "solar", "sunlight"],
  star: ["star", "stellar"],
};

const creativeSignalMap: Record<
  IntentSoftSignal,
  { themes: IntentTheme[]; styles: IntentStyle[] }
> = {
  calm: { themes: ["peace", "water", "moon"], styles: ["timeless"] },
  strong: { themes: ["strength", "fire"], styles: [] },
  gentle: { themes: ["peace", "water", "flower"], styles: ["timeless"] },
  elegant: { themes: ["beauty", "moon"], styles: ["timeless", "traditional"] },
  mysterious: { themes: ["night", "moon", "star"], styles: [] },
  cute: { themes: ["flower", "love"], styles: ["modern"] },
  dark: { themes: ["night", "fire"], styles: [] },
  brave: { themes: ["strength", "fire", "hope"], styles: [] },
  noble: { themes: ["wisdom", "strength"], styles: ["traditional", "timeless"] },
  bright: { themes: ["light", "hope", "sun"], styles: ["modern"] },
};

interface RankedFirstName {
  firstName: FirstNameRecord;
  variation: FirstNameVariation;
  score: number;
  directThemes: IntentTheme[];
  directStyles: IntentStyle[];
  creativeSignals: IntentSoftSignal[];
}

interface RankedSurname {
  surname: SurnameRecord;
  score: number;
  directThemes: IntentTheme[];
  creativeSignals: IntentSoftSignal[];
}

function normalizedEvidence(values: string[]) {
  return values.join(" ").toLowerCase();
}

function matchesTheme(text: string, theme: IntentTheme) {
  return themeEvidenceTerms[theme].some((term) => text.includes(term));
}

function firstNameEvidence(
  firstName: FirstNameRecord,
  variation: FirstNameVariation,
) {
  return normalizedEvidence([
    ...firstName.meaningTags,
    ...variation.meanings,
    ...variation.kanjiBreakdown.flatMap((part) => part.meanings),
  ]);
}

function surnameEvidence(surname: SurnameRecord) {
  return normalizedEvidence([
    surname.literalMeaning,
    ...surname.kanjiBreakdown.flatMap((part) => part.meanings),
  ]);
}

function titleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function creativeMatches(
  intent: NameIntent,
  themes: IntentTheme[],
  styles: IntentStyle[],
) {
  return intent.softSignals.filter((signal) => {
    const mapping = creativeSignalMap[signal];
    return (
      mapping.themes.some((theme) => themes.includes(theme)) ||
      mapping.styles.some((style) => styles.includes(style))
    );
  });
}

function matchTags(
  directThemes: IntentTheme[],
  directStyles: IntentStyle[],
  creativeSignals: IntentSoftSignal[],
): AINameMatchTag[] {
  const tags: AINameMatchTag[] = [
    ...directThemes.map((theme) => ({
      label: titleCase(theme),
      evidence: "direct" as const,
    })),
    ...directStyles.map((style) => ({
      label: titleCase(style),
      evidence: "direct" as const,
    })),
    ...creativeSignals.map((signal) => ({
      label: titleCase(signal),
      evidence: "creative" as const,
    })),
  ];
  return tags.length > 0
    ? tags.slice(0, 4)
    : [{ label: "Source-backed record", evidence: "source" }];
}

function whyFirstNameFits(candidate: RankedFirstName) {
  const sentences: string[] = [];
  if (candidate.directThemes.length > 0) {
    sentences.push(
      `Its stored kanji meaning directly connects with ${candidate.directThemes
        .map(titleCase)
        .join(" and ")}.`,
    );
  }
  if (candidate.directStyles.length > 0) {
    sentences.push(
      `The record is editorially tagged ${candidate.directStyles
        .map(titleCase)
        .join(" and ")}.`,
    );
  }
  if (candidate.creativeSignals.length > 0) {
    sentences.push(
      `Those documented associations are a creative fit for the ${candidate.creativeSignals
        .map(titleCase)
        .join(" and ")} tone you described.`,
    );
  }
  if (sentences.length === 0) {
    sentences.push(
      "This is a broader source-backed match selected from a documented spelling-and-reading record.",
    );
  }
  return sentences.join(" ");
}

function rankedFirstNames(intent: NameIntent, ignoreAvoid = false) {
  const candidates: RankedFirstName[] = [];
  for (const firstName of firstNames) {
    const eligible =
      (firstName.generatorEligible ??
        firstName.verificationStatus !== "needs_review") &&
      ["verified", "partially_verified"].includes(
        firstName.verificationStatus,
      );
    if (!eligible) continue;
    if (
      intent.gender !== "any" &&
      !firstName.genders.includes(intent.gender)
    ) {
      continue;
    }

    for (const variation of firstName.variations) {
      if (
        !["verified", "partially_verified"].includes(
          variation.verificationStatus,
        ) ||
        variation.naturalness === "needs_review" ||
        (intent.mode === "realistic" &&
          !["high", "medium"].includes(variation.naturalness))
      ) {
        continue;
      }
      const evidence = firstNameEvidence(firstName, variation);
      if (
        !ignoreAvoid &&
        intent.avoidThemes.some((theme) => matchesTheme(evidence, theme))
      ) {
        continue;
      }
      const directThemes = intent.themes.filter((theme) =>
        matchesTheme(evidence, theme),
      );
      const directStyles = intent.styles.filter((style) =>
        firstName.styles.includes(style),
      );
      const evidenceThemes = (Object.keys(themeEvidenceTerms) as IntentTheme[])
        .filter((theme) => matchesTheme(evidence, theme));
      const creativeSignals = creativeMatches(
        intent,
        evidenceThemes,
        firstName.styles,
      );
      let score =
        directThemes.length * 50 +
        directStyles.length * 16 +
        creativeSignals.length * 10;
      if (!firstName.candidateStatus) score += 8;
      if (firstName.curationPriority === "recommended") score += 7;
      if (variation.naturalness === "high") score += 5;
      if (["very_common", "common"].includes(firstName.popularityLevel)) {
        score += 3;
      }
      candidates.push({
        firstName,
        variation,
        score,
        directThemes,
        directStyles,
        creativeSignals,
      });
    }
  }
  return candidates.sort(
    (left, right) =>
      right.score - left.score ||
      left.firstName.romaji.localeCompare(right.firstName.romaji) ||
      left.variation.kanji.localeCompare(right.variation.kanji),
  );
}

function uniqueFirstNameSet(candidates: RankedFirstName[], variant: number) {
  const unique: RankedFirstName[] = [];
  const seen = new Set<string>();
  for (const candidate of candidates) {
    if (seen.has(candidate.firstName.id)) continue;
    seen.add(candidate.firstName.id);
    unique.push(candidate);
  }
  const poolSize = Math.min(unique.length, 30);
  const offset = poolSize > 0 ? (variant * 5) % poolSize : 0;
  return [...unique.slice(offset, poolSize), ...unique.slice(0, offset)];
}

function givenRecommendation(
  candidate: RankedFirstName,
): AINameRecommendation {
  const { firstName, variation } = candidate;
  return {
    id: `ai-given:${firstName.id}:${variation.kanji}`,
    kind: "given",
    kanji: variation.kanji,
    kana: firstName.hiragana,
    romaji: firstName.romaji,
    pronunciation: firstName.hiragana,
    meaning: getMeaningPreview(variation),
    gender: firstName.genders,
    matchTags: matchTags(
      candidate.directThemes,
      candidate.directStyles,
      candidate.creativeSignals,
    ),
    whyItFits: whyFirstNameFits(candidate),
    detailHref: firstName.isIndexable
      ? `/name/${firstName.slug}`
      : undefined,
    useInGeneratorHref: `/?firstName=${firstName.id}#generator`,
  };
}

function hashSeed(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 1;
}

function fullRecommendation(
  candidate: RankedFirstName,
  intent: NameIntent,
  seed: number,
): AINameRecommendation | undefined {
  const filters: GeneratorFilters = {
    gender: intent.gender,
    style: "any",
    mode: intent.mode,
    meaning: "any",
    kanjiLength: "any",
    surnamePopularity: intent.surnamePopularity,
  };
  const batch = generateNameBatch({
    filters,
    lockedFirstNameId: candidate.firstName.id,
    count: 36,
    seed,
  });
  const generated =
    batch.results.find(
      (item) => item.variation.kanji === candidate.variation.kanji,
    ) ?? batch.results[0];
  if (!generated) return undefined;

  const japaneseOrder = `${generated.surname.kanji} ${candidate.variation.kanji}`;
  const westernOrder = `${candidate.firstName.romaji} ${generated.surname.romaji}`;
  const pronunciation = `${generated.surname.hiragana} ${candidate.firstName.hiragana}`;
  return {
    id: `ai-full:${generated.surname.id}:${candidate.firstName.id}:${candidate.variation.kanji}`,
    kind: "full",
    kanji: japaneseOrder,
    kana: pronunciation,
    romaji: westernOrder,
    pronunciation,
    japaneseOrder,
    westernOrder,
    meaning: `Given name: ${getMeaningPreview(candidate.variation)}. Surname: ${generated.surname.literalMeaning}.`,
    gender: candidate.firstName.genders,
    matchTags: matchTags(
      candidate.directThemes,
      candidate.directStyles,
      candidate.creativeSignals,
    ),
    whyItFits: `${whyFirstNameFits(candidate)} The family name is selected through the existing structured full-name generator.`,
    useInGeneratorHref: `/?surname=${generated.surname.id}&firstName=${candidate.firstName.id}#generator`,
  };
}

function rankedSurnames(intent: NameIntent, ignoreAvoid = false) {
  const candidates: RankedSurname[] = [];
  for (const surname of getBrowseableSurnames()) {
    if (
      intent.surnamePopularity === "common" &&
      !["very_common", "common"].includes(surname.popularityLevel)
    ) {
      continue;
    }
    const evidence = surnameEvidence(surname);
    if (
      !ignoreAvoid &&
      intent.avoidThemes.some((theme) => matchesTheme(evidence, theme))
    ) {
      continue;
    }
    const directThemes = intent.themes.filter((theme) =>
      matchesTheme(evidence, theme),
    );
    const evidenceThemes = (Object.keys(themeEvidenceTerms) as IntentTheme[])
      .filter((theme) => matchesTheme(evidence, theme));
    const creativeSignals = creativeMatches(intent, evidenceThemes, []);
    let score = directThemes.length * 50 + creativeSignals.length * 10;
    if (surname.isIndexable) score += 8;
    if (surname.curationPriority === "recommended") score += 7;
    if (["very_common", "common"].includes(surname.popularityLevel)) score += 4;
    candidates.push({ surname, score, directThemes, creativeSignals });
  }
  return candidates.sort(
    (left, right) =>
      right.score - left.score ||
      left.surname.romaji.localeCompare(right.surname.romaji),
  );
}

function surnameRecommendation(
  candidate: RankedSurname,
): AINameRecommendation {
  const { surname } = candidate;
  const sentences = candidate.directThemes.length
    ? `Its stored kanji meaning directly connects with ${candidate.directThemes
        .map(titleCase)
        .join(" and ")}.`
    : "This is a broader match from a source-backed Japanese surname record.";
  const creative = candidate.creativeSignals.length
    ? ` That documented meaning is a creative fit for the ${candidate.creativeSignals
        .map(titleCase)
        .join(" and ")} tone you described.`
    : "";
  return {
    id: `ai-surname:${surname.id}`,
    kind: "surname",
    kanji: surname.kanji,
    kana: surname.hiragana,
    romaji: surname.romaji,
    pronunciation: surname.hiragana,
    meaning: surname.literalMeaning,
    gender: [],
    matchTags: matchTags(
      candidate.directThemes,
      [],
      candidate.creativeSignals,
    ),
    whyItFits: `${sentences}${creative}`,
    detailHref: surname.isIndexable
      ? `/surname/${surname.slug}`
      : undefined,
    useInGeneratorHref: `/?surname=${surname.id}#generator`,
  };
}

export function recommendNames(
  intent: NameIntent,
  prompt: string,
  variant = 0,
) {
  const relaxedPreferences: string[] = [];
  if (intent.nameType === "surname") {
    let candidates = rankedSurnames(intent);
    if (candidates.length < 5 && intent.avoidThemes.length > 0) {
      candidates = rankedSurnames(intent, true);
      relaxedPreferences.push("avoid themes");
    }
    const poolSize = Math.min(candidates.length, 30);
    const offset = poolSize > 0 ? (variant * 5) % poolSize : 0;
    const ordered = [
      ...candidates.slice(offset, poolSize),
      ...candidates.slice(0, offset),
    ];
    for (const theme of intent.themes) {
      if (!candidates.some((candidate) => candidate.directThemes.includes(theme))) {
        relaxedPreferences.push(`${titleCase(theme)} theme`);
      }
    }
    return {
      results: ordered.slice(0, 5).map(surnameRecommendation),
      relaxedPreferences,
    };
  }

  let candidates = rankedFirstNames(intent);
  if (candidates.length < 5 && intent.avoidThemes.length > 0) {
    candidates = rankedFirstNames(intent, true);
    relaxedPreferences.push("avoid themes");
  }
  const ordered = uniqueFirstNameSet(candidates, variant);
  for (const theme of intent.themes) {
    if (!candidates.some((candidate) => candidate.directThemes.includes(theme))) {
      relaxedPreferences.push(`${titleCase(theme)} theme`);
    }
  }
  for (const style of intent.styles) {
    if (!candidates.some((candidate) => candidate.directStyles.includes(style))) {
      relaxedPreferences.push(`${titleCase(style)} style`);
    }
  }

  if (intent.nameType === "given") {
    return {
      results: ordered.slice(0, 5).map(givenRecommendation),
      relaxedPreferences,
    };
  }

  const results = ordered
    .slice(0, 10)
    .map((candidate, index) =>
      fullRecommendation(
        candidate,
        intent,
        hashSeed(`${prompt}:${variant}:${index}`),
      ),
    )
    .filter((item): item is AINameRecommendation => Boolean(item))
    .slice(0, 5);
  return { results, relaxedPreferences };
}
