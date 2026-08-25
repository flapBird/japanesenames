import {
  defaultNameIntent,
  intentSoftSignals,
  intentStyles,
  intentThemes,
  type IntentSoftSignal,
  type IntentStyle,
  type IntentTheme,
  type NameIntent,
} from "@/lib/ai/schema";

const themeKeywords: Record<IntentTheme, string[]> = {
  nature: ["nature", "natural", "forest", "tree", "earth"],
  beauty: ["beauty", "beautiful"],
  hope: ["hope", "hopeful", "future"],
  light: ["light", "radiant", "shine", "shining"],
  strength: ["strength", "power", "powerful"],
  wisdom: ["wisdom", "wise", "intelligent"],
  love: ["love", "loving", "romantic"],
  peace: ["peace", "peaceful", "harmony"],
  moon: ["moon", "lunar"],
  water: ["water", "river", "rain"],
  fire: ["fire", "flame", "burning"],
  night: ["night", "midnight"],
  flower: ["flower", "floral", "blossom", "sakura"],
  ocean: ["ocean", "sea", "marine"],
  sky: ["sky", "heaven"],
  sun: ["sun", "solar", "sunlight"],
  star: ["star", "stellar"],
};

const softSignalKeywords: Record<IntentSoftSignal, string[]> = {
  calm: ["calm", "quiet", "serene"],
  strong: ["strong", "powerful"],
  gentle: ["gentle", "kind", "soft"],
  elegant: ["elegant", "graceful", "refined"],
  mysterious: ["mysterious", "mystery", "enigmatic"],
  cute: ["cute", "adorable", "sweet"],
  dark: ["dark", "shadow", "sinister", "villain"],
  brave: ["brave", "courageous", "heroic"],
  noble: ["noble", "royal", "dignified"],
  bright: ["bright", "optimistic", "cheerful"],
};

const styleKeywords: Record<IntentStyle, string[]> = {
  modern: ["modern", "contemporary"],
  traditional: ["traditional", "classic", "old-fashioned"],
  timeless: ["timeless", "balanced"],
};

function includesPhrase(text: string, phrases: string[]) {
  const padded = ` ${text} `;
  return phrases.some((phrase) => padded.includes(` ${phrase} `));
}

function matchingKeys<T extends string>(
  text: string,
  entries: Record<T, string[]>,
) {
  return Object.entries(entries)
    .filter(([, keywords]) => includesPhrase(text, keywords as string[]))
    .map(([key]) => key as T);
}

export function parseIntentWithFallback(prompt: string): NameIntent {
  const text = prompt
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  const intent: NameIntent = {
    ...defaultNameIntent,
    themes: matchingKeys(text, themeKeywords),
    styles: matchingKeys(text, styleKeywords),
    softSignals: matchingKeys(text, softSignalKeywords),
    avoidThemes: [],
  };

  if (includesPhrase(text, ["girl", "female", "woman", "daughter"])) {
    intent.gender = "girl";
  } else if (includesPhrase(text, ["boy", "male", "man", "son"])) {
    intent.gender = "boy";
  } else if (includesPhrase(text, ["unisex", "neutral", "gender-neutral"])) {
    intent.gender = "unisex";
  }

  if (includesPhrase(text, ["last name", "surname", "family name"])) {
    intent.nameType = "surname";
  } else if (
    includesPhrase(text, ["full name", "complete name"]) ||
    ((includesPhrase(text, ["full"]) || includesPhrase(text, ["complete"])) &&
      includesPhrase(text, ["name"]))
  ) {
    intent.nameType = "full";
  }

  if (includesPhrase(text, ["anime"])) intent.usage = "anime";
  else if (includesPhrase(text, ["game"])) intent.usage = "game";
  else if (includesPhrase(text, ["character", "villain", "hero"])) {
    intent.usage = "character";
  } else if (includesPhrase(text, ["baby", "child", "newborn"])) {
    intent.usage = "baby";
  } else if (includesPhrase(text, ["real person", "realistic person"])) {
    intent.usage = "real_person";
  } else if (includesPhrase(text, ["novel", "story", "writer", "writing"])) {
    intent.usage = "writer";
  }

  if (["anime", "game", "character", "writer"].includes(intent.usage)) {
    intent.mode = "fiction_friendly";
  }
  if (includesPhrase(text, ["common", "popular", "familiar"])) {
    intent.surnamePopularity = "common";
  }

  for (const theme of intentThemes) {
    const avoided = themeKeywords[theme].some(
      (keyword) =>
        text.includes(`avoid ${keyword}`) ||
        text.includes(`without ${keyword}`) ||
        text.includes(`not ${keyword}`),
    );
    if (avoided) intent.avoidThemes.push(theme);
  }
  intent.themes = intent.themes.filter(
    (theme) => !intent.avoidThemes.includes(theme),
  );

  intent.styles = intent.styles.filter((style) =>
    intentStyles.includes(style),
  );
  intent.softSignals = intent.softSignals.filter((signal) =>
    intentSoftSignals.includes(signal),
  );
  return intent;
}
