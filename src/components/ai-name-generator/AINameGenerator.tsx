"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AIRecommendationCard } from "@/components/ai-name-generator/AIRecommendationCard";
import { trackEvent } from "@/lib/analytics";
import type {
  AINameGeneratorResponse,
  AINameGeneratorSuccess,
  NameIntent,
} from "@/lib/ai/schema";

const examples = [
  "A mysterious Japanese name for an anime villain connected with fire",
  "A traditional Japanese boy name meaning hope",
  "An elegant Japanese girl name related to the moon",
  "A modern full Japanese name for a game character",
] as const;

function label(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function intentChips(intent: NameIntent) {
  return [
    intent.gender !== "any" ? label(intent.gender) : undefined,
    label(intent.nameType),
    ...intent.themes.map(label),
    ...intent.styles.map(label),
    ...intent.softSignals.map((signal) => `${label(signal)} tone`),
    intent.usage !== "other" ? label(intent.usage) : undefined,
    intent.mode === "fiction_friendly" ? "Fiction-friendly" : "Realistic",
  ].filter((item): item is string => Boolean(item));
}

export function AINameGenerator() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [loadingMessage, setLoadingMessage] = useState("Understanding your idea…");
  const [result, setResult] = useState<AINameGeneratorSuccess>();
  const [error, setError] = useState<string>();
  const [variant, setVariant] = useState(0);
  const characterCount = [...prompt].length;
  const chips = useMemo(
    () => (result ? intentChips(result.intent) : []),
    [result],
  );

  useEffect(() => {
    if (status !== "loading") return;
    setLoadingMessage("Understanding your idea…");
    const matchingTimer = window.setTimeout(
      () => setLoadingMessage("Matching source-backed Japanese names…"),
      700,
    );
    const rankingTimer = window.setTimeout(
      () => setLoadingMessage("Ranking the strongest matches…"),
      1_500,
    );
    return () => {
      window.clearTimeout(matchingTimer);
      window.clearTimeout(rankingTimer);
    };
  }, [status]);

  async function generate(requestedVariant: number) {
    const normalizedPrompt = prompt.trim();
    if (!normalizedPrompt) {
      setError("Describe the Japanese name you want before generating.");
      setStatus("error");
      return;
    }
    if ([...normalizedPrompt].length > 500) {
      setError("Keep your description to 500 characters or fewer.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(undefined);
    trackEvent("ai_name_generator_submit", {
      prompt_length: [...normalizedPrompt].length,
      variant: requestedVariant,
    });
    try {
      const response = await fetch("/api/ai-name-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: normalizedPrompt, variant: requestedVariant }),
      });
      const data = (await response.json()) as AINameGeneratorResponse;
      if (!response.ok || !data.ok) {
        const message = data.ok
          ? "We could not generate names right now."
          : data.message;
        setError(message);
        setStatus("error");
        trackEvent("ai_name_generator_error", {
          code: data.ok ? "unknown" : data.code,
        });
        return;
      }

      setResult(data);
      setVariant(requestedVariant);
      setStatus("success");
      trackEvent("ai_name_generator_success", {
        parser: data.parser,
        gender: data.intent.gender,
        usage: data.intent.usage,
        name_type: data.intent.nameType,
        themes: data.intent.themes.join("|"),
        result_count: data.results.length,
        relaxed_count: data.relaxedPreferences.length,
      });
    } catch {
      setError("The generator could not connect. Please try again shortly.");
      setStatus("error");
      trackEvent("ai_name_generator_error", { code: "network_error" });
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void generate(0);
  }

  return (
    <section aria-labelledby="ai-generator-heading" id="ai-generator">
      <form
        className="surface overflow-hidden border-[#d9cfdd] shadow-[var(--shadow)]"
        onSubmit={submit}
      >
        <div className="border-b border-[#ded3e0] bg-[#f0eaf1] px-5 py-3">
          <h2 className="text-lg font-semibold" id="ai-generator-heading">
            Describe the Japanese name you want
          </h2>
        </div>
        <div className="p-4 sm:p-6">
          <label className="grid gap-2 text-sm font-bold" htmlFor="ai-name-prompt">
            Your description
            <textarea
              aria-describedby="prompt-help prompt-count"
              className="field min-h-36 resize-y !p-4 leading-6"
              id="ai-name-prompt"
              maxLength={500}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="A strong but gentle Japanese girl name related to the moon"
              value={prompt}
            />
          </label>
          <div className="mt-2 flex items-start justify-between gap-4 text-xs text-[#647068]">
            <p id="prompt-help">
              Describe a gender, theme, style, use, or whether you want a full name or surname.
            </p>
            <p className="shrink-0" id="prompt-count">
              {characterCount}/500
            </p>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#747d77]">
              Try an example
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {examples.map((example) => (
                <button
                  className="rounded-full border border-[#d7cdd9] bg-[#f7f2f8] px-3 py-2 text-left text-xs font-medium text-[#675169] hover:border-[#8b718d]"
                  key={example}
                  onClick={() => {
                    setPrompt(example);
                    setError(undefined);
                    setStatus("idle");
                  }}
                  type="button"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#e3dce5] pt-5">
            <button
              className="button-primary"
              disabled={status === "loading" || !prompt.trim()}
              type="submit"
            >
              {status === "loading" ? "Generating…" : "Generate Names"}
            </button>
            <p className="text-xs leading-5 text-[#747d77]">
              Your full description is sent only to the configured parser and is not included in analytics.
            </p>
          </div>
        </div>
      </form>

      {status === "loading" ? (
        <div className="surface mt-5 p-8 text-center" aria-live="polite">
          <div className="mx-auto size-10 animate-pulse rounded-full border-4 border-[#d9cadd] border-t-[#675169]" />
          <p className="mt-4 font-semibold">{loadingMessage}</p>
          <p className="mt-2 text-sm text-[#647068]">
            The model interprets preferences; the local database supplies every name.
          </p>
        </div>
      ) : null}

      {status === "error" && error ? (
        <div
          className="mt-5 rounded-2xl border border-[#dfc4bd] bg-[#f8ece8] p-5 text-[#713f34]"
          role="alert"
        >
          <p className="font-semibold">We couldn&apos;t generate names</p>
          <p className="mt-2 text-sm leading-6">{error}</p>
        </div>
      ) : null}

      {status === "success" && result ? (
        <div className="mt-8" aria-live="polite">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Interpreted preferences</p>
              <h2 className="mt-2 text-2xl font-semibold">Your personalized matches</h2>
            </div>
            <button
              className="button-secondary"
              onClick={() => void generate(variant + 1 > 20 ? 0 : variant + 1)}
              type="button"
            >
              Try another set
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span className="chip" key={chip}>{chip}</span>
            ))}
          </div>
          {result.notice ? (
            <p className="mt-4 rounded-xl border border-[#ded6c4] bg-[#f7f3e8] px-4 py-3 text-xs leading-5 text-[#6c5b35]">
              {result.notice}
            </p>
          ) : null}
          {result.relaxedPreferences.length > 0 ? (
            <p className="mt-4 rounded-xl border border-[#ded6c4] bg-[#f7f3e8] px-4 py-3 text-sm leading-6 text-[#6c5b35]">
              We broadened {result.relaxedPreferences.join(", ")} to keep the recommendations useful.
            </p>
          ) : null}
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {result.results.map((recommendation) => (
              <AIRecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
