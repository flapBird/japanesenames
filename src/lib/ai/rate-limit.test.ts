import { beforeEach, describe, expect, it } from "vitest";
import {
  checkAIRateLimit,
  resetAIRateLimitsForTests,
} from "@/lib/ai/rate-limit";

describe("AI request rate limit", () => {
  beforeEach(() => resetAIRateLimitsForTests());

  it("allows ten requests per key and rejects the next one", () => {
    for (let index = 0; index < 10; index += 1) {
      expect(checkAIRateLimit("visitor", 1_000).allowed).toBe(true);
    }
    const rejected = checkAIRateLimit("visitor", 1_000);
    expect(rejected.allowed).toBe(false);
    expect(rejected.retryAfter).toBeGreaterThan(0);
  });

  it("resets after the window", () => {
    for (let index = 0; index < 10; index += 1) {
      checkAIRateLimit("visitor", 1_000);
    }
    expect(checkAIRateLimit("visitor", 601_001).allowed).toBe(true);
  });
});
