import { describe, expect, it } from "vitest";
import { getMeaningPreview } from "@/lib/name-display";
import type { FirstNameVariation } from "@/types/names";

const base: FirstNameVariation = {
  kanji: "阿愛", meanings: ["阿: Africa", "愛: love"],
  kanjiBreakdown: [{ kanji: "阿", meanings: ["Africa", "flatter"] }, { kanji: "愛", meanings: ["love"] }],
  naturalness: "medium", verificationStatus: "partially_verified", meaningEvidence: "dictionary_glosses",
};
describe("name meaning evidence", () => {
  it("does not turn dictionary abbreviations into a person's name meaning", () => {
    expect(getMeaningPreview(base)).toBe("Name meaning not established from character glosses.");
    expect(getMeaningPreview(base)).not.toMatch(/Africa|love|\+/);
  });
  it("does not infer a combined meaning even when character glosses sound plausible", () => {
    expect(getMeaningPreview({ ...base, kanji: "日香", kanjiBreakdown: [{ kanji: "日", meanings: ["sun"] }, { kanji: "香", meanings: ["fragrance"] }] })).not.toContain("Sun + fragrance");
  });
  it("preserves written-form editorial explanations and handles missing ones", () => {
    expect(getMeaningPreview({ ...base, meaningEvidence: "editorially_reviewed", meanings: ["light", "lamp"] })).toBe("Light; lamp");
    expect(getMeaningPreview({ ...base, meaningEvidence: undefined, meanings: [] })).toBe("Meaning not available");
  });
});
