export const intentGenders = ["girl", "boy", "unisex", "any"] as const;
export const intentNameTypes = ["given", "surname", "full"] as const;
export const intentThemes = [
  "nature",
  "beauty",
  "hope",
  "light",
  "strength",
  "wisdom",
  "love",
  "peace",
  "moon",
  "water",
  "fire",
  "night",
  "flower",
  "ocean",
  "sky",
  "sun",
  "star",
] as const;
export const intentStyles = ["modern", "traditional", "timeless"] as const;
export const intentModes = ["realistic", "fiction_friendly"] as const;
export const intentUsages = [
  "real_person",
  "character",
  "anime",
  "game",
  "writer",
  "baby",
  "other",
] as const;
export const intentSoftSignals = [
  "calm",
  "strong",
  "gentle",
  "elegant",
  "mysterious",
  "cute",
  "dark",
  "brave",
  "noble",
  "bright",
] as const;
export const intentSurnamePopularity = ["common", "any"] as const;

export type IntentGender = (typeof intentGenders)[number];
export type IntentNameType = (typeof intentNameTypes)[number];
export type IntentTheme = (typeof intentThemes)[number];
export type IntentStyle = (typeof intentStyles)[number];
export type IntentMode = (typeof intentModes)[number];
export type IntentUsage = (typeof intentUsages)[number];
export type IntentSoftSignal = (typeof intentSoftSignals)[number];
export type IntentSurnamePopularity =
  (typeof intentSurnamePopularity)[number];

export interface NameIntent {
  gender: IntentGender;
  nameType: IntentNameType;
  themes: IntentTheme[];
  styles: IntentStyle[];
  mode: IntentMode;
  usage: IntentUsage;
  softSignals: IntentSoftSignal[];
  surnamePopularity: IntentSurnamePopularity;
  avoidThemes: IntentTheme[];
}

export interface AINameMatchTag {
  label: string;
  evidence: "direct" | "creative" | "source";
}

export interface AINameRecommendation {
  id: string;
  kind: IntentNameType;
  kanji: string;
  kana: string;
  romaji: string;
  pronunciation: string;
  meaning: string;
  gender: string[];
  japaneseOrder?: string;
  westernOrder?: string;
  matchTags: AINameMatchTag[];
  whyItFits: string;
  detailHref?: string;
  useInGeneratorHref?: string;
}

export interface AINameGeneratorSuccess {
  ok: true;
  intent: NameIntent;
  parser: "ai" | "fallback";
  results: AINameRecommendation[];
  relaxedPreferences: string[];
  notice?: string;
}

export interface AINameGeneratorError {
  ok: false;
  code:
    | "invalid_request"
    | "empty_prompt"
    | "prompt_too_long"
    | "rate_limited"
    | "feature_disabled"
    | "no_results";
  message: string;
}

export type AINameGeneratorResponse =
  | AINameGeneratorSuccess
  | AINameGeneratorError;

export const defaultNameIntent: NameIntent = {
  gender: "any",
  nameType: "given",
  themes: [],
  styles: [],
  mode: "realistic",
  usage: "other",
  softSignals: [],
  surnamePopularity: "any",
  avoidThemes: [],
};

export const nameIntentJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gender: { type: "string", enum: intentGenders },
    nameType: { type: "string", enum: intentNameTypes },
    themes: {
      type: "array",
      items: { type: "string", enum: intentThemes },
      uniqueItems: true,
      maxItems: 5,
    },
    styles: {
      type: "array",
      items: { type: "string", enum: intentStyles },
      uniqueItems: true,
      maxItems: 3,
    },
    mode: { type: "string", enum: intentModes },
    usage: { type: "string", enum: intentUsages },
    softSignals: {
      type: "array",
      items: { type: "string", enum: intentSoftSignals },
      uniqueItems: true,
      maxItems: 5,
    },
    surnamePopularity: {
      type: "string",
      enum: intentSurnamePopularity,
    },
    avoidThemes: {
      type: "array",
      items: { type: "string", enum: intentThemes },
      uniqueItems: true,
      maxItems: 5,
    },
  },
  required: [
    "gender",
    "nameType",
    "themes",
    "styles",
    "mode",
    "usage",
    "softSignals",
    "surnamePopularity",
    "avoidThemes",
  ],
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAllowed<T extends readonly string[]>(
  value: unknown,
  allowed: T,
): value is T[number] {
  return typeof value === "string" && allowed.includes(value);
}

function parseAllowedArray<T extends readonly string[]>(
  value: unknown,
  allowed: T,
  maxItems: number,
): T[number][] | undefined {
  if (!Array.isArray(value) || value.length > maxItems) return undefined;
  if (!value.every((item) => isAllowed(item, allowed))) return undefined;
  return [...new Set(value)] as T[number][];
}

export function parseNameIntent(value: unknown): NameIntent | undefined {
  if (!isRecord(value)) return undefined;
  const keys = Object.keys(value);
  const expectedKeys = Object.keys(nameIntentJsonSchema.properties);
  if (
    keys.length !== expectedKeys.length ||
    keys.some((key) => !expectedKeys.includes(key))
  ) {
    return undefined;
  }

  const themes = parseAllowedArray(value.themes, intentThemes, 5);
  const styles = parseAllowedArray(value.styles, intentStyles, 3);
  const softSignals = parseAllowedArray(
    value.softSignals,
    intentSoftSignals,
    5,
  );
  const avoidThemes = parseAllowedArray(value.avoidThemes, intentThemes, 5);
  if (
    !isAllowed(value.gender, intentGenders) ||
    !isAllowed(value.nameType, intentNameTypes) ||
    !themes ||
    !styles ||
    !isAllowed(value.mode, intentModes) ||
    !isAllowed(value.usage, intentUsages) ||
    !softSignals ||
    !isAllowed(value.surnamePopularity, intentSurnamePopularity) ||
    !avoidThemes
  ) {
    return undefined;
  }

  return {
    gender: value.gender,
    nameType: value.nameType,
    themes,
    styles,
    mode: value.mode,
    usage: value.usage,
    softSignals,
    surnamePopularity: value.surnamePopularity,
    avoidThemes,
  };
}
