export type VerificationStatus =
  | "verified"
  | "partially_verified"
  | "needs_review";

export type PopularityLevel =
  | "very_common"
  | "common"
  | "uncommon"
  | "rare";

export type OriginConfidence =
  | "well_documented"
  | "common_interpretation"
  | "multiple_possible_origins"
  | "literal_interpretation_only"
  | "uncertain";

export type NameStyle = "modern" | "traditional" | "timeless";
export type Gender = "girl" | "boy" | "unisex";
export type Naturalness =
  | "high"
  | "medium"
  | "fiction_friendly"
  | "needs_review";

export interface SourceReference {
  id: string;
  title: string;
  publisher?: string;
  url: string;
  publishedAt?: string;
  accessedAt?: string;
}

export interface KanjiMeaning {
  kanji: string;
  meanings: string[];
  nameReadings?: string[];
}

export interface PrefectureDistribution {
  prefectureCode: string;
  prefectureName: string;
  relativePopularity: number;
  dataType: "modern_distribution" | "historical_origin";
  sourceId?: string;
}

export interface SurnameRecord {
  id: string;
  slug: string;
  kanji: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  literalMeaning: string;
  summary: string;
  kanjiBreakdown: KanjiMeaning[];
  popularityRank?: number;
  popularityLevel: PopularityLevel;
  originTypes: Array<
    | "topographic"
    | "geographic"
    | "clan"
    | "occupation"
    | "historical"
    | "uncertain"
  >;
  originConfidence: OriginConfidence;
  originIllustrationKey:
    | "mountain-base"
    | "rice-field"
    | "river-mouth"
    | "bridge"
    | "forest"
    | "village-center"
    | "island-coast"
    | "shrine"
    | "castle"
    | "clan"
    | "occupation"
    | "uncertain";
  regions: PrefectureDistribution[];
  timeline: Array<{
    period: string;
    year?: number;
    title: string;
    description: string;
    surnameSpecific: boolean;
    sourceId?: string;
  }>;
  compatibleFirstNameIds: string[];
  verificationStatus: VerificationStatus;
  sourceIds: string[];
  isIndexable: boolean;
}

export interface FirstNameVariation {
  kanji: string;
  meanings: string[];
  kanjiBreakdown: KanjiMeaning[];
  naturalness: Naturalness;
  verificationStatus: VerificationStatus;
}

export interface FirstNameRecord {
  id: string;
  slug: string;
  romaji: string;
  hiragana: string;
  katakana?: string;
  genders: Gender[];
  styles: NameStyle[];
  meaningTags: string[];
  popularityLevel: PopularityLevel;
  syllableCount?: number;
  kanjiLengthOptions: number[];
  variations: FirstNameVariation[];
  compatibleSurnameIds: string[];
  verificationStatus: VerificationStatus;
  sourceIds: string[];
  isIndexable: boolean;
}

export type NameMode = "realistic" | "fiction_friendly" | "any";
export type NameOrder = "japanese" | "western";
export type KanjiTarget = "given-name" | "surname" | "either";

export interface KanjiFilter {
  kanji?: string;
  target?: KanjiTarget;
}

export interface GeneratorFilters {
  gender: Gender | "any";
  style: NameStyle | "any";
  mode: NameMode;
  meaning: string | "any";
  kanjiLength: 1 | 2 | 3 | "any";
  surnamePopularity: "common" | "uncommon" | "rare" | "any";
}

export interface GeneratedName {
  key: string;
  surname: SurnameRecord;
  firstName: FirstNameRecord;
  variation: FirstNameVariation;
  naturalness: Naturalness;
}

export interface GeneratorRequest {
  filters: GeneratorFilters;
  kanjiFilter?: KanjiFilter;
  lockedSurnameId?: string;
  lockedFirstNameId?: string;
  excludeKeys?: string[];
  excludeSurnameIds?: string[];
  excludeFirstNameIds?: string[];
  count?: number;
  seed?: number;
}

export interface GeneratedNameBatch {
  results: GeneratedName[];
  exactCount: number;
  relaxedFilters: Array<keyof GeneratorFilters>;
  reusedCount: number;
}
