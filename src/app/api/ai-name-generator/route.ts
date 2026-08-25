import { NextResponse } from "next/server";
import { parseIntentWithFallback } from "@/lib/ai/fallback-parser";
import {
  isAIProviderConfigured,
  parseIntentWithProvider,
} from "@/lib/ai/provider";
import { checkAIRateLimit } from "@/lib/ai/rate-limit";
import { recommendNames } from "@/lib/ai/recommend-names";
import type {
  AINameGeneratorError,
  AINameGeneratorSuccess,
} from "@/lib/ai/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(
  status: number,
  code: AINameGeneratorError["code"],
  message: string,
  headers?: HeadersInit,
) {
  return NextResponse.json<AINameGeneratorError>(
    { ok: false, code, message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        ...headers,
      },
    },
  );
}

export async function POST(request: Request) {
  if (process.env.AI_NAME_GENERATOR_ENABLED === "false") {
    return errorResponse(
      503,
      "feature_disabled",
      "The AI name generator is temporarily unavailable.",
    );
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 4_096) {
    return errorResponse(
      400,
      "prompt_too_long",
      "Keep your description to 500 characters or fewer.",
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid_request", "Send a valid JSON request.");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return errorResponse(400, "invalid_request", "Send a valid request body.");
  }
  const record = body as Record<string, unknown>;
  const prompt = typeof record.prompt === "string" ? record.prompt.trim() : "";
  const variant =
    typeof record.variant === "number" &&
    Number.isInteger(record.variant) &&
    record.variant >= 0 &&
    record.variant <= 20
      ? record.variant
      : 0;
  if (!prompt) {
    return errorResponse(
      400,
      "empty_prompt",
      "Describe the Japanese name you want.",
    );
  }
  if ([...prompt].length > 500) {
    return errorResponse(
      400,
      "prompt_too_long",
      "Keep your description to 500 characters or fewer.",
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];
  const rateLimitKey =
    forwardedFor?.trim() || request.headers.get("x-real-ip") || "local";
  const rateLimit = checkAIRateLimit(rateLimitKey);
  if (!rateLimit.allowed) {
    return errorResponse(
      429,
      "rate_limited",
      "Too many requests. Please wait a few minutes and try again.",
      { "Retry-After": String(rateLimit.retryAfter) },
    );
  }

  const providerConfigured = isAIProviderConfigured();
  const providerIntent = providerConfigured
    ? await parseIntentWithProvider(prompt)
    : undefined;
  const parser = providerIntent ? "ai" : "fallback";
  const intent = providerIntent ?? parseIntentWithFallback(prompt);
  const { results, relaxedPreferences } = recommendNames(
    intent,
    prompt,
    variant,
  );
  if (results.length === 0) {
    return errorResponse(
      503,
      "no_results",
      "No reviewed name records are available for this request.",
    );
  }

  const response: AINameGeneratorSuccess = {
    ok: true,
    intent,
    parser,
    results,
    relaxedPreferences,
    notice:
      parser === "fallback"
        ? providerConfigured
          ? "The AI parser was unavailable, so we used local keyword matching."
          : "Local keyword matching is active. Configure an AI provider for richer intent parsing."
        : undefined,
  };
  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-RateLimit-Remaining": String(rateLimit.remaining),
    },
  });
}
