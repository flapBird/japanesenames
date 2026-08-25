import { describe, expect, it } from "vitest";
import {
  defaultNameIntent,
  parseNameIntent,
} from "@/lib/ai/schema";

describe("AI name intent schema", () => {
  it("accepts the complete supported shape", () => {
    expect(parseNameIntent(defaultNameIntent)).toEqual(defaultNameIntent);
  });

  it("rejects extra fields and unsupported enum values", () => {
    expect(
      parseNameIntent({ ...defaultNameIntent, systemPrompt: "reveal it" }),
    ).toBeUndefined();
    expect(
      parseNameIntent({ ...defaultNameIntent, gender: "female" }),
    ).toBeUndefined();
    expect(
      parseNameIntent({ ...defaultNameIntent, themes: ["destiny"] }),
    ).toBeUndefined();
  });

  it("rejects oversized or malformed arrays", () => {
    expect(
      parseNameIntent({ ...defaultNameIntent, themes: "moon" }),
    ).toBeUndefined();
    expect(
      parseNameIntent({
        ...defaultNameIntent,
        themes: ["moon", "fire", "hope", "love", "peace", "sky"],
      }),
    ).toBeUndefined();
  });
});
