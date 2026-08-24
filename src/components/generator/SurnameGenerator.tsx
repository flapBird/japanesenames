"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import { PronunciationButton } from "@/components/shared/PronunciationButton";
import { trackEvent } from "@/lib/analytics";
import type { SurnameRecord } from "@/types/names";

export type SurnameGeneratorRecord = Pick<
  SurnameRecord,
  | "id"
  | "slug"
  | "kanji"
  | "hiragana"
  | "katakana"
  | "romaji"
  | "literalMeaning"
  | "kanjiBreakdown"
  | "popularityLevel"
  | "originTypes"
  | "isIndexable"
>;

type CommonnessFilter = "any" | "common" | "uncommon" | "rare" | "unranked";

function matchesCommonness(
  surname: SurnameGeneratorRecord,
  commonness: CommonnessFilter,
) {
  if (commonness === "any") return true;
  if (commonness === "common") {
    return ["very_common", "common"].includes(surname.popularityLevel);
  }
  return surname.popularityLevel === commonness;
}

export function SurnameGenerator({
  surnames,
  initialSurnameId,
}: {
  surnames: SurnameGeneratorRecord[];
  initialSurnameId: string;
}) {
  const [commonness, setCommonness] = useState<CommonnessFilter>("any");
  const [origin, setOrigin] = useState("any");
  const [currentSurnameId, setCurrentSurnameId] = useState(initialSurnameId);
  const origins = useMemo(
    () =>
      [...new Set(surnames.flatMap((surname) => surname.originTypes))]
        .filter((item) => item !== "uncertain")
        .sort(),
    [surnames],
  );
  const commonnessOptions = useMemo(() => {
    const options: Array<{ label: string; value: CommonnessFilter }> = [
      { label: "Any commonness", value: "any" },
    ];
    if (
      surnames.some((surname) =>
        ["very_common", "common"].includes(surname.popularityLevel),
      )
    ) {
      options.push({ label: "Common", value: "common" });
    }
    if (surnames.some((surname) => surname.popularityLevel === "uncommon")) {
      options.push({ label: "Uncommon", value: "uncommon" });
    }
    if (surnames.some((surname) => surname.popularityLevel === "rare")) {
      options.push({ label: "Rare", value: "rare" });
    }
    if (surnames.some((surname) => surname.popularityLevel === "unranked")) {
      options.push({ label: "Not ranked", value: "unranked" });
    }
    return options;
  }, [surnames]);
  const eligible = useMemo(
    () =>
      surnames.filter(
        (surname) =>
          matchesCommonness(surname, commonness) &&
          (origin === "any" || surname.originTypes.includes(origin as SurnameRecord["originTypes"][number])),
      ),
    [commonness, origin, surnames],
  );
  const current =
    eligible.find((surname) => surname.id === currentSurnameId) ?? eligible[0];

  function generateAgain() {
    if (eligible.length === 0) return;
    const alternatives = eligible.filter((surname) => surname.id !== current?.id);
    const pool = alternatives.length > 0 ? alternatives : eligible;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setCurrentSurnameId(picked.id);
    trackEvent("generate_surname", {
      commonness,
      origin,
      surnameId: picked.id,
    });
  }

  return (
    <section aria-labelledby="surname-generator-heading" id="surname-generator">
      <div className="surface overflow-hidden border-[#d3dfd7] shadow-[var(--shadow)]">
        <div className="border-b border-[#d3dfd7] bg-[#e8f0eb] px-5 py-3">
          <h2 className="text-lg font-semibold" id="surname-generator-heading">
            Generate a Japanese surname
          </h2>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <label className="grid gap-1.5 text-xs font-bold">
            Commonness
            <select
              className="field"
              onChange={(event) => {
                setCommonness(event.target.value as CommonnessFilter);
                setCurrentSurnameId("");
              }}
              value={commonness}
            >
              {commonnessOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Origin classification
            <select
              className="field capitalize"
              onChange={(event) => {
                setOrigin(event.target.value);
                setCurrentSurnameId("");
              }}
              value={origin}
            >
              <option value="any">Any classification</option>
              {origins.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <button
            className="button-primary w-full sm:col-span-2 lg:col-span-1 lg:w-auto"
            disabled={eligible.length === 0}
            onClick={generateAgain}
            type="button"
          >
            Generate Again
          </button>
        </div>
      </div>

      {current ? (
        <article className="surface mt-5 border-t-[3px] border-t-[#6f927f] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Generated Japanese last name</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                {current.romaji}
              </h2>
            </div>
            <div className="flex gap-2">
              <PronunciationButton label={current.romaji} text={current.hiragana} />
              <CopyButton
                label={`Copy ${current.romaji}`}
                text={`${current.kanji} · ${current.hiragana} · ${current.romaji}`}
              />
            </div>
          </div>

          <div className="mt-6 grid overflow-hidden rounded-2xl border border-[#d9ddd6] bg-[#fffefb] sm:grid-cols-2">
            <div className="bg-[#faf9f5] p-5 sm:p-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.09em] text-[#747d77]">
                Kanji
              </p>
              <p className="japanese-display mt-3 text-6xl font-medium leading-none">
                {current.kanji}
              </p>
            </div>
            <div className="border-t border-[#d9ddd6] p-5 sm:border-l sm:border-t-0 sm:p-6">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.09em] text-[#747d77]">
                Kana and romaji
              </p>
              <p className="japanese-display mt-3 text-2xl font-medium">
                {current.hiragana}
              </p>
              <p className="japanese-display mt-1 text-sm text-[#647068]">
                {current.katakana}
              </p>
              <p className="mt-3 font-semibold">{current.romaji}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-[#647068]">
                Literal meaning
              </h3>
              <p className="mt-2 text-lg font-semibold">{current.literalMeaning}</p>
              <dl className="mt-4 grid gap-2 border-t border-[#e3e2dc] pt-4">
                {current.kanjiBreakdown.map((part, index) => (
                  <div className="flex items-start justify-between gap-4 text-sm" key={`${part.kanji}-${index}`}>
                    <dt className="japanese-display text-lg font-semibold">{part.kanji}</dt>
                    <dd className="text-right text-[#647068]">{part.meanings.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <dl className="grid content-start gap-3 rounded-xl bg-[#f3f4ef] p-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#647068]">Commonness</dt>
                <dd className="font-semibold capitalize">
                  {current.popularityLevel.replace("_", " ")}
                </dd>
              </div>
              {current.originTypes.some((item) => item !== "uncertain") ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-[#647068]">Origin classification</dt>
                  <dd className="text-right font-semibold capitalize">
                    {current.originTypes.filter((item) => item !== "uncertain").join(", ")}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-[#e3e2dc] pt-5">
            <Link className="button-primary" href={`/?surname=${current.id}#generator`}>
              Use in a complete Japanese name
            </Link>
            {current.isIndexable ? (
              <Link className="button-secondary" href={`/surname/${current.slug}`}>
                Explore this surname
              </Link>
            ) : null}
          </div>
          <p className="mt-4 text-xs leading-5 text-[#747d77]">
            The meaning describes the written kanji. It does not prove one family origin or ancestry.
          </p>
        </article>
      ) : (
        <div className="surface mt-5 p-8 text-center">
          <p className="font-semibold">No reviewed surnames match these filters.</p>
          <p className="mt-2 text-sm text-[#647068]">Choose a broader commonness or origin filter.</p>
        </div>
      )}
    </section>
  );
}
