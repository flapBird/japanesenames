import type { FirstNameVariation } from "@/types/names";

export function getMeaningPreview(variation: FirstNameVariation) {
  // Dictionary gloss order is not name-specific: e.g. 阿 can begin with
  // "Africa". Do not turn these glosses into a purported full-name meaning.
  if (variation.meaningEvidence === "dictionary_glosses") {
    return "Name meaning not established from character glosses.";
  }
  const meaning =
    variation.meanings.join("; ");

  return meaning
    ? `${meaning.charAt(0).toUpperCase()}${meaning.slice(1)}`
    : "Meaning not available";
}
