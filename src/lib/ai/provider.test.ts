import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defaultNameIntent } from "@/lib/ai/schema";

vi.mock("server-only", () => ({}));

const originalEnv = { ...process.env };

function validPayload() {
  return {
    choices: [
      {
        finish_reason: "stop",
        message: { content: JSON.stringify(defaultNameIntent) },
      },
    ],
  };
}

describe("AI provider compatibility", () => {
  beforeEach(() => {
    process.env.AI_API_KEY = "test-key";
    process.env.AI_MODEL = "test-model";
    process.env.AI_BASE_URL = "https://provider.example/v1";
    process.env.AI_API_STYLE = "chat_completions";
    delete process.env.AI_RESPONSE_FORMAT;
    delete process.env.AI_MAX_OUTPUT_TOKENS;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("keeps strict JSON Schema as the default", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(validPayload()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { parseIntentWithProvider } = await import("@/lib/ai/provider");

    await expect(parseIntentWithProvider("A moon name")).resolves.toEqual(
      defaultNameIntent,
    );
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(request.body));
    expect(body.max_tokens).toBe(400);
    expect(body.response_format.type).toBe("json_schema");
  });

  it("supports JSON object mode with a larger default budget", async () => {
    process.env.AI_RESPONSE_FORMAT = "json_object";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(validPayload()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { parseIntentWithProvider } = await import("@/lib/ai/provider");

    await expect(parseIntentWithProvider("A moon name")).resolves.toEqual(
      defaultNameIntent,
    );
    const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(request.body));
    expect(body.max_tokens).toBe(1_200);
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(body.messages[0].content).toContain('"additionalProperties":false');
  });

  it("logs safe server diagnostics when a provider returns no content", async () => {
    process.env.AI_RESPONSE_FORMAT = "json_object";
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [
              {
                finish_reason: "length",
                message: { content: null, reasoning_content: "private reasoning" },
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );
    const { parseIntentWithProvider } = await import("@/lib/ai/provider");

    await expect(parseIntentWithProvider("private user prompt")).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      "[AI name parser] Provider fallback",
      expect.objectContaining({
        event: "missing_content",
        finishReason: "length",
        hasReasoningContent: true,
      }),
    );
    expect(JSON.stringify(warn.mock.calls)).not.toContain("private user prompt");
    expect(JSON.stringify(warn.mock.calls)).not.toContain("test-key");
    expect(JSON.stringify(warn.mock.calls)).not.toContain("private reasoning");
  });
});
