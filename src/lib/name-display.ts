import type { FirstNameVariation } from "@/types/names";

export function getMeaningPreview(variation: FirstNameVariation) {
  const meaning =
    variation.meaningEvidence === "dictionary_glosses"
      ? variation.kanjiBreakdown
          .map((part) => part.meanings[0]?.trim())
          .filter((part): part is string => Boolean(part))
          .join(" + ")
      : variation.meanings.join("; ");

  return meaning
    ? `${meaning.charAt(0).toUpperCase()}${meaning.slice(1)}`
    : "Meaning not available";
}
