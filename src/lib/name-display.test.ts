import { describe, expect, it } from "vitest";
import { getMeaningPreview } from "@/lib/name-display";
import type { FirstNameVariation } from "@/types/names";

const baseVariation: FirstNameVariation = {
  kanji: "愛",
  meanings: ["愛: love, affection, favourite"],
  kanjiBreakdown: [{ kanji: "愛", meanings: ["love", "affection", "favourite"] }],
  naturalness: "high",
  verificationStatus: "partially_verified",
};

describe("getMeaningPreview", () => {
  it("uses one concise gloss per kanji for dictionary-supported forms", () => {
    expect(
      getMeaningPreview({
        ...baseVariation,
        meaningEvidence: "dictionary_glosses",
      }),
    ).toBe("Love");
  });

  it("joins multi-kanji glosses without repeating the kanji", () => {
    expect(
      getMeaningPreview({
        ...baseVariation,
        kanji: "日香",
        kanjiBreakdown: [
          { kanji: "日", meanings: ["sun", "day"] },
          { kanji: "香", meanings: ["fragrance"] },
        ],
        meaningEvidence: "dictionary_glosses",
      }),
    ).toBe("Sun + fragrance");
  });

  it("preserves editorial meanings", () => {
    expect(
      getMeaningPreview({
        ...baseVariation,
        meanings: ["Beloved", "Warm-hearted"],
        meaningEvidence: "editorially_reviewed",
      }),
    ).toBe("Beloved; Warm-hearted");
  });
});
