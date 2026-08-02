export type VerificationStatus =
  | "verified"
  | "partially_verified"
  | "needs_review"
  | "imported_unreviewed";

export type CandidateStatus =
  | "imported_unreviewed"
  | "partially_verified"
  | "needs_review"
  | "verified";

export type EvidenceType =
  | "reading_kanji_pair"
  | "gender_classification"
  | "allowed_name_kanji"
  | "popularity"
  | "meaning"
  | "style"
  | "surname_origin"
  | "regional_distribution";

export type PopularityLevel =
  | "very_common"
  | "common"
  | "uncommon"
  | "rare"
  | "unranked";

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
  sourceId?: string;
  upstreamEntryId?: string;
  title: string;
  publisher?: string;
  url: string;
  publishedAt?: string;
  accessedAt?: string;
  datasetVersion?: string;
  license?: string;
  evidenceType?: EvidenceType;
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
  generatorEligible?: boolean;
  curationPriority?: "recommended" | "extended";
  candidateStatus?: CandidateStatus;
  reviewNotes?: string;
  upstreamIds?: string[];
  classificationBasis?: string;
  popularityEvidence?: string;
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
  generatorEligible?: boolean;
  curationPriority?: "recommended" | "extended";
  candidateStatus?: CandidateStatus;
  reviewNotes?: string;
  upstreamIds?: string[];
  classificationBasis?: string;
  popularityEvidence?: string;
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
  shownFirstNameCounts?: Record<string, number>;
  shownVariationCounts?: Record<string, number>;
  shownSurnameCounts?: Record<string, number>;
  count?: number;
  seed?: number;
}

export interface GeneratedNameBatch {
  results: GeneratedName[];
  exactCount: number;
  relaxedFilters: Array<keyof GeneratorFilters>;
  reusedCount: number;
  poolCount: number;
}
