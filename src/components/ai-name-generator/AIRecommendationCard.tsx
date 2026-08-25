"use client";

import Link from "next/link";
import { CopyButton } from "@/components/shared/CopyButton";
import { FavoriteButton } from "@/components/shared/FavoriteButton";
import { PronunciationButton } from "@/components/shared/PronunciationButton";
import type { AINameRecommendation } from "@/lib/ai/schema";

const evidenceTone = {
  direct: "border-[#aac0b1] bg-[#e7eee9] text-[#315c4b]",
  creative: "border-[#d8c7a7] bg-[#f7f1df] text-[#795a24]",
  source: "border-[#d7d7d0] bg-[#efeeea] text-[#68726b]",
};

export function AIRecommendationCard({
  recommendation,
}: {
  recommendation: AINameRecommendation;
}) {
  const favoriteKind =
    recommendation.kind === "full"
      ? "full_name"
      : recommendation.kind === "surname"
        ? "surname"
        : "first_name";
  const copyEvent =
    recommendation.kind === "full"
      ? "copy_full_name"
      : recommendation.kind === "surname"
        ? "copy_surname"
        : "copy_first_name";

  return (
    <article className="surface flex h-full flex-col border-t-[3px] border-t-[#8b718d] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.09em] text-[#747d77]">
            {recommendation.kind === "full"
              ? "Japanese full name"
              : recommendation.kind === "surname"
                ? "Japanese surname"
                : "Japanese given name"}
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
            {recommendation.romaji}
          </h3>
        </div>
        <div className="flex shrink-0 gap-2">
          <PronunciationButton
            label={recommendation.romaji}
            text={recommendation.pronunciation}
          />
          <FavoriteButton
            compact
            item={{
              id: recommendation.id,
              kind: favoriteKind,
              label: `${recommendation.kanji} · ${recommendation.romaji}`,
              sublabel: recommendation.meaning,
              pronunciation: recommendation.pronunciation,
              href: recommendation.detailHref,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid overflow-hidden rounded-xl border border-[#e3e2dc] sm:grid-cols-2">
        <div className="bg-[#faf9f5] p-4">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#747d77]">
            Kanji
          </p>
          <p className="japanese-display mt-2 text-4xl font-medium leading-tight">
            {recommendation.kanji}
          </p>
        </div>
        <div className="border-t border-[#e3e2dc] p-4 sm:border-l sm:border-t-0">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[#747d77]">
            Kana reading
          </p>
          <p className="japanese-display mt-2 text-lg font-medium">
            {recommendation.kana}
          </p>
          {recommendation.japaneseOrder && recommendation.westernOrder ? (
            <p className="mt-2 text-xs leading-5 text-[#747d77]">
              Japanese order shown in kanji · Western order shown in romaji
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#747d77]">
          Meaning
        </p>
        <p className="mt-2 text-sm leading-6 text-[#536058]">
          {recommendation.meaning}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {recommendation.matchTags.map((tag) => (
          <span
            className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-bold ${evidenceTone[tag.evidence]}`}
            key={`${tag.evidence}:${tag.label}`}
            title={
              tag.evidence === "creative"
                ? "A cautious creative fit, not a literal name meaning"
                : tag.evidence === "direct"
                  ? "Supported by stored meaning or editorial style data"
                  : "Stored source-backed spelling and reading"
            }
          >
            {tag.evidence === "creative" ? "Creative · " : ""}
            {tag.label}
          </span>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-[#f3f4ef] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#647068]">
          Why it fits
        </p>
        <p className="mt-2 text-sm leading-6 text-[#59645d]">
          {recommendation.whyItFits}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-[#e3e2dc] pt-5">
        <CopyButton
          eventName={copyEvent}
          label="Copy name"
          text={`${recommendation.kanji} — ${recommendation.romaji} — ${recommendation.kana}`}
        />
        {recommendation.useInGeneratorHref ? (
          <Link
            className="button-secondary !min-h-9 !px-3 !text-xs"
            href={recommendation.useInGeneratorHref}
          >
            Use in standard generator
          </Link>
        ) : null}
        {recommendation.detailHref ? (
          <Link
            className="button-quiet !min-h-9 !px-2 !text-xs"
            href={recommendation.detailHref}
          >
            View details
          </Link>
        ) : null}
      </div>
    </article>
  );
}
